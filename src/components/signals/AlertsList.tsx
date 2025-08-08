import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../integrations/supabase/client'

type AlertRow = {
  id: string
  title: string
  message: string
  created_at: string
  severity: string
}

export const AlertsList: React.FC = () => {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<AlertRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    const fetchAlerts = async () => {
      const { data } = await supabase
        .from('alerts')
        .select('id, title, message, created_at, severity')
        .order('created_at', { ascending: false })
        .limit(50)
        .eq('user_id', user.id)
      setAlerts((data as AlertRow[]) ?? [])
      setLoading(false)
    }

    fetchAlerts()

    const channel = supabase
      .channel('public:alerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => fetchAlerts())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  if (!user) {
    return <p className="text-muted-foreground">Sign in to view and manage your trade alerts.</p>
  }

  if (loading) return <p className="text-muted-foreground">Loading alerts…</p>

  if (alerts.length === 0) return <p className="text-muted-foreground">No alerts yet.</p>

  return (
    <ul className="space-y-3">
      {alerts.map(a => (
        <li key={a.id} className="rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{a.title}</span>
            <span className="text-xs text-muted-foreground">{new Date(a.created_at).toUTCString()}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{a.message}</p>
        </li>
      ))}
    </ul>
  )
}
