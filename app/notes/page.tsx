'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

type Note = {
  id: string
  content: string
  created_at: string
}

export default function Page() {
  const [notes, setNotes] = useState<Note[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('notes').select()
      setNotes(data)
    }
    getData()
  }, [supabase])

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}