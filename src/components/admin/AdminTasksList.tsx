import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useAdminTasks, AdminTask } from '../../hooks/useAdminTasks';
import { Plus, Check, Trash2, Edit, ChevronDown, ChevronUp, Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';

const AdminTasksList = () => {
  const { tasks, loading, addTask, updateTask, deleteTask } = useAdminTasks();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    due_date: ''
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status !== 'completed';
    return task.status === 'completed';
  });

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    await addTask({
      ...newTask,
      due_date: newTask.due_date || undefined
    });
    
    setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
    setShowAddForm(false);
  };

  const handleToggleComplete = async (task: AdminTask) => {
    await updateTask(task.id, {
      status: task.status === 'completed' ? 'pending' : 'completed'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    return <Flag className={`h-3 w-3 ${
      priority === 'high' ? 'text-destructive' : 
      priority === 'medium' ? 'text-primary' : 
      'text-muted-foreground'
    }`} />;
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading tasks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Admin To-Do List</CardTitle>
            <Badge variant="outline">{filteredTasks.length} tasks</Badge>
          </div>
          <div className="flex items-center gap-2">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <CardDescription>
          Keep track of admin tasks and priorities
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          {/* Add Task Section */}
          <div className="mb-4">
            {!showAddForm ? (
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Task
              </Button>
            ) : (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <Input
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Description (optional)..."
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
                <div className="flex gap-2">
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
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
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTask} size="sm">Add Task</Button>
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks found. Add your first task above.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                    task.status === 'completed' ? 'bg-muted/50 opacity-75' : 'bg-background'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-0.5 h-6 w-6 p-0"
                    onClick={() => handleToggleComplete(task)}
                  >
                    <Check className={`h-4 w-4 ${task.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(task.priority)}
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm mb-2 ${task.status === 'completed' ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {task.completed_at && (
                        <span>Completed {format(new Date(task.completed_at), 'MMM d, yyyy')}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingTask(task.id)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdminTasksList;