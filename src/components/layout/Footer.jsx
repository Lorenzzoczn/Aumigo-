import { Link } from 'react-router-dom'
import { PawPrint, Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Aumigo</h3>
                <p className="text-sm text-gray-400">Conectando corações e patas</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Plataforma dedicada a conectar animais que precisam de um lar 
              com famílias amorosas, criando laços que transformam vidas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/animais" className="text-gray-300 hover:text-white transition-colors">
                  Animais
                </Link>
              </li>
              <li>
                <Link to="/feed" className="text-gray-300 hover:text-white transition-colors">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-300 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">contato@aumigo.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 mb-4 md:mb-0">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Feito com amor para os animais</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {currentYear} Aumigo. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer