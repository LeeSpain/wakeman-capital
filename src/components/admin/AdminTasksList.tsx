import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useAdminTasks, AdminTask } from '../../hooks/useAdminTasks';
import { 
  Plus, 
  CheckSquare, 
  Square, 
  Calendar, 
  Trash2, 
  Edit, 
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

const AdminTasksList = () => {
  const { tasks, loading, addTask, updateTask, deleteTask } = useAdminTasks();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    await addTask({
      title: newTask.title,
      description: newTask.description || undefined,
      priority: newTask.priority,
      status: 'pending',
      due_date: newTask.due_date || undefined
    });
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      due_date: ''
    });
    setShowAddForm(false);
  };

  const toggleTaskStatus = async (task: AdminTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: newStatus });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">Loading tasks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Admin To-Do List ({filteredTasks.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Add Task Form */}
            {showAddForm ? (
              <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                <Input
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Description (optional)..."
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="datetime-local"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTask} size="sm">
                    Add Task
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Task
              </Button>
            )}

            {/* Tasks List */}
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    task.status === 'completed' 
                      ? 'bg-muted/50 opacity-75' 
                      : 'bg-background hover:bg-muted/30'
                  }`}
                >
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {task.status === 'completed' ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                        }`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(task.due_date), 'MMM d, yyyy')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdminTasksList;