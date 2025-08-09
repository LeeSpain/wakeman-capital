import { useEffect, useState } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useToast } from './use-toast'

export interface NewsEvent {
  event_id: string
  event_name: string
  event_time: string
  impact_level: 'high' | 'medium' | 'low'
  affected_currencies: string[]
  minutes_until_event: number
}

export function useNewsAlerts() {
  const [upcomingEvents, setUpcomingEvents] = useState<NewsEvent[]>([])
  const [isWithinDangerZone, setIsWithinDangerZone] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchNewsAlerts = async () => {
    try {
      const { data, error } = await supabase.rpc('is_within_news_buffer')
      
      if (error) {
        console.error('Error fetching news alerts:', error)
        return
      }

      setUpcomingEvents(data || [])
      
      // Check if any event is within 30 minutes
      const withinDangerZone = data?.some((event: NewsEvent) => 
        event.minutes_until_event <= 30 && event.minutes_until_event >= -30
      ) || false
      
      setIsWithinDangerZone(withinDangerZone)

      // Show toast for events within 30 minutes
      data?.forEach((event: NewsEvent) => {
        if (event.minutes_until_event <= 30 && event.minutes_until_event > 0) {
          toast({
            title: "⚠️ High Impact News Alert",
            description: `${event.event_name} in ${Math.round(event.minutes_until_event)} minutes. Avoid trading ${event.affected_currencies.join(', ')} pairs.`,
            variant: "destructive",
          })
        }
      })

    } catch (error) {
      console.error('Failed to fetch news alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNewsAlerts()
    
    // Refresh every minute
    const interval = setInterval(fetchNewsAlerts, 60000)
    
    // Set up real-time subscription
    const channel = supabase
      .channel('economic-events-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'economic_events' }, 
        () => {
          fetchNewsAlerts()
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    upcomingEvents,
    isWithinDangerZone,
    loading,
    refreshNewsAlerts: fetchNewsAlerts
  }
}