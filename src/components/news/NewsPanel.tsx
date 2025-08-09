import { AlertTriangle, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { NewsEvent } from '../../hooks/useNewsAlerts'
import { format } from 'date-fns'

interface NewsPanelProps {
  events: NewsEvent[]
  isWithinDangerZone: boolean
}

export function NewsPanel({ events, isWithinDangerZone }: NewsPanelProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Economic Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No high impact events in the next 2 hours</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Economic Calendar
          {isWithinDangerZone && (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event, index) => {
          const isInDangerZone = event.minutes_until_event <= 30 && event.minutes_until_event >= -30
          const eventTime = new Date(event.event_time)
          
          return (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${
                isInDangerZone 
                  ? 'border-destructive bg-destructive/5' 
                  : 'border-border bg-muted/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{event.event_name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {format(eventTime, 'HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant={isInDangerZone ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {event.affected_currencies.join(', ')}
                  </Badge>
                  <span className={`text-xs font-medium ${
                    isInDangerZone ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {event.minutes_until_event > 0 
                      ? `${Math.round(event.minutes_until_event)}m` 
                      : event.minutes_until_event >= -30 
                        ? 'LIVE' 
                        : 'PAST'
                    }
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}