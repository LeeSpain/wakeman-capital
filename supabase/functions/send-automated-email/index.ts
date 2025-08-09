import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AutomatedEmailRequest {
  template_id: string;
  recipient_user_id: string;
  trigger_event: string;
  variables?: Record<string, any>;
}

const processTemplate = (content: string, variables: Record<string, any>): string => {
  let processedContent = content;
  
  // Replace all variables in the format {{variable_name}}
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processedContent = processedContent.replace(regex, value?.toString() || '');
  }
  
  return processedContent;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { template_id, recipient_user_id, trigger_event, variables = {} }: AutomatedEmailRequest = await req.json();

    // Get email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', template_id)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      throw new Error('Email template not found or inactive');
    }

    // Get recipient user data
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(recipient_user_id);
    
    if (userError || !userData.user?.email) {
      throw new Error('Recipient user not found or no email address');
    }

    // Get profile data for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, first_name, last_name')
      .eq('id', recipient_user_id)
      .single();

    // Get latest profit data if needed
    const { data: profitData } = await supabase
      .from('profit_calculations')
      .select('profit_amount, fee_amount, calculation_date')
      .eq('user_id', recipient_user_id)
      .order('calculation_date', { ascending: false })
      .limit(1)
      .single();

    // Get email settings
    const { data: settings } = await supabase
      .from('email_settings')
      .select('*')
      .limit(1)
      .single();

    const senderEmail = settings?.sender_email || 'wakemancapitallive@gmail.com';
    const senderName = settings?.sender_name || 'Wakeman Capital';

    // Prepare template variables
    const displayName = profile?.display_name || 
                       (profile?.first_name && profile?.last_name 
                         ? `${profile.first_name} ${profile.last_name}` 
                         : userData.user.email.split('@')[0]);

    const templateVariables = {
      client_name: displayName,
      client_email: userData.user.email,
      profit_amount: profitData?.profit_amount ? `$${Number(profitData.profit_amount).toFixed(2)}` : '$0.00',
      fee_amount: profitData?.fee_amount ? `$${Number(profitData.fee_amount).toFixed(2)}` : '$0.00',
      client_share: profitData?.profit_amount && profitData?.fee_amount 
        ? `$${(Number(profitData.profit_amount) - Number(profitData.fee_amount)).toFixed(2)}` 
        : '$0.00',
      billing_date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      total_profits: profitData?.profit_amount ? `$${Number(profitData.profit_amount).toFixed(2)}` : '$0.00',
      total_fees: profitData?.fee_amount ? `$${Number(profitData.fee_amount).toFixed(2)}` : '$0.00',
      payment_status: 'Processed',
      ...variables // Allow override with custom variables
    };

    // Process template content
    const processedSubject = processTemplate(template.subject, templateVariables);
    const processedHtmlContent = processTemplate(template.html_content, templateVariables);
    const processedTextContent = template.text_content 
      ? processTemplate(template.text_content, templateVariables) 
      : undefined;

    // Send email
    const emailResponse = await resend.emails.send({
      from: `${senderName} <${senderEmail}>`,
      to: [userData.user.email],
      subject: processedSubject,
      html: processedHtmlContent,
      text: processedTextContent,
    });

    if (emailResponse.error) {
      throw emailResponse.error;
    }

    // Record email history
    await supabase.from('email_history').insert({
      recipient_email: userData.user.email,
      recipient_user_id: recipient_user_id,
      subject: processedSubject,
      template_id: template_id,
      status: 'sent'
    });

    console.log(`Automated email sent successfully to ${userData.user.email} for event: ${trigger_event}`);

    return new Response(JSON.stringify({
      success: true,
      email_id: emailResponse.data?.id,
      recipient: userData.user.email,
      template_used: template.name,
      trigger_event
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-automated-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);