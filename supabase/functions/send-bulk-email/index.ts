import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkEmailRequest {
  campaign_id: string;
  recipients: string[];
  subject: string;
  html_content: string;
  text_content?: string;
}

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

    const { campaign_id, recipients, subject, html_content, text_content }: BulkEmailRequest = await req.json();

    // Get email settings
    const { data: settings } = await supabase
      .from('email_settings')
      .select('*')
      .limit(1)
      .single();

    const senderEmail = settings?.sender_email || 'wakemancapitallive@gmail.com';
    const senderName = settings?.sender_name || 'Wakeman Capital';

    let sentCount = 0;
    const results = [];

    // Send emails to all recipients
    for (const recipient of recipients) {
      try {
        const emailResponse = await resend.emails.send({
          from: `${senderName} <${senderEmail}>`,
          to: [recipient],
          subject: subject,
          html: html_content,
          text: text_content,
        });

        // Record email history
        await supabase.from('email_history').insert({
          recipient_email: recipient,
          subject: subject,
          campaign_id: campaign_id,
          status: 'sent'
        });

        sentCount++;
        results.push({ email: recipient, status: 'sent', id: emailResponse.data?.id });
      } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error);
        results.push({ email: recipient, status: 'failed', error: error.message });
      }
    }

    // Update campaign status and counts
    await supabase
      .from('email_campaigns')
      .update({
        status: 'sent',
        sent_count: sentCount,
        sent_at: new Date().toISOString()
      })
      .eq('id', campaign_id);

    return new Response(JSON.stringify({
      success: true,
      sent_count: sentCount,
      total_recipients: recipients.length,
      results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-bulk-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);