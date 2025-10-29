import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from '@/components/ui/Toaster'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { useLoading } from '@/hooks/useLoading'

// Components
import LoadingScreen from '@/components/ui/LoadingScreen'

// Layout
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// Pages
import Home from '@/pages/Home'
import About from '@/pages/About'
import Feed from '@/pages/Feed'
import Animals from '@/pages/Animals'
import Profile from '@/pages/Profile'
import Dashboard from '@/pages/Dashboard'
import NotFound from '@/pages/NotFound'

// Auth
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

function App() {
  const { isLoading } = useLoading(2500); // 2.5 segundos de loading mínimo

  return (
    <ThemeProvider defaultTheme="light" storageKey="aumigo-theme">
      <AuthProvider>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen key="loading" />
          ) : (
            <div key="app" className="min-h-screen bg-gradient-bg">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/animais" element={<Animals />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Register />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          )}
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App