'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState<string>('Testing...')
  const [tables, setTables] = useState<any[]>([])

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Test basic connection
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .limit(10)
        
        if (error) {
          setStatus(`Error: ${error.message}`)
        } else {
          setStatus('✅ Connected to Supabase!')
          setTables(data || [])
        }
      } catch (err) {
        setStatus(`Connection failed: ${err}`)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="font-semibold">Status:</p>
        <p>{status}</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded mb-4">
        <p className="font-semibold">Supabase URL:</p>
        <p className="text-sm text-gray-600">
          {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </p>
      </div>
      
      {tables.length > 0 && (
        <div className="bg-green-50 p-4 rounded">
          <p className="font-semibold mb-2">Available Tables:</p>
          <ul className="list-disc list-inside text-sm">
            {tables.map((table, i) => (
              <li key={i}>{table.table_name}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-6">
        <a 
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  )
}