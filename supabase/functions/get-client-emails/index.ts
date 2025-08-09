import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Get all active client subscriptions
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('client_subscriptions')
      .select('user_id')
      .eq('subscription_status', 'active');

    if (subscriptionsError) {
      throw subscriptionsError;
    }

    const clients = [];
    
    // Get user emails and profile data for each subscription
    for (const subscription of subscriptions || []) {
      try {
        // Get user email from auth.users
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(subscription.user_id);
        
        if (!userError && userData.user?.email) {
          // Get profile data for display name
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, first_name, last_name')
            .eq('id', subscription.user_id)
            .single();

          // Get profit data for personalization
          const { data: profitData } = await supabase
            .from('profit_calculations')
            .select('profit_amount, fee_amount')
            .eq('user_id', subscription.user_id)
            .order('calculation_date', { ascending: false })
            .limit(1)
            .single();

          const displayName = profile?.display_name || 
                             (profile?.first_name && profile?.last_name 
                               ? `${profile.first_name} ${profile.last_name}` 
                               : userData.user.email.split('@')[0]);

          clients.push({
            id: subscription.user_id,
            email: userData.user.email,
            name: displayName,
            profit_amount: profitData?.profit_amount || 0,
            fee_amount: profitData?.fee_amount || 0,
            created_at: userData.user.created_at
          });
        }
      } catch (error) {
        console.error(`Error fetching data for user ${subscription.user_id}:`, error);
        // Continue with other users
      }
    }

    return new Response(JSON.stringify({
      success: true,
      clients,
      total_count: clients.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in get-client-emails function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);