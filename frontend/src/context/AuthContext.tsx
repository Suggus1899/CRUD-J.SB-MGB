import { createContext, useContext, useState, ReactNode } from 'react'
import api from '@/lib/api'
import { AuthUser, AuthResponse } from '@/types'

interface AuthContextType {
  user: AuthUser | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { return JSON.parse(localStorage.getItem('user') ?? 'null') as AuthUser } catch { return null }
  })

  async function login(username: string, password: string): Promise<void> {
    const { data } = await api.post<AuthResponse>('/auth/login', { username, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }))
    setUser({ username: data.username, role: data.role })
  }

  async function register(username: string, email: string, password: string): Promise<void> {
    const { data } = await api.post<AuthResponse>('/auth/register', { username, email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }))
    setUser({ username: data.username, role: data.role })
  }

  function logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
