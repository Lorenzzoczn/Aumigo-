// Dados mockados para desenvolvimento sem MongoDB

const mockAnimals = [
  {
    _id: '1',
    name: 'Buddy',
    species: 'cachorro',
    breed: 'Golden Retriever',
    age: 3,
    size: 'grande',
    color: 'dourado',
    description: 'Cachorro muito carinhoso e brincalhão, adora crianças.',
    images: ['/uploads/buddy1.jpg'],
    location: {
      city: 'São Paulo',
      state: 'SP'
    },
    isCastrated: true,
    isVaccinated: true,
    status: 'disponivel',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Luna',
    species: 'gato',
    breed: 'Siamês',
    age: 2,
    size: 'pequeno',
    color: 'branco e preto',
    description: 'Gatinha muito carinhosa e independente.',
    images: ['/uploads/luna1.jpg'],
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    isCastrated: true,
    isVaccinated: true,
    status: 'disponivel',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: '3',
    name: 'Max',
    species: 'cachorro',
    breed: 'Labrador',
    age: 5,
    size: 'grande',
    color: 'preto',
    description: 'Cachorro muito leal e protetor.',
    images: ['/uploads/max1.jpg'],
    location: {
      city: 'Belo Horizonte',
      state: 'MG'
    },
    isCastrated: true,
    isVaccinated: true,
    status: 'disponivel',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

const mockUsers = [
  {
    _id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    role: 'user',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

const mockPosts = [
  {
    _id: '1',
    title: 'Como cuidar do seu pet',
    content: 'Dicas importantes para cuidar bem do seu animal de estimação...',
    author: 'Admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

module.exports = {
  mockAnimals,
  mockUsers,
  mockPosts
};