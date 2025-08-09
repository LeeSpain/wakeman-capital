import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Verify payment function started");

    // Get request body
    const { session_id } = await req.json();
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    // Create Supabase client with service role
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseService.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const user = userData.user;
    console.log("User authenticated:", user.id);

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Session retrieved:", session.id, "Payment status:", session.payment_status);

    // Update payment record in database
    const { error: paymentError } = await supabaseService
      .from("payments")
      .update({
        status: session.payment_status === "paid" ? "paid" : "failed",
        stripe_payment_intent_id: session.payment_intent,
        payment_method: session.payment_method_types?.[0] || null,
        paid_at: session.payment_status === "paid" ? new Date().toISOString() : null
      })
      .eq("stripe_session_id", session_id)
      .eq("user_id", user.id);

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
    }

    // If payment successful, update user profile
    if (session.payment_status === "paid") {
      const { error: profileError } = await supabaseService
        .from("profiles")
        .update({
          payment_status: "paid",
          access_level: "premium"
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
      }

      console.log("User access granted:", user.id);
    }

    return new Response(JSON.stringify({ 
      payment_status: session.payment_status,
      access_granted: session.payment_status === "paid"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Payment verification failed" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});