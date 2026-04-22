'use server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateSummary } from '@/lib/ai/generateSummary'

export async function createPost(formData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!['author', 'admin'].includes(userData?.role)) {
    throw new Error('Insufficient permissions')
  }

  const title = formData.get('title')
  const body = formData.get('body')
  const image_url = formData.get('image_url')

  const { data: post, error } = await supabase
    .from('posts')
    .insert({ title, body, image_url, author_id: user.id })
    .select()
    .single()
  if (error) throw error

  // Generate summary (only once) and store
  const summary = await generateSummary(title, body)
  const serviceClient = createServiceClient()
  await serviceClient.from('posts').update({ summary }).eq('id', post.id)

  revalidatePath('/')
  redirect(`/posts/${post.id}`)
}

export async function updatePost(postId, formData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: existing } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single()
  if (!existing) throw new Error('Post not found')

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  const isAuthor = existing.author_id === user.id
  const isAdmin = userData?.role === 'admin'
  if (!isAuthor && !isAdmin) throw new Error('Forbidden')

  const title = formData.get('title')
  const body = formData.get('body')
  const image_url = formData.get('image_url')

  const { error } = await supabase
    .from('posts')
    .update({ title, body, image_url, updated_at: new Date() })
    .eq('id', postId)
  if (error) throw error

  revalidatePath(`/posts/${postId}`)
  revalidatePath('/')
}

export async function deletePost(postId) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  if (userData?.role !== 'admin') throw new Error('Only admins can delete posts')

  await supabase.from('posts').delete().eq('id', postId)
  revalidatePath('/')
}