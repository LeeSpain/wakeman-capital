export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_agent_settings: {
        Row: {
          agent_id: string | null
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_settings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_templates: {
        Row: {
          business_knowledge: Json | null
          category: string
          conversation_rules: Json | null
          created_at: string
          default_settings: Json | null
          department: string
          description: string | null
          id: string
          name: string
          personality: string
          role: string
          training_data: Json | null
          updated_at: string
          voice_id: string | null
        }
        Insert: {
          business_knowledge?: Json | null
          category: string
          conversation_rules?: Json | null
          created_at?: string
          default_settings?: Json | null
          department: string
          description?: string | null
          id?: string
          name: string
          personality: string
          role: string
          training_data?: Json | null
          updated_at?: string
          voice_id?: string | null
        }
        Update: {
          business_knowledge?: Json | null
          category?: string
          conversation_rules?: Json | null
          created_at?: string
          default_settings?: Json | null
          department?: string
          description?: string | null
          id?: string
          name?: string
          personality?: string
          role?: string
          training_data?: Json | null
          updated_at?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      ai_agents: {
        Row: {
          avatar_config: Json | null
          business_knowledge: Json | null
          category: string | null
          conversation_rules: Json | null
          created_at: string
          department: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          personality: string | null
          role: string | null
          updated_at: string
          voice_id: string | null
        }
        Insert: {
          avatar_config?: Json | null
          business_knowledge?: Json | null
          category?: string | null
          conversation_rules?: Json | null
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          personality?: string | null
          role?: string | null
          updated_at?: string
          voice_id?: string | null
        }
        Update: {
          avatar_config?: Json | null
          business_knowledge?: Json | null
          category?: string | null
          conversation_rules?: Json | null
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          personality?: string | null
          role?: string | null
          updated_at?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      ai_coach_settings: {
        Row: {
          created_at: string
          id: string
          model: string
          provider: string
          system_prompt: string | null
          tools: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          model?: string
          provider?: string
          system_prompt?: string | null
          tools?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          model?: string
          provider?: string
          system_prompt?: string | null
          tools?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_coach_sources: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          agent_id: string | null
          conversation_data: Json | null
          conversion_score: number | null
          created_at: string
          ended_at: string | null
          id: string
          lead_id: string | null
          lead_qualified: boolean | null
          session_id: string
          started_at: string
          status: string | null
          updated_at: string
          visitor_id: string | null
        }
        Insert: {
          agent_id?: string | null
          conversation_data?: Json | null
          conversion_score?: number | null
          created_at?: string
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          lead_qualified?: boolean | null
          session_id: string
          started_at?: string
          status?: string | null
          updated_at?: string
          visitor_id?: string | null
        }
        Update: {
          agent_id?: string | null
          conversation_data?: Json | null
          conversion_score?: number | null
          created_at?: string
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          lead_qualified?: boolean | null
          session_id?: string
          started_at?: string
          status?: string | null
          updated_at?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_training_data: {
        Row: {
          agent_id: string | null
          answer: string
          category: string
          context: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          priority: number | null
          question: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          answer: string
          category: string
          context?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          answer?: string
          category?: string
          context?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_training_data_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          read_at: string | null
          severity: string
          source_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          severity?: string
          source_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          severity?: string
          source_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "watch_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      app_templates: {
        Row: {
          ai_generated_content: Json | null
          category: string
          core_industry_features: Json | null
          created_at: string
          customization_price: number | null
          description: string | null
          detailed_description: string | null
          foundation_features: Json | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          industry: string | null
          is_active: boolean | null
          is_popular: boolean | null
          key_features: Json | null
          premium_features: Json | null
          pricing: Json | null
          questionnaire_weight: Json | null
          sale_price: number | null
          template_config: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_generated_content?: Json | null
          category: string
          core_industry_features?: Json | null
          created_at?: string
          customization_price?: number | null
          description?: string | null
          detailed_description?: string | null
          foundation_features?: Json | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          industry?: string | null
          is_active?: boolean | null
          is_popular?: boolean | null
          key_features?: Json | null
          premium_features?: Json | null
          pricing?: Json | null
          questionnaire_weight?: Json | null
          sale_price?: number | null
          template_config?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_generated_content?: Json | null
          category?: string
          core_industry_features?: Json | null
          created_at?: string
          customization_price?: number | null
          description?: string | null
          detailed_description?: string | null
          foundation_features?: Json | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          industry?: string | null
          is_active?: boolean | null
          is_popular?: boolean | null
          key_features?: Json | null
          premium_features?: Json | null
          pricing?: Json | null
          questionnaire_weight?: Json | null
          sale_price?: number | null
          template_config?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      automated_email_rules: {
        Row: {
          conditions: Json | null
          created_at: string
          delay_minutes: number
          id: string
          is_active: boolean
          name: string
          template_id: string
          trigger_event: string
          updated_at: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          delay_minutes?: number
          id?: string
          is_active?: boolean
          name: string
          template_id: string
          trigger_event: string
          updated_at?: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          delay_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          template_id?: string
          trigger_event?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automated_email_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      backtesting_results: {
        Row: {
          avg_loser: number
          avg_winner: number
          created_at: string
          expectancy: number
          id: string
          losing_signals: number
          max_drawdown: number
          profit_factor: number
          sharpe_ratio: number | null
          signal_type: string
          symbol: string
          test_period_end: string
          test_period_start: string
          timeframe: string
          total_return: number
          total_signals: number
          updated_at: string
          win_rate: number
          winning_signals: number
        }
        Insert: {
          avg_loser?: number
          avg_winner?: number
          created_at?: string
          expectancy?: number
          id?: string
          losing_signals?: number
          max_drawdown?: number
          profit_factor?: number
          sharpe_ratio?: number | null
          signal_type: string
          symbol: string
          test_period_end: string
          test_period_start: string
          timeframe: string
          total_return?: number
          total_signals?: number
          updated_at?: string
          win_rate?: number
          winning_signals?: number
        }
        Update: {
          avg_loser?: number
          avg_winner?: number
          created_at?: string
          expectancy?: number
          id?: string
          losing_signals?: number
          max_drawdown?: number
          profit_factor?: number
          sharpe_ratio?: number | null
          signal_type?: string
          symbol?: string
          test_period_end?: string
          test_period_start?: string
          timeframe?: string
          total_return?: number
          total_signals?: number
          updated_at?: string
          win_rate?: number
          winning_signals?: number
        }
        Relationships: []
      }
      billing_records: {
        Row: {
          billing_period_end: string
          billing_period_start: string
          created_at: string
          id: string
          invoice_number: string | null
          payment_date: string | null
          status: string
          subscription_id: string
          total_fees: number
          total_profits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_period_end: string
          billing_period_start: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          payment_date?: string | null
          status?: string
          subscription_id: string
          total_fees?: number
          total_profits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          payment_date?: string | null
          status?: string
          subscription_id?: string
          total_fees?: number
          total_profits?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_records_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "client_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_annotations: {
        Row: {
          annotation_type: string
          created_at: string
          formed_at: string
          id: string
          metadata: Json | null
          price_high: number
          price_low: number
          signal_id: string
          strength: number | null
          timeframe: string
          updated_at: string
        }
        Insert: {
          annotation_type: string
          created_at?: string
          formed_at: string
          id?: string
          metadata?: Json | null
          price_high: number
          price_low: number
          signal_id: string
          strength?: number | null
          timeframe: string
          updated_at?: string
        }
        Update: {
          annotation_type?: string
          created_at?: string
          formed_at?: string
          id?: string
          metadata?: Json | null
          price_high?: number
          price_low?: number
          signal_id?: string
          strength?: number | null
          timeframe?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_annotations_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "signals_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      client_subscriptions: {
        Row: {
          created_at: string
          id: string
          last_billing_date: string | null
          next_billing_date: string | null
          profit_share_percentage: number
          subscription_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_billing_date?: string | null
          next_billing_date?: string | null
          profit_share_percentage?: number
          subscription_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_billing_date?: string | null
          next_billing_date?: string | null
          profit_share_percentage?: number
          subscription_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crawl_results: {
        Row: {
          created_at: string
          data: Json
          diff_summary: string | null
          id: string
          snapshot_hash: string | null
          source_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          diff_summary?: string | null
          id?: string
          snapshot_hash?: string | null
          source_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          diff_summary?: string | null
          id?: string
          snapshot_hash?: string | null
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crawl_results_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "watch_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          clicked_count: number
          created_at: string
          html_content: string
          id: string
          name: string
          opened_count: number
          recipient_count: number
          sent_at: string | null
          sent_count: number
          status: string
          subject: string
          text_content: string | null
          updated_at: string
        }
        Insert: {
          clicked_count?: number
          created_at?: string
          html_content: string
          id?: string
          name: string
          opened_count?: number
          recipient_count?: number
          sent_at?: string | null
          sent_count?: number
          status?: string
          subject: string
          text_content?: string | null
          updated_at?: string
        }
        Update: {
          clicked_count?: number
          created_at?: string
          html_content?: string
          id?: string
          name?: string
          opened_count?: number
          recipient_count?: number
          sent_at?: string | null
          sent_count?: number
          status?: string
          subject?: string
          text_content?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_history: {
        Row: {
          campaign_id: string | null
          clicked_at: string | null
          created_at: string
          id: string
          opened_at: string | null
          recipient_email: string
          recipient_user_id: string | null
          sent_at: string
          status: string
          subject: string
          template_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string
          id?: string
          opened_at?: string | null
          recipient_email: string
          recipient_user_id?: string | null
          sent_at?: string
          status?: string
          subject: string
          template_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string
          id?: string
          opened_at?: string | null
          recipient_email?: string
          recipient_user_id?: string | null
          sent_at?: string
          status?: string
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_history_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_settings: {
        Row: {
          created_at: string
          id: string
          sender_email: string
          sender_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          sender_email?: string
          sender_name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          sender_email?: string
          sender_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean
          name: string
          subject: string
          template_type: string
          text_content: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          template_type: string
          text_content?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          template_type?: string
          text_content?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      imbalances: {
        Row: {
          created_at: string
          direction: string
          fill_percentage: number | null
          filled_at: string | null
          formed_at: string
          high_level: number
          id: string
          imbalance_type: string
          is_active: boolean | null
          low_level: number
          significance: number
          symbol: string
          timeframe: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction: string
          fill_percentage?: number | null
          filled_at?: string | null
          formed_at: string
          high_level: number
          id?: string
          imbalance_type: string
          is_active?: boolean | null
          low_level: number
          significance?: number
          symbol: string
          timeframe: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: string
          fill_percentage?: number | null
          filled_at?: string | null
          formed_at?: string
          high_level?: number
          id?: string
          imbalance_type?: string
          is_active?: boolean | null
          low_level?: number
          significance?: number
          symbol?: string
          timeframe?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          form_data: Json | null
          id: string
          last_contact: string | null
          name: string
          next_follow_up: string | null
          notes: string | null
          phone: string | null
          priority: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          form_data?: Json | null
          id?: string
          last_contact?: string | null
          name: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          priority?: string
          source: string
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          form_data?: Json | null
          id?: string
          last_contact?: string | null
          name?: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          priority?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_data_cache: {
        Row: {
          close: number
          created_at: string
          high: number
          id: string
          low: number
          open: number
          symbol: string
          timeframe: string
          timestamp: string
          updated_at: string
          volume: number | null
        }
        Insert: {
          close: number
          created_at?: string
          high: number
          id?: string
          low: number
          open: number
          symbol: string
          timeframe: string
          timestamp: string
          updated_at?: string
          volume?: number | null
        }
        Update: {
          close?: number
          created_at?: string
          high?: number
          id?: string
          low?: number
          open?: number
          symbol?: string
          timeframe?: string
          timestamp?: string
          updated_at?: string
          volume?: number | null
        }
        Relationships: []
      }
      market_data_realtime: {
        Row: {
          close: number
          created_at: string
          high: number
          id: string
          low: number
          open: number
          source: string | null
          symbol: string
          timeframe: string
          timestamp: string
          updated_at: string
          volume: number | null
        }
        Insert: {
          close: number
          created_at?: string
          high: number
          id?: string
          low: number
          open: number
          source?: string | null
          symbol: string
          timeframe: string
          timestamp: string
          updated_at?: string
          volume?: number | null
        }
        Update: {
          close?: number
          created_at?: string
          high?: number
          id?: string
          low?: number
          open?: number
          source?: string | null
          symbol?: string
          timeframe?: string
          timestamp?: string
          updated_at?: string
          volume?: number | null
        }
        Relationships: []
      }
      market_structure: {
        Row: {
          created_at: string
          formed_at: string
          id: string
          is_active: boolean | null
          level_high: number
          level_low: number
          strength: number
          structure_type: string
          symbol: string
          tested_count: number | null
          timeframe: string
          updated_at: string
          volume_confirmation: boolean | null
        }
        Insert: {
          created_at?: string
          formed_at: string
          id?: string
          is_active?: boolean | null
          level_high: number
          level_low: number
          strength?: number
          structure_type: string
          symbol: string
          tested_count?: number | null
          timeframe: string
          updated_at?: string
          volume_confirmation?: boolean | null
        }
        Update: {
          created_at?: string
          formed_at?: string
          id?: string
          is_active?: boolean | null
          level_high?: number
          level_low?: number
          strength?: number
          structure_type?: string
          symbol?: string
          tested_count?: number | null
          timeframe?: string
          updated_at?: string
          volume_confirmation?: boolean | null
        }
        Relationships: []
      }
      oanda_accounts: {
        Row: {
          account_id: string
          api_token_encrypted: string
          connection_verified: boolean
          created_at: string
          environment: string
          id: string
          is_active: boolean
          last_verified_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          api_token_encrypted: string
          connection_verified?: boolean
          created_at?: string
          environment: string
          id?: string
          is_active?: boolean
          last_verified_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          api_token_encrypted?: string
          connection_verified?: boolean
          created_at?: string
          environment?: string
          id?: string
          is_active?: boolean
          last_verified_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      oanda_trades: {
        Row: {
          closed_at: string | null
          created_at: string
          current_price: number | null
          direction: string
          entry_price: number
          id: string
          oanda_account_id: string
          oanda_trade_id: string
          opened_at: string
          realized_pnl: number | null
          signal_id: string | null
          status: string
          stop_loss: number | null
          symbol: string
          take_profit: number | null
          units: number
          unrealized_pnl: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          current_price?: number | null
          direction: string
          entry_price: number
          id?: string
          oanda_account_id: string
          oanda_trade_id: string
          opened_at?: string
          realized_pnl?: number | null
          signal_id?: string | null
          status?: string
          stop_loss?: number | null
          symbol: string
          take_profit?: number | null
          units: number
          unrealized_pnl?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          current_price?: number | null
          direction?: string
          entry_price?: number
          id?: string
          oanda_account_id?: string
          oanda_trade_id?: string
          opened_at?: string
          realized_pnl?: number | null
          signal_id?: string | null
          status?: string
          stop_loss?: number | null
          symbol?: string
          take_profit?: number | null
          units?: number
          unrealized_pnl?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oanda_trades_oanda_account_id_fkey"
            columns: ["oanda_account_id"]
            isOneToOne: false
            referencedRelation: "oanda_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oanda_trades_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "signals_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_positions: {
        Row: {
          created_at: string
          current_price: number
          entry_price: number
          id: string
          opened_at: string
          qty: number
          symbol: string
          unrealized_pnl: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_price: number
          entry_price: number
          id?: string
          opened_at: string
          qty: number
          symbol: string
          unrealized_pnl?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_price?: number
          entry_price?: number
          id?: string
          opened_at?: string
          qty?: number
          symbol?: string
          unrealized_pnl?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      paper_trades_history: {
        Row: {
          closed_at: string
          created_at: string
          entry_price: number
          exit_price: number
          id: string
          opened_at: string
          qty: number
          realized_pnl: number
          symbol: string
          updated_at: string
          user_id: string
        }
        Insert: {
          closed_at: string
          created_at?: string
          entry_price: number
          exit_price: number
          id?: string
          opened_at: string
          qty: number
          realized_pnl: number
          symbol: string
          updated_at?: string
          user_id: string
        }
        Update: {
          closed_at?: string
          created_at?: string
          entry_price?: number
          exit_price?: number
          id?: string
          opened_at?: string
          qty?: number
          realized_pnl?: number
          symbol?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      paper_wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          total_equity: number
          total_pnl: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          total_equity?: number
          total_pnl?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          total_equity?: number
          total_pnl?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          payment_method: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_level: string | null
          created_at: string
          display_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          mobile: string | null
          payment_status: string | null
          preferred_currency: string | null
          updated_at: string
        }
        Insert: {
          access_level?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          mobile?: string | null
          payment_status?: string | null
          preferred_currency?: string | null
          updated_at?: string
        }
        Update: {
          access_level?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          payment_status?: string | null
          preferred_currency?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profit_calculations: {
        Row: {
          billing_period_end: string
          billing_period_start: string
          calculation_date: string
          created_at: string
          fee_amount: number
          fee_percentage: number
          id: string
          oanda_trade_id: string | null
          paper_trade_id: string | null
          profit_amount: number
          subscription_id: string
          trade_id: string | null
          user_id: string
        }
        Insert: {
          billing_period_end: string
          billing_period_start: string
          calculation_date?: string
          created_at?: string
          fee_amount: number
          fee_percentage?: number
          id?: string
          oanda_trade_id?: string | null
          paper_trade_id?: string | null
          profit_amount: number
          subscription_id: string
          trade_id?: string | null
          user_id: string
        }
        Update: {
          billing_period_end?: string
          billing_period_start?: string
          calculation_date?: string
          created_at?: string
          fee_amount?: number
          fee_percentage?: number
          id?: string
          oanda_trade_id?: string | null
          paper_trade_id?: string | null
          profit_amount?: number
          subscription_id?: string
          trade_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profit_calculations_oanda_trade_id_fkey"
            columns: ["oanda_trade_id"]
            isOneToOne: false
            referencedRelation: "oanda_trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profit_calculations_paper_trade_id_fkey"
            columns: ["paper_trade_id"]
            isOneToOne: false
            referencedRelation: "paper_trades_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profit_calculations_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "client_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profit_calculations_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          billing_type: string | null
          category: string
          content: Json | null
          created_at: string
          deposit_amount: number | null
          description: string | null
          domain_url: string | null
          expected_roi: number | null
          featured: boolean
          features: Json | null
          funding_progress: number | null
          gallery_images: string[] | null
          hero_image_url: string | null
          id: string
          image_url: string | null
          industry: string | null
          installment_plans: Json | null
          investment_amount: number | null
          investment_deadline: string | null
          investment_received: number | null
          investor_count: number | null
          key_features: Json | null
          leads_count: number
          name: string
          ownership_options: Json | null
          payment_methods: Json | null
          price: number | null
          purchase_info: Json | null
          route: string | null
          service_monthly: number | null
          social_proof: string | null
          stats: Json | null
          status: string
          subscription_period: string | null
          subscription_price: number | null
          updated_at: string
          use_cases: Json | null
          visibility: string
        }
        Insert: {
          billing_type?: string | null
          category?: string
          content?: Json | null
          created_at?: string
          deposit_amount?: number | null
          description?: string | null
          domain_url?: string | null
          expected_roi?: number | null
          featured?: boolean
          features?: Json | null
          funding_progress?: number | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          installment_plans?: Json | null
          investment_amount?: number | null
          investment_deadline?: string | null
          investment_received?: number | null
          investor_count?: number | null
          key_features?: Json | null
          leads_count?: number
          name: string
          ownership_options?: Json | null
          payment_methods?: Json | null
          price?: number | null
          purchase_info?: Json | null
          route?: string | null
          service_monthly?: number | null
          social_proof?: string | null
          stats?: Json | null
          status?: string
          subscription_period?: string | null
          subscription_price?: number | null
          updated_at?: string
          use_cases?: Json | null
          visibility?: string
        }
        Update: {
          billing_type?: string | null
          category?: string
          content?: Json | null
          created_at?: string
          deposit_amount?: number | null
          description?: string | null
          domain_url?: string | null
          expected_roi?: number | null
          featured?: boolean
          features?: Json | null
          funding_progress?: number | null
          gallery_images?: string[] | null
          hero_image_url?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          installment_plans?: Json | null
          investment_amount?: number | null
          investment_deadline?: string | null
          investment_received?: number | null
          investor_count?: number | null
          key_features?: Json | null
          leads_count?: number
          name?: string
          ownership_options?: Json | null
          payment_methods?: Json | null
          price?: number | null
          purchase_info?: Json | null
          route?: string | null
          service_monthly?: number | null
          social_proof?: string | null
          stats?: Json | null
          status?: string
          subscription_period?: string | null
          subscription_price?: number | null
          updated_at?: string
          use_cases?: Json | null
          visibility?: string
        }
        Relationships: []
      }
      signals_detailed: {
        Row: {
          actual_pnl: number | null
          backtested_avg_rr: number | null
          backtested_win_rate: number | null
          chart_template: string | null
          choch_levels: Json | null
          closed_at: string | null
          confidence_score: number
          confluence_factors: Json | null
          created_at: string
          demand_zones: Json | null
          direction: string
          entry_price: number
          higher_tf_bias: string | null
          higher_tf_context: Json | null
          id: string
          imbalance_id: string | null
          imbalances_data: Json | null
          market_structure_id: string | null
          order_blocks: Json | null
          risk_reward_ratio: number | null
          signal_type: string
          status: string
          stop_loss: number
          supply_zones: Json | null
          symbol: string
          take_profit_1: number | null
          take_profit_2: number | null
          take_profit_3: number | null
          timeframe: string
          trade_rationale: string | null
          tradingview_symbol: string | null
          triggered_at: string | null
          updated_at: string
        }
        Insert: {
          actual_pnl?: number | null
          backtested_avg_rr?: number | null
          backtested_win_rate?: number | null
          chart_template?: string | null
          choch_levels?: Json | null
          closed_at?: string | null
          confidence_score?: number
          confluence_factors?: Json | null
          created_at?: string
          demand_zones?: Json | null
          direction: string
          entry_price: number
          higher_tf_bias?: string | null
          higher_tf_context?: Json | null
          id?: string
          imbalance_id?: string | null
          imbalances_data?: Json | null
          market_structure_id?: string | null
          order_blocks?: Json | null
          risk_reward_ratio?: number | null
          signal_type: string
          status?: string
          stop_loss: number
          supply_zones?: Json | null
          symbol: string
          take_profit_1?: number | null
          take_profit_2?: number | null
          take_profit_3?: number | null
          timeframe: string
          trade_rationale?: string | null
          tradingview_symbol?: string | null
          triggered_at?: string | null
          updated_at?: string
        }
        Update: {
          actual_pnl?: number | null
          backtested_avg_rr?: number | null
          backtested_win_rate?: number | null
          chart_template?: string | null
          choch_levels?: Json | null
          closed_at?: string | null
          confidence_score?: number
          confluence_factors?: Json | null
          created_at?: string
          demand_zones?: Json | null
          direction?: string
          entry_price?: number
          higher_tf_bias?: string | null
          higher_tf_context?: Json | null
          id?: string
          imbalance_id?: string | null
          imbalances_data?: Json | null
          market_structure_id?: string | null
          order_blocks?: Json | null
          risk_reward_ratio?: number | null
          signal_type?: string
          status?: string
          stop_loss?: number
          supply_zones?: Json | null
          symbol?: string
          take_profit_1?: number | null
          take_profit_2?: number | null
          take_profit_3?: number | null
          timeframe?: string
          trade_rationale?: string | null
          tradingview_symbol?: string | null
          triggered_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signals_detailed_imbalance_id_fkey"
            columns: ["imbalance_id"]
            isOneToOne: false
            referencedRelation: "imbalances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_detailed_market_structure_id_fkey"
            columns: ["market_structure_id"]
            isOneToOne: false
            referencedRelation: "market_structure"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_questionnaire_responses: {
        Row: {
          created_at: string
          id: string
          recommended_templates: Json | null
          responses: Json
          selected_template_id: string | null
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          recommended_templates?: Json | null
          responses?: Json
          selected_template_id?: string | null
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          recommended_templates?: Json | null
          responses?: Json
          selected_template_id?: string | null
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          created_at: string
          direction: string
          entry_price: number
          entry_time: string
          exit_time: string | null
          id: string
          notes: string | null
          outcome: string | null
          pl: number | null
          risk_percent: number | null
          rr_target: number | null
          status: string
          stop_price: number | null
          symbol: string
          tags: Json | null
          take_profit: number | null
          timeframe: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: string
          entry_price: number
          entry_time?: string
          exit_time?: string | null
          id?: string
          notes?: string | null
          outcome?: string | null
          pl?: number | null
          risk_percent?: number | null
          rr_target?: number | null
          status?: string
          stop_price?: number | null
          symbol: string
          tags?: Json | null
          take_profit?: number | null
          timeframe?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: string
          entry_price?: number
          entry_time?: string
          exit_time?: string | null
          id?: string
          notes?: string | null
          outcome?: string | null
          pl?: number | null
          risk_percent?: number | null
          rr_target?: number | null
          status?: string
          stop_price?: number | null
          symbol?: string
          tags?: Json | null
          take_profit?: number | null
          timeframe?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          status: string
          type: string
          updated_at: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      trend_analysis: {
        Row: {
          analysis_timestamp: string
          confluence_score: number | null
          created_at: string
          higher_tf_alignment: boolean | null
          id: string
          key_levels: Json | null
          symbol: string
          timeframe: string
          trend_direction: string
          trend_strength: number
          updated_at: string
        }
        Insert: {
          analysis_timestamp?: string
          confluence_score?: number | null
          created_at?: string
          higher_tf_alignment?: boolean | null
          id?: string
          key_levels?: Json | null
          symbol: string
          timeframe: string
          trend_direction: string
          trend_strength?: number
          updated_at?: string
        }
        Update: {
          analysis_timestamp?: string
          confluence_score?: number | null
          created_at?: string
          higher_tf_alignment?: boolean | null
          id?: string
          key_levels?: Json | null
          symbol?: string
          timeframe?: string
          trend_direction?: string
          trend_strength?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watch_sources: {
        Row: {
          active: boolean
          check_interval_minutes: number
          created_at: string
          id: string
          label: string | null
          last_checked: string | null
          tags: Json
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          active?: boolean
          check_interval_minutes?: number
          created_at?: string
          id?: string
          label?: string | null
          last_checked?: string | null
          tags?: Json
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          active?: boolean
          check_interval_minutes?: number
          created_at?: string
          id?: string
          label?: string | null
          last_checked?: string | null
          tags?: Json
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      grant_admin_premium_access: {
        Args: { target_email: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      promote_to_admin: {
        Args: { target_email: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
