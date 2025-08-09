import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { FileText, Plus, Edit, Eye } from 'lucide-react';
import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_type: string;
  is_active: boolean;
  created_at: string;
}

const EmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load email templates');
      } else {
        setTemplates(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    if (!editingTemplate) return;

    try {
      if (editingTemplate.id) {
        const { error } = await supabase
          .from('email_templates')
          .update({
            name: editingTemplate.name,
            subject: editingTemplate.subject,
            html_content: editingTemplate.html_content,
            text_content: editingTemplate.text_content,
            template_type: editingTemplate.template_type,
            is_active: editingTemplate.is_active
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
        toast.success('Template updated successfully!');
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert({
            name: editingTemplate.name,
            subject: editingTemplate.subject,
            html_content: editingTemplate.html_content,
            text_content: editingTemplate.text_content,
            template_type: editingTemplate.template_type,
            is_active: editingTemplate.is_active
          });

        if (error) throw error;
        toast.success('Template created successfully!');
      }

      setIsDialogOpen(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const createNewTemplate = () => {
    setEditingTemplate({
      id: '',
      name: '',
      subject: '',
      html_content: '',
      text_content: '',
      template_type: 'notification',
      is_active: true,
      created_at: new Date().toISOString()
    });
    setIsDialogOpen(true);
  };

  const editTemplate = (template: EmailTemplate) => {
    setEditingTemplate({ ...template });
    setIsDialogOpen(true);
  };

  const toggleTemplateStatus = async (template: EmailTemplate) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({ is_active: !template.is_active })
        .eq('id', template.id);

      if (error) throw error;
      
      toast.success(`Template ${template.is_active ? 'deactivated' : 'activated'}`);
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template status:', error);
      toast.error('Failed to update template status');
    }
  };

  const getTemplateTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-green-500';
      case 'notification': return 'bg-blue-500';
      case 'billing': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Email Templates</h3>
          <p className="text-sm text-muted-foreground">Manage your email templates for client communications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={createNewTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate?.id ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
            </DialogHeader>
            {editingTemplate && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-type">Template Type</Label>
                    <Select
                      value={editingTemplate.template_type}
                      onValueChange={(value) => setEditingTemplate({ ...editingTemplate, template_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="profit_update">Profit Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-subject">Subject Line</Label>
                  <Input
                    id="template-subject"
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-html">HTML Content</Label>
                  <Textarea
                    id="template-html"
                    value={editingTemplate.html_content}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, html_content: e.target.value })}
                    rows={12}
                    className="font-mono text-sm"
                    placeholder="Enter your HTML email template..."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Available variables: {`{{client_name}}, {{profit_amount}}, {{fee_amount}}, {{billing_date}}`}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveTemplate}>
                      {editingTemplate.id ? 'Update' : 'Create'} Template
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-sm">{template.subject}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Badge 
                    className={`text-xs ${getTemplateTypeBadgeColor(template.template_type)} text-white`}
                  >
                    {template.template_type}
                  </Badge>
                  <Badge variant={template.is_active ? "default" : "secondary"}>
                    {template.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(template.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editTemplate(template)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={template.is_active ? "destructive" : "default"}
                    onClick={() => toggleTemplateStatus(template)}
                  >
                    {template.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No email templates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first email template to start communicating with clients</p>
            <Button onClick={createNewTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailTemplates;