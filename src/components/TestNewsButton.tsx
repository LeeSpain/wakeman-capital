import { useState } from 'react'
import { Button } from './ui/button'
import { RefreshCw } from 'lucide-react'
import { supabase } from '../integrations/supabase/client'
import { useToast } from '../hooks/use-toast'

export function TestNewsButton() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const populateNewsData = async () => {
    setLoading(true)
    try {
      console.log('Calling forex-factory-news function...')
      const { data, error } = await supabase.functions.invoke('forex-factory-news')
      
      if (error) {
        console.error('Edge function error:', error)
        throw error
      }
      
      console.log('Edge function response:', data)
      
      toast({
        title: "Success",
        description: "Sample news data populated successfully! Check Dashboard and Signal Center.",
      })
    } catch (error) {
      console.error('Error populating news data:', error)
      toast({
        title: "Error",
        description: `Failed to populate news data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={populateNewsData}
      disabled={loading}
      className="mb-4"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Populating...' : 'Populate Sample News Data'}
    </Button>
  )
}