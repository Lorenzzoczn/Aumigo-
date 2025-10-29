import { createContext, useContext } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  // Mock auth for now
  const value = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    login: async () => ({ success: false }),
    register: async () => ({ success: false }),
    logout: () => {},
    checkAuth: async () => {},
    clearError: () => {},
    isAuthenticated: false,
    isAdmin: false,
    isMaster: false,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}