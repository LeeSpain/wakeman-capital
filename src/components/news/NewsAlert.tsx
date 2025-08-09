import { AlertTriangle, Clock, TrendingDown } from 'lucide-react'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { NewsEvent } from '../../hooks/useNewsAlerts'

interface NewsAlertProps {
  events: NewsEvent[]
  isWithinDangerZone: boolean
}

export function NewsAlert({ events, isWithinDangerZone }: NewsAlertProps) {
  if (events.length === 0) return null

  const dangerEvents = events.filter(event => 
    event.minutes_until_event <= 30 && event.minutes_until_event >= -30
  )
  
  const upcomingEvents = events.filter(event => 
    event.minutes_until_event > 30 && event.minutes_until_event <= 120
  )

  return (
    <div className="space-y-3">
      {/* Danger Zone Alert */}
      {dangerEvents.length > 0 && (
        <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            <div className="flex items-center justify-between">
              <span>⚠️ HIGH IMPACT NEWS ACTIVE - Avoid Trading</span>
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="mt-2 space-y-1">
              {dangerEvents.map((event, index) => (
                <div key={index} className="text-sm flex items-center justify-between">
                  <span>{event.event_name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {event.affected_currencies.join(', ')}
                    </Badge>
                    <span className="text-xs">
                      {event.minutes_until_event > 0 
                        ? `${Math.round(event.minutes_until_event)}m` 
                        : 'LIVE'
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Upcoming High Impact News</div>
            <div className="space-y-1">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="text-sm flex items-center justify-between">
                  <span>{event.event_name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {event.affected_currencies.join(', ')}
                    </Badge>
                    <span className="text-xs">
                      {Math.round(event.minutes_until_event)}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}