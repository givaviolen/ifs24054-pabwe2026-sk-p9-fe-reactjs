import { apiRequest } from '../../../helpers/apiHelper'

export const login = (username, password) =>
  apiRequest('/auth/login', { method: 'POST', body: { username, password }, auth: false }).then((r) => r.data)

export const register = (username, email, password) =>
  apiRequest('/auth/register', { method: 'POST', body: { username, email, password }, auth: false }).then((r) => r.data)

export const getProfile = () => apiRequest('/auth/profile').then((r) => r.data)

export const updateProfile = (payload) =>
  apiRequest('/auth/profile', { method: 'PUT', body: payload }).then((r) => r.data)

export const logout = () => apiRequest('/auth/logout', { method: 'POST' })
