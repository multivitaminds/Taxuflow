export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_name: string
          account_number: string | null
          account_subtype: string | null
          account_type: string
          created_at: string | null
          current_balance: number | null
          description: string | null
          id: string
          is_active: boolean | null
          organization_id: string | null
          parent_account_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_name: string
          account_number?: string | null
          account_subtype?: string | null
          account_type: string
          created_at?: string | null
          current_balance?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          parent_account_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string | null
          account_subtype?: string | null
          account_type?: string
          created_at?: string | null
          current_balance?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          parent_account_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_activities: {
        Row: {
          activity_type: string
          agent_name: string
          agent_role: string | null
          created_at: string | null
          description: string | null
          document_id: string | null
          id: string
          impact_amount: number | null
          result_data: Json | null
          title: string
          user_id: string
          w2_id: string | null
        }
        Insert: {
          activity_type: string
          agent_name: string
          agent_role?: string | null
          created_at?: string | null
          description?: string | null
          document_id?: string | null
          id?: string
          impact_amount?: number | null
          result_data?: Json | null
          title: string
          user_id: string
          w2_id?: string | null
        }
        Update: {
          activity_type?: string
          agent_name?: string
          agent_role?: string | null
          created_at?: string | null
          description?: string | null
          document_id?: string | null
          id?: string
          impact_amount?: number | null
          result_data?: Json | null
          title?: string
          user_id?: string
          w2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_activities_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_activities_w2_id_fkey"
            columns: ["w2_id"]
            isOneToOne: false
            referencedRelation: "w2_data"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_collaborations: {
        Row: {
          collaboration_type: string
          completed_at: string | null
          consensus_reached: boolean | null
          created_at: string | null
          discussion_summary: string | null
          id: string
          impact_score: number | null
          participating_agents: string[]
          recommendations: Json | null
          trigger_event: string | null
          user_id: string
        }
        Insert: {
          collaboration_type: string
          completed_at?: string | null
          consensus_reached?: boolean | null
          created_at?: string | null
          discussion_summary?: string | null
          id?: string
          impact_score?: number | null
          participating_agents: string[]
          recommendations?: Json | null
          trigger_event?: string | null
          user_id: string
        }
        Update: {
          collaboration_type?: string
          completed_at?: string | null
          consensus_reached?: boolean | null
          created_at?: string | null
          discussion_summary?: string | null
          id?: string
          impact_score?: number | null
          participating_agents?: string[]
          recommendations?: Json | null
          trigger_event?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_learning_events: {
        Row: {
          agent_name: string
          applied_to_future: boolean | null
          confidence_after: number | null
          confidence_before: number | null
          context: Json
          created_at: string | null
          id: string
          learning_type: string
          lesson_learned: string
          user_id: string
        }
        Insert: {
          agent_name: string
          applied_to_future?: boolean | null
          confidence_after?: number | null
          confidence_before?: number | null
          context: Json
          created_at?: string | null
          id?: string
          learning_type: string
          lesson_learned: string
          user_id: string
        }
        Update: {
          agent_name?: string
          applied_to_future?: boolean | null
          confidence_after?: number | null
          confidence_before?: number | null
          context?: Json
          created_at?: string | null
          id?: string
          learning_type?: string
          lesson_learned?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_memory: {
        Row: {
          access_count: number | null
          agent_name: string
          confidence_score: number | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          memory_content: Json
          memory_type: string
          related_documents: string[] | null
          relevance_score: number | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          access_count?: number | null
          agent_name: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          memory_content: Json
          memory_type: string
          related_documents?: string[] | null
          relevance_score?: number | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          access_count?: number | null
          agent_name?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          memory_content?: Json
          memory_type?: string
          related_documents?: string[] | null
          relevance_score?: number | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      agent_performance_metrics: {
        Row: {
          agent_name: string
          average_confidence: number | null
          average_impact: number | null
          collaboration_count: number | null
          created_at: string | null
          id: string
          learning_events: number | null
          metric_date: string | null
          successful_predictions: number | null
          total_analyses: number | null
          user_satisfaction_score: number | null
        }
        Insert: {
          agent_name: string
          average_confidence?: number | null
          average_impact?: number | null
          collaboration_count?: number | null
          created_at?: string | null
          id?: string
          learning_events?: number | null
          metric_date?: string | null
          successful_predictions?: number | null
          total_analyses?: number | null
          user_satisfaction_score?: number | null
        }
        Update: {
          agent_name?: string
          average_confidence?: number | null
          average_impact?: number | null
          collaboration_count?: number | null
          created_at?: string | null
          id?: string
          learning_events?: number | null
          metric_date?: string | null
          successful_predictions?: number | null
          total_analyses?: number | null
          user_satisfaction_score?: number | null
        }
        Relationships: []
      }
      ai_processing_jobs: {
        Row: {
          ai_model: string | null
          completed_at: string | null
          confidence_score: number | null
          created_at: string | null
          document_id: string | null
          error_message: string | null
          id: string
          input_data: Json | null
          job_type: string
          max_retries: number | null
          output_data: Json | null
          processing_time_ms: number | null
          retry_count: number | null
          started_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          ai_model?: string | null
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          document_id?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          job_type: string
          max_retries?: number | null
          output_data?: Json | null
          processing_time_ms?: number | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          ai_model?: string | null
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          document_id?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          job_type?: string
          max_retries?: number | null
          output_data?: Json | null
          processing_time_ms?: number | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_processing_jobs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_processing_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_training_data: {
        Row: {
          actual_output: Json | null
          confidence_score: number | null
          created_at: string | null
          document_type: string
          expected_output: Json | null
          id: string
          input_text: string | null
          is_validated: boolean | null
          user_correction: Json | null
          validation_source: string | null
        }
        Insert: {
          actual_output?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          document_type: string
          expected_output?: Json | null
          id?: string
          input_text?: string | null
          is_validated?: boolean | null
          user_correction?: Json | null
          validation_source?: string | null
        }
        Update: {
          actual_output?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          document_type?: string
          expected_output?: Json | null
          id?: string
          input_text?: string | null
          is_validated?: boolean | null
          user_correction?: Json | null
          validation_source?: string | null
        }
        Relationships: []
      }
      ai_workflows: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          version: string | null
          workflow_steps: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          version?: string | null
          workflow_steps: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          version?: string | null
          workflow_steps?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ai_workflows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          organization_id: string | null
          permissions: Json | null
          rate_limit_per_minute: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          organization_id?: string | null
          permissions?: Json | null
          rate_limit_per_minute?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          organization_id?: string | null
          permissions?: Json | null
          rate_limit_per_minute?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_id: string | null
          account_name: string
          account_number_last4: string | null
          account_type: string | null
          bank_name: string
          connection_id: string | null
          created_at: string | null
          current_balance: number | null
          id: string
          is_active: boolean | null
          is_connected: boolean | null
          last_synced_at: string | null
          organization_id: string | null
          routing_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          account_name: string
          account_number_last4?: string | null
          account_type?: string | null
          bank_name: string
          connection_id?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          is_connected?: boolean | null
          last_synced_at?: string | null
          organization_id?: string | null
          routing_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          account_name?: string
          account_number_last4?: string | null
          account_type?: string | null
          bank_name?: string
          connection_id?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          is_connected?: boolean | null
          last_synced_at?: string | null
          organization_id?: string | null
          routing_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bank_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          amount: number
          bank_account_id: string | null
          category_id: string | null
          created_at: string | null
          customer_id: string | null
          description: string
          external_id: string | null
          id: string
          is_categorized: boolean | null
          is_reconciled: boolean | null
          notes: string | null
          posted_date: string | null
          transaction_date: string
          transaction_type: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          bank_account_id?: string | null
          category_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description: string
          external_id?: string | null
          id?: string
          is_categorized?: boolean | null
          is_reconciled?: boolean | null
          notes?: string | null
          posted_date?: string | null
          transaction_date: string
          transaction_type?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          bank_account_id?: string | null
          category_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string
          external_id?: string | null
          id?: string
          is_categorized?: boolean | null
          is_reconciled?: boolean | null
          notes?: string | null
          posted_date?: string | null
          transaction_date?: string
          transaction_type?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_items: {
        Row: {
          account_id: string | null
          amount: number
          bill_id: string | null
          created_at: string | null
          description: string
          id: string
          quantity: number | null
          unit_price: number
        }
        Insert: {
          account_id?: string | null
          amount: number
          bill_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          quantity?: number | null
          unit_price: number
        }
        Update: {
          account_id?: string | null
          amount?: number
          bill_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          quantity?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "bill_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          amount_due: number | null
          amount_paid: number | null
          bill_date: string
          bill_number: string | null
          class_id: string | null
          created_at: string | null
          department_id: string | null
          due_date: string
          id: string
          notes: string | null
          organization_id: string | null
          paid_at: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          amount_due?: number | null
          amount_paid?: number | null
          bill_date: string
          bill_number?: string | null
          class_id?: string | null
          created_at?: string | null
          department_id?: string | null
          due_date: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          paid_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount_due?: number | null
          amount_paid?: number | null
          bill_date?: string
          bill_number?: string | null
          class_id?: string | null
          created_at?: string | null
          department_id?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          paid_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_items: {
        Row: {
          account_id: string | null
          amount: number
          budget_id: string
          category_id: string | null
          created_at: string
          id: string
          period: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          budget_id: string
          category_id?: string | null
          created_at?: string
          id?: string
          period: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          budget_id?: string
          category_id?: string | null
          created_at?: string
          id?: string
          period?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          created_at: string
          end_date: string
          fiscal_year: number
          id: string
          name: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          fiscal_year: number
          id?: string
          name: string
          start_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          fiscal_year?: number
          id?: string
          name?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          parent_class_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_class_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_class_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_parent_class_id_fkey"
            columns: ["parent_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_applications: {
        Row: {
          application_date: string
          applied_amount: number
          applied_to_invoice_id: string | null
          created_at: string | null
          credit_memo_id: string | null
          id: string
          notes: string | null
        }
        Insert: {
          application_date: string
          applied_amount: number
          applied_to_invoice_id?: string | null
          created_at?: string | null
          credit_memo_id?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          application_date?: string
          applied_amount?: number
          applied_to_invoice_id?: string | null
          created_at?: string | null
          credit_memo_id?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_applications_applied_to_invoice_id_fkey"
            columns: ["applied_to_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_applications_credit_memo_id_fkey"
            columns: ["credit_memo_id"]
            isOneToOne: false
            referencedRelation: "credit_memos"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_memo_items: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          credit_memo_id: string | null
          description: string
          id: string
          original_invoice_item_id: string | null
          quantity: number
          reason: string | null
          tax_amount: number | null
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          credit_memo_id?: string | null
          description: string
          id?: string
          original_invoice_item_id?: string | null
          quantity: number
          reason?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          credit_memo_id?: string | null
          description?: string
          id?: string
          original_invoice_item_id?: string | null
          quantity?: number
          reason?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "credit_memo_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_items_credit_memo_id_fkey"
            columns: ["credit_memo_id"]
            isOneToOne: false
            referencedRelation: "credit_memos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memo_items_original_invoice_item_id_fkey"
            columns: ["original_invoice_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_items"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_memos: {
        Row: {
          amount_applied: number | null
          amount_available: number | null
          amount_refunded: number | null
          approved_at: string | null
          created_at: string | null
          credit_memo_number: string
          customer_id: string | null
          id: string
          invoice_id: string | null
          memo_date: string
          notes: string | null
          organization_id: string | null
          reason: string | null
          refund_method: string | null
          refund_reference: string | null
          refunded_at: string | null
          sent_at: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_applied?: number | null
          amount_available?: number | null
          amount_refunded?: number | null
          approved_at?: string | null
          created_at?: string | null
          credit_memo_number: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          memo_date: string
          notes?: string | null
          organization_id?: string | null
          reason?: string | null
          refund_method?: string | null
          refund_reference?: string | null
          refunded_at?: string | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_applied?: number | null
          amount_available?: number | null
          amount_refunded?: number | null
          approved_at?: string | null
          created_at?: string | null
          credit_memo_number?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          memo_date?: string
          notes?: string | null
          organization_id?: string | null
          reason?: string | null
          refund_method?: string | null
          refund_reference?: string | null
          refunded_at?: string | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_memos_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memos_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "credit_memos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_memos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          balance: number | null
          city: string | null
          company_name: string | null
          contact_name: string | null
          country: string | null
          created_at: string | null
          credit_limit: number | null
          email: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          organization_id: string | null
          payment_terms: number | null
          phone: string | null
          state: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          balance?: number | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: number | null
          phone?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          balance?: number | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: number | null
          phone?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      deductions_credits: {
        Row: {
          amount: number | null
          category: string | null
          confidence: number | null
          created_at: string | null
          description: string | null
          documentation_needed: string[] | null
          id: string
          name: string
          recommended_by: string | null
          requirements: Json | null
          status: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          category?: string | null
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          documentation_needed?: string[] | null
          id?: string
          name: string
          recommended_by?: string | null
          requirements?: Json | null
          status?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          category?: string | null
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          documentation_needed?: string[] | null
          id?: string
          name?: string
          recommended_by?: string | null
          requirements?: Json | null
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_analysis: {
        Row: {
          analysis_type: string
          created_at: string | null
          detected_fields: Json | null
          document_id: string | null
          extracted_text: string | null
          id: string
          processing_metadata: Json | null
          quality_score: number | null
          suggestions: Json | null
        }
        Insert: {
          analysis_type: string
          created_at?: string | null
          detected_fields?: Json | null
          document_id?: string | null
          extracted_text?: string | null
          id?: string
          processing_metadata?: Json | null
          quality_score?: number | null
          suggestions?: Json | null
        }
        Update: {
          analysis_type?: string
          created_at?: string | null
          detected_fields?: Json | null
          document_id?: string | null
          extracted_text?: string | null
          id?: string
          processing_metadata?: Json | null
          quality_score?: number | null
          suggestions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_analysis_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          ai_confidence: number | null
          ai_confidence_score: number | null
          ai_description: string | null
          ai_document_type: string | null
          ai_processing_status: string | null
          ai_suggestions: Json | null
          created_at: string | null
          document_type: string | null
          extracted_data: Json | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          organization_id: string | null
          tax_year: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_confidence?: number | null
          ai_confidence_score?: number | null
          ai_description?: string | null
          ai_document_type?: string | null
          ai_processing_status?: string | null
          ai_suggestions?: Json | null
          created_at?: string | null
          document_type?: string | null
          extracted_data?: Json | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          organization_id?: string | null
          tax_year?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_confidence?: number | null
          ai_confidence_score?: number | null
          ai_description?: string | null
          ai_document_type?: string | null
          ai_processing_status?: string | null
          ai_suggestions?: Json | null
          created_at?: string | null
          document_type?: string | null
          extracted_data?: Json | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          organization_id?: string | null
          tax_year?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_items: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          estimate_id: string | null
          id: string
          quantity: number | null
          tax_amount: number | null
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          estimate_id?: string | null
          id?: string
          quantity?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          estimate_id?: string | null
          id?: string
          quantity?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "estimate_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          accepted_at: string | null
          converted_to_invoice_id: string | null
          created_at: string | null
          customer_id: string | null
          discount_amount: number | null
          estimate_date: string
          estimate_number: string
          expiry_date: string | null
          id: string
          notes: string | null
          organization_id: string | null
          sent_at: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tax_rate: number | null
          terms_conditions: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          converted_to_invoice_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          estimate_date: string
          estimate_number: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          converted_to_invoice_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          estimate_date?: string
          estimate_number?: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimates_converted_to_invoice_id_fkey"
            columns: ["converted_to_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "estimates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          account_id: string | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_tax_deductible: boolean | null
          name: string
          organization_id: string | null
          parent_category_id: string | null
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_tax_deductible?: boolean | null
          name: string
          organization_id?: string | null
          parent_category_id?: string | null
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_tax_deductible?: boolean | null
          name?: string
          organization_id?: string | null
          parent_category_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "expense_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          account_id: string | null
          amount: number
          category_id: string | null
          class_id: string | null
          created_at: string | null
          department_id: string | null
          description: string | null
          expense_date: string
          id: string
          is_billable: boolean | null
          is_tax_deductible: boolean | null
          notes: string | null
          organization_id: string | null
          payment_method: string | null
          receipt_url: string | null
          reference_number: string | null
          status: string | null
          tax_amount: number | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          category_id?: string | null
          class_id?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          expense_date: string
          id?: string
          is_billable?: boolean | null
          is_tax_deductible?: boolean | null
          notes?: string | null
          organization_id?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          status?: string | null
          tax_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          category_id?: string | null
          class_id?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          is_billable?: boolean | null
          is_tax_deductible?: boolean | null
          notes?: string | null
          organization_id?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          status?: string | null
          tax_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      intelligent_insights: {
        Row: {
          acknowledged: boolean | null
          actionable: boolean | null
          confidence_level: number | null
          created_at: string | null
          description: string
          expires_at: string | null
          generated_by: string
          id: string
          impact_level: string | null
          insight_type: string
          suggested_actions: Json | null
          supporting_data: Json | null
          title: string
          user_id: string
        }
        Insert: {
          acknowledged?: boolean | null
          actionable?: boolean | null
          confidence_level?: number | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          generated_by: string
          id?: string
          impact_level?: string | null
          insight_type: string
          suggested_actions?: Json | null
          supporting_data?: Json | null
          title: string
          user_id: string
        }
        Update: {
          acknowledged?: boolean | null
          actionable?: boolean | null
          confidence_level?: number | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          generated_by?: string
          id?: string
          impact_level?: string | null
          insight_type?: string
          suggested_actions?: Json | null
          supporting_data?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          description: string
          id: string
          invoice_id: string | null
          quantity: number | null
          tax_amount: number | null
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          description: string
          id?: string
          invoice_id?: string | null
          quantity?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          quantity?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number | null
          amount_paid: number | null
          class_id: string | null
          created_at: string | null
          customer_id: string | null
          department_id: string | null
          discount_amount: number | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          organization_id: string | null
          paid_at: string | null
          payment_terms: number | null
          sent_at: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tax_rate: number | null
          terms_conditions: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_due?: number | null
          amount_paid?: number | null
          class_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          department_id?: string | null
          discount_amount?: number | null
          due_date: string
          id?: string
          invoice_date: string
          invoice_number: string
          notes?: string | null
          organization_id?: string | null
          paid_at?: string | null
          payment_terms?: number | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_due?: number | null
          amount_paid?: number | null
          class_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          department_id?: string | null
          discount_amount?: number | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          organization_id?: string | null
          paid_at?: string | null
          payment_terms?: number | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_memberships: {
        Row: {
          created_at: string | null
          id: string
          invited_by: string | null
          joined_at: string | null
          organization_id: string | null
          permissions: Json | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string | null
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string | null
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          billing_email: string | null
          created_at: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_documents: number | null
          max_users: number | null
          name: string
          plan_type: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          billing_email?: string | null
          created_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_documents?: number | null
          max_users?: number | null
          name: string
          plan_type?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          billing_email?: string | null
          created_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_documents?: number | null
          max_users?: number | null
          name?: string
          plan_type?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          organization_id: string | null
          payment_date: string
          payment_method: string | null
          reference_number: string | null
          status: string | null
          stripe_payment_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_date: string
          payment_method?: string | null
          reference_number?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_date?: string
          payment_method?: string | null
          reference_number?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      po_items: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          description: string
          id: string
          notes: string | null
          po_id: string | null
          quantity: number
          quantity_received: number | null
          unit_price: number
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          description: string
          id?: string
          notes?: string | null
          po_id?: string | null
          quantity: number
          quantity_received?: number | null
          unit_price: number
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          notes?: string | null
          po_id?: string | null
          quantity?: number
          quantity_received?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "po_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      po_receipt_items: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          po_item_id: string | null
          quantity_received: number
          receipt_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          po_item_id?: string | null
          quantity_received: number
          receipt_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          po_item_id?: string | null
          quantity_received?: number
          receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "po_receipt_items_po_item_id_fkey"
            columns: ["po_item_id"]
            isOneToOne: false
            referencedRelation: "po_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_receipt_items_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "po_receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      po_receipts: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          po_id: string | null
          receipt_date: string
          received_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          po_id?: string | null
          receipt_date: string
          received_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          po_id?: string | null
          receipt_date?: string
          received_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "po_receipts_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      predictive_tax_models: {
        Row: {
          accuracy_score: number | null
          actual_outcome: Json | null
          confidence_interval: Json | null
          created_at: string | null
          created_by: string
          factors_considered: string[] | null
          id: string
          model_type: string
          prediction_data: Json
          user_id: string
          valid_until: string | null
        }
        Insert: {
          accuracy_score?: number | null
          actual_outcome?: Json | null
          confidence_interval?: Json | null
          created_at?: string | null
          created_by: string
          factors_considered?: string[] | null
          id?: string
          model_type: string
          prediction_data: Json
          user_id: string
          valid_until?: string | null
        }
        Update: {
          accuracy_score?: number | null
          actual_outcome?: Json | null
          confidence_interval?: Json | null
          created_at?: string | null
          created_by?: string
          factors_considered?: string[] | null
          id?: string
          model_type?: string
          prediction_data?: Json
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          amount_received: number | null
          approved_at: string | null
          created_at: string | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          organization_id: string | null
          po_date: string
          po_number: string
          received_at: string | null
          sent_at: string | null
          shipping_address: string | null
          shipping_amount: number | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          terms_conditions: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          amount_received?: number | null
          approved_at?: string | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          po_date: string
          po_number: string
          received_at?: string | null
          sent_at?: string | null
          shipping_address?: string | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount_received?: number | null
          approved_at?: string | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          po_date?: string
          po_number?: string
          received_at?: string | null
          sent_at?: string | null
          shipping_address?: string | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_transactions: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string | null
          description: string | null
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean | null
          last_generated_at: string | null
          next_date: string
          organization_id: string | null
          start_date: string
          template_data: Json | null
          transaction_type: string
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          next_date: string
          organization_id?: string | null
          start_date: string
          template_data?: Json | null
          transaction_type: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          next_date?: string
          organization_id?: string | null
          start_date?: string
          template_data?: Json | null
          transaction_type?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "recurring_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      refund_transactions: {
        Row: {
          bank_account_id: string | null
          created_at: string | null
          credit_memo_id: string | null
          id: string
          notes: string | null
          reference_number: string | null
          refund_amount: number
          refund_date: string
          refund_method: string | null
          status: string | null
          stripe_refund_id: string | null
        }
        Insert: {
          bank_account_id?: string | null
          created_at?: string | null
          credit_memo_id?: string | null
          id?: string
          notes?: string | null
          reference_number?: string | null
          refund_amount: number
          refund_date: string
          refund_method?: string | null
          status?: string | null
          stripe_refund_id?: string | null
        }
        Update: {
          bank_account_id?: string | null
          created_at?: string | null
          credit_memo_id?: string | null
          id?: string
          notes?: string | null
          reference_number?: string | null
          refund_amount?: number
          refund_date?: string
          refund_method?: string | null
          status?: string | null
          stripe_refund_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refund_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_transactions_credit_memo_id_fkey"
            columns: ["credit_memo_id"]
            isOneToOne: false
            referencedRelation: "credit_memos"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_tax_items: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string | null
          invoice_item_id: string | null
          tax_amount: number | null
          tax_jurisdiction: string | null
          tax_rate: number | null
          tax_rate_id: string | null
          taxable_amount: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          invoice_item_id?: string | null
          tax_amount?: number | null
          tax_jurisdiction?: string | null
          tax_rate?: number | null
          tax_rate_id?: string | null
          taxable_amount?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          invoice_item_id?: string | null
          tax_amount?: number | null
          tax_jurisdiction?: string | null
          tax_rate?: number | null
          tax_rate_id?: string | null
          taxable_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_tax_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_tax_items_invoice_item_id_fkey"
            columns: ["invoice_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_tax_items_tax_rate_id_fkey"
            columns: ["tax_rate_id"]
            isOneToOne: false
            referencedRelation: "sales_tax_rates"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_tax_rates: {
        Row: {
          city: string | null
          county: string | null
          created_at: string | null
          description: string | null
          effective_date: string
          end_date: string | null
          id: string
          is_active: boolean | null
          is_compound: boolean | null
          jurisdiction: string | null
          name: string
          organization_id: string | null
          state: string | null
          tax_rate: number
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          effective_date: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_compound?: boolean | null
          jurisdiction?: string | null
          name: string
          organization_id?: string | null
          state?: string | null
          tax_rate: number
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          effective_date?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_compound?: boolean | null
          jurisdiction?: string | null
          name?: string
          organization_id?: string | null
          state?: string | null
          tax_rate?: number
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_tax_rates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "sales_tax_rates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_tax_rates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_calculations: {
        Row: {
          adjusted_gross_income: number | null
          amount_owed: number | null
          audit_risk_score: string | null
          calculated_at: string | null
          confidence_level: string | null
          confidence_percentage: number | null
          created_at: string | null
          estimated_refund: number | null
          federal_tax_liability: number | null
          filing_status: string | null
          id: string
          state_tax_liability: number | null
          tax_year: number | null
          taxable_income: number | null
          total_income: number | null
          total_tax_withheld: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adjusted_gross_income?: number | null
          amount_owed?: number | null
          audit_risk_score?: string | null
          calculated_at?: string | null
          confidence_level?: string | null
          confidence_percentage?: number | null
          created_at?: string | null
          estimated_refund?: number | null
          federal_tax_liability?: number | null
          filing_status?: string | null
          id?: string
          state_tax_liability?: number | null
          tax_year?: number | null
          taxable_income?: number | null
          total_income?: number | null
          total_tax_withheld?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adjusted_gross_income?: number | null
          amount_owed?: number | null
          audit_risk_score?: string | null
          calculated_at?: string | null
          confidence_level?: string | null
          confidence_percentage?: number | null
          created_at?: string | null
          estimated_refund?: number | null
          federal_tax_liability?: number | null
          filing_status?: string | null
          id?: string
          state_tax_liability?: number | null
          tax_year?: number | null
          taxable_income?: number | null
          total_income?: number | null
          total_tax_withheld?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tax_documents: {
        Row: {
          ai_confidence: number | null
          ai_summary: string | null
          created_at: string | null
          document_id: string | null
          document_subtype: string | null
          document_type: string
          extracted_data: Json
          filing_status: string | null
          id: string
          key_findings: string[] | null
          processed_at: string | null
          spouse_name: string | null
          tax_year: number | null
          taxpayer_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_confidence?: number | null
          ai_summary?: string | null
          created_at?: string | null
          document_id?: string | null
          document_subtype?: string | null
          document_type: string
          extracted_data: Json
          filing_status?: string | null
          id?: string
          key_findings?: string[] | null
          processed_at?: string | null
          spouse_name?: string | null
          tax_year?: number | null
          taxpayer_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_confidence?: number | null
          ai_summary?: string | null
          created_at?: string | null
          document_id?: string | null
          document_subtype?: string | null
          document_type?: string
          extracted_data?: Json
          filing_status?: string | null
          id?: string
          key_findings?: string[] | null
          processed_at?: string | null
          spouse_name?: string | null
          tax_year?: number | null
          taxpayer_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_exemptions: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          customer_id: string | null
          effective_date: string
          exemption_certificate_number: string | null
          exemption_type: string | null
          expiration_date: string | null
          id: string
          is_active: boolean | null
          issuing_state: string | null
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          customer_id?: string | null
          effective_date: string
          exemption_certificate_number?: string | null
          exemption_type?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          issuing_state?: string | null
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          customer_id?: string | null
          effective_date?: string
          exemption_certificate_number?: string | null
          exemption_type?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          issuing_state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_exemptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_filings: {
        Row: {
          bank_account: string | null
          bank_account_type: string | null
          bank_routing: string | null
          created_at: string | null
          filed_at: string | null
          filing_status: string
          id: string
          irs_confirmation: string | null
          refund_amount: number | null
          state_confirmation: string | null
          tax_year: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bank_account?: string | null
          bank_account_type?: string | null
          bank_routing?: string | null
          created_at?: string | null
          filed_at?: string | null
          filing_status: string
          id?: string
          irs_confirmation?: string | null
          refund_amount?: number | null
          state_confirmation?: string | null
          tax_year: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bank_account?: string | null
          bank_account_type?: string | null
          bank_routing?: string | null
          created_at?: string | null
          filed_at?: string | null
          filing_status?: string
          id?: string
          irs_confirmation?: string | null
          refund_amount?: number | null
          state_confirmation?: string | null
          tax_year?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tax_forms: {
        Row: {
          ai_confidence_score: number | null
          ai_extracted: boolean | null
          created_at: string | null
          dependents_count: number | null
          document_id: string | null
          employer_ein: string | null
          employer_name: string | null
          federal_tax_withheld: number | null
          filing_status: string | null
          form_type: string
          id: string
          medicare_tax: number | null
          medicare_wages: number | null
          needs_review: boolean | null
          organization_id: string | null
          processed_data: Json | null
          review_notes: string | null
          social_security_tax: number | null
          social_security_wages: number | null
          spouse_name: string | null
          spouse_ssn: string | null
          state_tax_withheld: number | null
          tax_return_id: string | null
          tax_year: number
          taxpayer_name: string | null
          taxpayer_ssn: string | null
          updated_at: string | null
          user_id: string | null
          wages: number | null
        }
        Insert: {
          ai_confidence_score?: number | null
          ai_extracted?: boolean | null
          created_at?: string | null
          dependents_count?: number | null
          document_id?: string | null
          employer_ein?: string | null
          employer_name?: string | null
          federal_tax_withheld?: number | null
          filing_status?: string | null
          form_type: string
          id?: string
          medicare_tax?: number | null
          medicare_wages?: number | null
          needs_review?: boolean | null
          organization_id?: string | null
          processed_data?: Json | null
          review_notes?: string | null
          social_security_tax?: number | null
          social_security_wages?: number | null
          spouse_name?: string | null
          spouse_ssn?: string | null
          state_tax_withheld?: number | null
          tax_return_id?: string | null
          tax_year: number
          taxpayer_name?: string | null
          taxpayer_ssn?: string | null
          updated_at?: string | null
          user_id?: string | null
          wages?: number | null
        }
        Update: {
          ai_confidence_score?: number | null
          ai_extracted?: boolean | null
          created_at?: string | null
          dependents_count?: number | null
          document_id?: string | null
          employer_ein?: string | null
          employer_name?: string | null
          federal_tax_withheld?: number | null
          filing_status?: string | null
          form_type?: string
          id?: string
          medicare_tax?: number | null
          medicare_wages?: number | null
          needs_review?: boolean | null
          organization_id?: string | null
          processed_data?: Json | null
          review_notes?: string | null
          social_security_tax?: number | null
          social_security_wages?: number | null
          spouse_name?: string | null
          spouse_ssn?: string | null
          state_tax_withheld?: number | null
          tax_return_id?: string | null
          tax_year?: number
          taxpayer_name?: string | null
          taxpayer_ssn?: string | null
          updated_at?: string | null
          user_id?: string | null
          wages?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_forms_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_forms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "tax_forms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_forms_tax_return_id_fkey"
            columns: ["tax_return_id"]
            isOneToOne: false
            referencedRelation: "tax_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_liability_periods: {
        Row: {
          created_at: string | null
          filing_date: string | null
          id: string
          notes: string | null
          organization_id: string | null
          payment_date: string | null
          payment_reference: string | null
          period_end: string
          period_start: string
          period_type: string
          status: string | null
          taxable_sales: number | null
          total_sales: number | null
          total_tax_collected: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filing_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          payment_date?: string | null
          payment_reference?: string | null
          period_end: string
          period_start: string
          period_type: string
          status?: string | null
          taxable_sales?: number | null
          total_sales?: number | null
          total_tax_collected?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filing_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          payment_date?: string | null
          payment_reference?: string | null
          period_end?: string
          period_start?: string
          period_type?: string
          status?: string | null
          taxable_sales?: number | null
          total_sales?: number | null
          total_tax_collected?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_liability_periods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "tax_liability_periods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_liability_periods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_optimization_strategies: {
        Row: {
          created_at: string | null
          description: string
          id: string
          implementation_difficulty: string | null
          potential_savings: number | null
          priority_score: number | null
          recommended_by: string
          requirements: Json | null
          risks: Json | null
          status: string | null
          steps: Json | null
          strategy_name: string
          strategy_type: string
          time_horizon: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          implementation_difficulty?: string | null
          potential_savings?: number | null
          priority_score?: number | null
          recommended_by: string
          requirements?: Json | null
          risks?: Json | null
          status?: string | null
          steps?: Json | null
          strategy_name: string
          strategy_type: string
          time_horizon?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          implementation_difficulty?: string | null
          potential_savings?: number | null
          priority_score?: number | null
          recommended_by?: string
          requirements?: Json | null
          risks?: Json | null
          status?: string | null
          steps?: Json | null
          strategy_name?: string
          strategy_type?: string
          time_horizon?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tax_returns: {
        Row: {
          accepted_date: string | null
          created_at: string | null
          federal_agi: number | null
          federal_refund: number | null
          federal_tax_owed: number | null
          filed_date: string | null
          filing_status: string
          id: string
          organization_id: string | null
          return_status: string | null
          state_refund: number | null
          state_tax_owed: number | null
          tax_year: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accepted_date?: string | null
          created_at?: string | null
          federal_agi?: number | null
          federal_refund?: number | null
          federal_tax_owed?: number | null
          filed_date?: string | null
          filing_status: string
          id?: string
          organization_id?: string | null
          return_status?: string | null
          state_refund?: number | null
          state_tax_owed?: number | null
          tax_year: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_date?: string | null
          created_at?: string | null
          federal_agi?: number | null
          federal_refund?: number | null
          federal_tax_owed?: number | null
          filed_date?: string | null
          filing_status?: string
          id?: string
          organization_id?: string | null
          return_status?: string | null
          state_refund?: number | null
          state_tax_owed?: number | null
          tax_year?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_returns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "tax_returns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_returns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          filing_status: string | null
          full_name: string | null
          id: string
          income_type: string | null
          preferred_agent: string | null
          subscription_tier: string | null
          tone_preference: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          filing_status?: string | null
          full_name?: string | null
          id: string
          income_type?: string | null
          preferred_agent?: string | null
          subscription_tier?: string | null
          tone_preference?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          filing_status?: string | null
          full_name?: string | null
          id?: string
          income_type?: string | null
          preferred_agent?: string | null
          subscription_tier?: string | null
          tone_preference?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          default_organization_id: string | null
          email: string
          email_verified: boolean | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_name: string | null
          phone: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          default_organization_id?: string | null
          email: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          default_organization_id?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_default_organization_id_fkey"
            columns: ["default_organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "users_default_organization_id_fkey"
            columns: ["default_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          account_number: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_name: string
          contact_name: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          organization_id: string | null
          payment_terms: number | null
          phone: string | null
          state: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          account_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name: string
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: number | null
          phone?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          account_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: number | null
          phone?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      w2_data: {
        Row: {
          box_12_codes: Json | null
          created_at: string | null
          document_id: string | null
          employee_address: string | null
          employee_name: string | null
          employee_ssn: string | null
          employer_address: string | null
          employer_ein: string | null
          employer_name: string | null
          extraction_confidence: number | null
          federal_tax_withheld: number | null
          id: string
          medicare_tax_withheld: number | null
          medicare_wages: number | null
          other_data: Json | null
          processed_at: string | null
          social_security_tax_withheld: number | null
          social_security_wages: number | null
          state: string | null
          state_tax_withheld: number | null
          state_wages: number | null
          updated_at: string | null
          user_id: string
          wages: number | null
        }
        Insert: {
          box_12_codes?: Json | null
          created_at?: string | null
          document_id?: string | null
          employee_address?: string | null
          employee_name?: string | null
          employee_ssn?: string | null
          employer_address?: string | null
          employer_ein?: string | null
          employer_name?: string | null
          extraction_confidence?: number | null
          federal_tax_withheld?: number | null
          id?: string
          medicare_tax_withheld?: number | null
          medicare_wages?: number | null
          other_data?: Json | null
          processed_at?: string | null
          social_security_tax_withheld?: number | null
          social_security_wages?: number | null
          state?: string | null
          state_tax_withheld?: number | null
          state_wages?: number | null
          updated_at?: string | null
          user_id: string
          wages?: number | null
        }
        Update: {
          box_12_codes?: Json | null
          created_at?: string | null
          document_id?: string | null
          employee_address?: string | null
          employee_name?: string | null
          employee_ssn?: string | null
          employer_address?: string | null
          employer_ein?: string | null
          employer_name?: string | null
          extraction_confidence?: number | null
          federal_tax_withheld?: number | null
          id?: string
          medicare_tax_withheld?: number | null
          medicare_wages?: number | null
          other_data?: Json | null
          processed_at?: string | null
          social_security_tax_withheld?: number | null
          social_security_wages?: number | null
          state?: string | null
          state_tax_withheld?: number | null
          state_wages?: number | null
          updated_at?: string | null
          user_id?: string
          wages?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "w2_data_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_deliveries: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          delivery_attempts: number | null
          event_type: string
          id: string
          payload: Json
          response_body: string | null
          response_status: number | null
          webhook_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          event_type: string
          id?: string
          payload: Json
          response_body?: string | null
          response_status?: number | null
          webhook_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          event_type?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: Json
          id: string
          is_active: boolean | null
          last_failure_at: string | null
          last_success_at: string | null
          organization_id: string | null
          retry_count: number | null
          secret: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          events: Json
          id?: string
          is_active?: boolean | null
          last_failure_at?: string | null
          last_success_at?: string | null
          organization_id?: string | null
          retry_count?: number | null
          secret?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          events?: Json
          id?: string
          is_active?: boolean | null
          last_failure_at?: string | null
          last_success_at?: string | null
          organization_id?: string | null
          retry_count?: number | null
          secret?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "webhooks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      organization_stats: {
        Row: {
          document_count: number | null
          last_document_upload: string | null
          last_tax_return: string | null
          organization_id: string | null
          organization_name: string | null
          tax_return_count: number | null
          user_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      archive_old_memories: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
