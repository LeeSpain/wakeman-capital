import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EconomicEvent {
  event_name: string
  event_time: string
  impact_level: 'high' | 'medium' | 'low'
  affected_currencies: string[]
  description?: string
  country?: string
  actual_value?: string
  forecast_value?: string
  previous_value?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Forex Factory news fetch...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // For now, we'll create sample high impact events
    // In production, this would fetch from Forex Factory RSS/API
    const now = new Date()
    const sampleEvents: EconomicEvent[] = [
      {
        event_name: 'Non-Farm Payrolls',
        event_time: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        impact_level: 'high',
        affected_currencies: ['USD'],
        description: 'US employment data release',
        country: 'United States',
        forecast_value: '185K'
      },
      {
        event_name: 'Interest Rate Decision',
        event_time: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
        impact_level: 'high',
        affected_currencies: ['EUR'],
        description: 'ECB Interest Rate Decision',
        country: 'Eurozone',
        forecast_value: '4.25%'
      },
      {
        event_name: 'GDP Growth Rate',
        event_time: new Date(now.getTime() + 25 * 60 * 1000).toISOString(), // 25 minutes from now (within danger zone)
        impact_level: 'high',
        affected_currencies: ['GBP'],
        description: 'UK GDP quarterly data',
        country: 'United Kingdom',
        forecast_value: '0.2%'
      }
    ]

    console.log(`Processing ${sampleEvents.length} economic events...`)

    // Clean up existing test events first
    const { error: deleteError } = await supabaseClient
      .from('economic_events')
      .delete()
      .in('event_name', ['Non-Farm Payrolls', 'Interest Rate Decision', 'GDP Growth Rate'])

    if (deleteError) {
      console.error('Error cleaning up test events:', deleteError)
    }

    // Insert new events into database
    for (const event of sampleEvents) {
      const { error } = await supabaseClient
        .from('economic_events')
        .insert({
          ...event,
          event_time: event.event_time,
          is_active: true
        })

      if (error) {
        console.error('Error inserting event:', error)
      } else {
        console.log(`Inserted event: ${event.event_name}`)
      }
    }

    // Clean up old events (older than 24 hours)
    const { error: cleanupError } = await supabaseClient
      .from('economic_events')
      .delete()
      .lt('event_time', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())

    if (cleanupError) {
      console.error('Error cleaning up old events:', cleanupError)
    }

    console.log('Forex Factory news fetch completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${sampleEvents.length} events`,
        events: sampleEvents.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in forex-factory-news function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})