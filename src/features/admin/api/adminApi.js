import { apiRequest } from '../../../helpers/apiHelper'

export const getUsers = () => apiRequest('/admin/users').then((r) => r.data)
export const getAllPosts = () => apiRequest('/admin/posts').then((r) => r.data)
export const getUserPosts = (id) => apiRequest(`/admin/users/${id}/posts`).then((r) => r.data)
