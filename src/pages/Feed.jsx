import { motion } from 'framer-motion'

const Feed = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Feed da Comunidade
          </h1>
          <p className="text-xl text-gray-600">
            Acompanhe as últimas novidades sobre adoções e pets
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Feed