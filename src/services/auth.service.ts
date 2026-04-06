import api from './api'

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    nombreUsuario: string
    email: string
    idRol: number
    rol?: {
      id: number
      nombre: string
    }
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    let payload: any = {
      clave: credentials.password,
    }

    if (credentials.identifier.includes('@')) {
      payload.email = credentials.identifier
    } else {
      payload.nombreUsuario = credentials.identifier
    }

    const response = await api.post<LoginResponse>('/auth/login', payload)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  getUser(): any | null {
    const user = localStorage.getItem('user')
    if (!user) return null

    try {
      return JSON.parse(user)
    } catch (_) {
      console.warn('Invalid stored user JSON, clearing user from localStorage:', user)
      localStorage.removeItem('user')
      return null
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken()
    console.log('isAuthenticated check - token exists:', !!token)
    return !!token
  },
}
