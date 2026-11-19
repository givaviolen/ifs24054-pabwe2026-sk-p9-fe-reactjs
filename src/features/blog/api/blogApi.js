import { apiRequest } from '../../../helpers/apiHelper'

const data = (r) => r.data

// Publik
export const getCategories = () => apiRequest('/public/categories', { auth: false }).then(data)

export const getPublicPosts = (q = '', category = '') => {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category && category !== 'Semua') params.set('category', category)
  const qs = params.toString()
  return apiRequest(`/public/posts${qs ? `?${qs}` : ''}`, { auth: false }).then(data)
}

export const getPublicPost = (slug) => apiRequest(`/public/posts/${slug}`, { auth: false }).then(data)

// Penulis
export const getMyPosts = () => apiRequest('/posts').then(data)
export const getStats = () => apiRequest('/posts/stats').then(data)
export const createPost = (body) => apiRequest('/posts', { method: 'POST', body }).then(data)
export const updatePost = (id, body) => apiRequest(`/posts/${id}`, { method: 'PUT', body }).then(data)
export const togglePublish = (id) => apiRequest(`/posts/${id}/toggle-publish`, { method: 'PATCH' }).then(data)
export const deletePost = (id) => apiRequest(`/posts/${id}`, { method: 'DELETE' })
export const aiGenerate = (topic, category, includeWebSearch) =>
  apiRequest('/posts/ai-generate', {
    method: 'POST',
    body: { topic, category, include_web_search: includeWebSearch },
  }).then(data)
