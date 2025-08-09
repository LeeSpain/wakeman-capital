import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';

export interface AdminTask {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export const useAdminTasks = () => {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<AdminTask, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'completed_at'>) => {
    try {
      const { data, error } = await supabase
        .from('admin_tasks')
        .insert([{
          ...task,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<AdminTask>) => {
    try {
      const updateData = {
        ...updates,
        ...(updates.status === 'completed' && !updates.completed_at ? { completed_at: new Date().toISOString() } : {})
      };

      const { data, error } = await supabase
        .from('admin_tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};