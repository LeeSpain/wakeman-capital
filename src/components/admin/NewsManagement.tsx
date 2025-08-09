import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { RefreshCw, Calendar, AlertTriangle } from 'lucide-react'
import { supabase } from '../../integrations/supabase/client'
import { useToast } from '../../hooks/use-toast'
import { format } from 'date-fns'

interface EconomicEvent {
  id: string
  event_name: string
  event_time: string
  impact_level: 'high' | 'medium' | 'low'
  affected_currencies: string[]
  description?: string
  country?: string
  is_active: boolean
}

export function NewsManagement() {
  const [events, setEvents] = useState<EconomicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('economic_events')
        .select('*')
        .order('event_time', { ascending: true })
        .limit(50)

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      toast({
        title: "Error",
        description: "Failed to fetch economic events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshNewsData = async () => {
    setRefreshing(true)
    try {
      const { error } = await supabase.functions.invoke('forex-factory-news')
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: "News data refreshed successfully",
      })
      
      // Refresh the events list
      await fetchEvents()
    } catch (error) {
      console.error('Error refreshing news:', error)
      toast({
        title: "Error",
        description: "Failed to refresh news data",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const toggleEventStatus = async (eventId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('economic_events')
        .update({ is_active: !currentStatus })
        .eq('id', eventId)

      if (error) throw error

      toast({
        title: "Success",
        description: `Event ${!currentStatus ? 'activated' : 'deactivated'}`,
      })

      // Update local state
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, is_active: !currentStatus }
          : event
      ))
    } catch (error) {
      console.error('Error updating event:', error)
      toast({
        title: "Error",
        description: "Failed to update event status",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            News Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading events...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            News Management
          </CardTitle>
          <Button 
            onClick={refreshNewsData}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh News
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-muted-foreground">No economic events found</p>
          ) : (
            events.map((event) => {
              const eventTime = new Date(event.event_time)
              const isUpcoming = eventTime > new Date()
              const isHighImpact = event.impact_level === 'high'
              
              return (
                <div 
                  key={event.id}
                  className={`p-4 rounded-lg border ${
                    isHighImpact && isUpcoming 
                      ? 'border-destructive bg-destructive/5' 
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium truncate">{event.event_name}</h4>
                        {isHighImpact && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{format(eventTime, 'PPpp')}</p>
                        {event.country && <p>Country: {event.country}</p>}
                        {event.description && <p>{event.description}</p>}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={isHighImpact ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {event.impact_level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.affected_currencies.join(', ')}
                        </Badge>
                        <Badge 
                          variant={event.is_active ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {event.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleEventStatus(event.id, event.is_active)}
                    >
                      {event.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}