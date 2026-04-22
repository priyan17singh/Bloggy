'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addComment(formData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const postId = formData.get('postId')
  const comment_text = formData.get('comment_text')

  await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    comment_text
  })

  revalidatePath(`/posts/${postId}`)
}

export async function deleteComment(commentId, postId) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  const isAdmin = userData?.role === 'admin'

  let query = supabase.from('comments').delete().eq('id', commentId)
  if (!isAdmin) {
    query = query.eq('user_id', user.id)
  }
  await query
  revalidatePath(`/posts/${postId}`)
}