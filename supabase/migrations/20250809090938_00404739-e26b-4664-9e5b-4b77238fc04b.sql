-- Create email management tables for admin dashboard

-- Email settings table for storing admin email configuration
CREATE TABLE public.email_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_email TEXT NOT NULL DEFAULT 'wakemancapitallive@gmail.com',
  sender_name TEXT NOT NULL DEFAULT 'Wakeman Capital',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email templates for different types of emails
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_type TEXT NOT NULL, -- 'welcome', 'notification', 'billing', 'profit_update'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email campaigns for bulk email sending
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  opened_count INTEGER NOT NULL DEFAULT 0,
  clicked_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'sending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email history tracking
CREATE TABLE public.email_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  recipient_user_id UUID,
  subject TEXT NOT NULL,
  template_id UUID REFERENCES public.email_templates(id),
  campaign_id UUID REFERENCES public.email_campaigns(id),
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'opened', 'clicked', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Automated email rules
CREATE TABLE public.automated_email_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL, -- 'user_signup', 'profit_generated', 'billing_due', 'subscription_status_change'
  template_id UUID NOT NULL REFERENCES public.email_templates(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all email tables
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_email_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for admin-only access
CREATE POLICY "Admin can manage email settings" ON public.email_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can manage email templates" ON public.email_templates FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can manage email campaigns" ON public.email_campaigns FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can view email history" ON public.email_history FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can manage automated email rules" ON public.automated_email_rules FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at columns
CREATE TRIGGER update_email_settings_updated_at BEFORE UPDATE ON public.email_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_automated_email_rules_updated_at BEFORE UPDATE ON public.automated_email_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email settings
INSERT INTO public.email_settings (sender_email, sender_name) VALUES ('wakemancapitallive@gmail.com', 'Wakeman Capital');

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, html_content, template_type) VALUES 
('Welcome Email', 'Welcome to Wakeman Capital - Your Trading Journey Begins', 
'<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<h1 style="color: #059669; text-align: center;">Welcome to Wakeman Capital!</h1>
<p>Dear {{client_name}},</p>
<p>We''re excited to welcome you to Wakeman Capital, where advanced trading strategies meet cutting-edge technology.</p>
<p><strong>What happens next:</strong></p>
<ul>
<li>You''ll receive access to our exclusive trading signals</li>
<li>Our AI-powered system will start working for you</li>
<li>You only pay when you profit (10% success fee)</li>
</ul>
<p>If you have any questions, feel free to reach out to our team.</p>
<p>Best regards,<br>The Wakeman Capital Team</p>
</body></html>', 'welcome'),

('Profit Notification', 'Great News! You''ve Generated Profit with Wakeman Capital', 
'<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<h1 style="color: #059669; text-align: center;">Congratulations on Your Profit!</h1>
<p>Dear {{client_name}},</p>
<p>Excellent news! Your account has generated a profit of <strong>${{profit_amount}}</strong> this period.</p>
<p><strong>Period Summary:</strong></p>
<ul>
<li>Total Profit: ${{profit_amount}}</li>
<li>Your Share: ${{client_share}}</li>
<li>Success Fee: ${{fee_amount}} (10%)</li>
</ul>
<p>Keep up the great work!</p>
<p>Best regards,<br>The Wakeman Capital Team</p>
</body></html>', 'notification'),

('Billing Reminder', 'Wakeman Capital - Billing Summary', 
'<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
<h1 style="color: #059669; text-align: center;">Your Billing Summary</h1>
<p>Dear {{client_name}},</p>
<p>Here''s your billing summary for the period ending {{billing_date}}.</p>
<p><strong>Billing Details:</strong></p>
<ul>
<li>Total Profits Generated: ${{total_profits}}</li>
<li>Success Fee (10%): ${{total_fees}}</li>
<li>Payment Status: {{payment_status}}</li>
</ul>
<p>Thank you for choosing Wakeman Capital!</p>
<p>Best regards,<br>The Wakeman Capital Team</p>
</body></html>', 'billing');