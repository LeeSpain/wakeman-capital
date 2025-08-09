import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TriggerEmailRequest {
  trigger_event: string;
  user_id: string;
  template_type?: string;
  variables?: Record<string, any>;
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

    const { trigger_event, user_id, template_type, variables = {} }: TriggerEmailRequest = await req.json();

    // Find active automated email rules for this trigger
    const { data: rules, error: rulesError } = await supabase
      .from('automated_email_rules')
      .select(`
        *,
        template:email_templates(*)
      `)
      .eq('trigger_event', trigger_event)
      .eq('is_active', true);

    if (rulesError) {
      throw rulesError;
    }

    if (!rules || rules.length === 0) {
      console.log(`No automated email rules found for trigger: ${trigger_event}`);
      return new Response(JSON.stringify({
        success: true,
        message: 'No automated email rules configured for this trigger',
        trigger_event
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const results = [];

    // Process each rule
    for (const rule of rules) {
      try {
        // Filter by template type if specified
        if (template_type && rule.template?.template_type !== template_type) {
          console.log(`Skipping rule ${rule.name} - template type mismatch`);
          continue;
        }

        // Apply delay if specified
        if (rule.delay_minutes > 0) {
          // In a production environment, you'd want to use a queue/scheduler
          // For now, we'll just send immediately but log the intended delay
          console.log(`Rule ${rule.name} has ${rule.delay_minutes} minute delay - sending immediately for demo`);
        }

        // Send automated email
        const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-automated-email', {
          body: {
            template_id: rule.template.id,
            recipient_user_id: user_id,
            trigger_event: trigger_event,
            variables: variables
          }
        });

        if (emailError) {
          console.error(`Failed to send automated email for rule ${rule.name}:`, emailError);
          results.push({
            rule_name: rule.name,
            status: 'failed',
            error: emailError.message
          });
        } else {
          console.log(`Successfully sent automated email for rule ${rule.name}`);
          results.push({
            rule_name: rule.name,
            status: 'sent',
            email_id: emailResult?.email_id
          });
        }
      } catch (error) {
        console.error(`Error processing rule ${rule.name}:`, error);
        results.push({
          rule_name: rule.name,
          status: 'failed',
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      trigger_event,
      rules_processed: rules.length,
      results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in trigger-automated-emails function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);