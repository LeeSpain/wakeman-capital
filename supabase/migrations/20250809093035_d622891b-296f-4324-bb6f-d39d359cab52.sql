-- Create admin_tasks table
CREATE TABLE public.admin_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT admin_tasks_status_check CHECK (status IN ('pending', 'in_progress', 'completed')),
  CONSTRAINT admin_tasks_priority_check CHECK (priority IN ('low', 'medium', 'high'))
);

-- Enable Row Level Security
ALTER TABLE public.admin_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for admin-only access
CREATE POLICY "Admin can manage all tasks" 
ON public.admin_tasks 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_tasks_updated_at
BEFORE UPDATE ON public.admin_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();