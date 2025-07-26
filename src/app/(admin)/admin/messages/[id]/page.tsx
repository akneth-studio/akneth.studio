import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import ReplyForm from '@/components/admin/replyForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function MessageDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: msg, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !msg) return notFound()
    
  if (msg && !msg.is_read) {
    // Mark message as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
  }

  return (
    <section className='messg'>
      <ReplyForm msg={msg} />
    </section>
  )
}
