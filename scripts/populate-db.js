#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Animal = require('../models/Animal');
const sampleAnimals = require('../data/sample-animals.json');
require('dotenv').config();

async function populateDatabase() {
    try {
        console.log('🐾 Conectando ao MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aumigo');
        console.log('✅ Conectado ao MongoDB');

        // Limpar dados existentes
        console.log('🧹 Limpando dados existentes...');
        await User.deleteMany({});
        await Animal.deleteMany({});
        console.log('✅ Dados limpos');

        // Criar usuários de exemplo
        console.log('👥 Criando usuários de exemplo...');
        
        const users = [
            {
                name: 'ONG Amigos dos Bichos',
                email: 'ong@amigosdosbichos.com',
                password: '123456',
                userType: 'ong',
                document: '12.345.678/0001-90',
                phone: '(11) 99999-9999',
                location: { city: 'São Paulo', state: 'SP' },
                description: 'ONG dedicada ao resgate e adoção de animais abandonados há mais de 10 anos.'
            },
            {
                name: 'Maria Silva',
                email: 'maria@email.com',
                password: '123456',
                userType: 'pessoa',
                document: '123.456.789-00',
                phone: '(21) 88888-8888',
                location: { city: 'Rio de Janeiro', state: 'RJ' },
                description: 'Apaixonada por animais, resgato e cuido de gatos e cachorros há anos.'
            },
            {
                name: 'João Santos',
                email: 'joao@email.com',
                password: '123456',
                userType: 'pessoa',
                document: '987.654.321-00',
                phone: '(31) 77777-7777',
                location: { city: 'Belo Horizonte', state: 'MG' },
                description: 'Veterinário aposentado que continua ajudando animais em situação de abandono.'
            },
            {
                name: 'ONG Patas & Corações',
                email: 'contato@patasecoracoes.org',
                password: '123456',
                userType: 'ong',
                document: '98.765.432/0001-10',
                phone: '(61) 66666-6666',
                location: { city: 'Brasília', state: 'DF' },
                description: 'Organização sem fins lucrativos focada no bem-estar animal e adoção responsável.'
            },
            {
                name: 'Ana Costa',
                email: 'ana@email.com',
                password: '123456',
                userType: 'pessoa',
                document: '456.789.123-00',
                phone: '(71) 55555-5555',
                location: { city: 'Salvador', state: 'BA' },
                description: 'Cuidadora de animais com experiência em resgate e reabilitação.'
            }
        ];

        const createdUsers = [];
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
            console.log(`✅ Usuário criado: ${user.name}`);
        }

        // Criar animais de exemplo
        console.log('🐕 Criando animais de exemplo...');
        
        for (let i = 0; i < sampleAnimals.length; i++) {
            const animalData = sampleAnimals[i];
            const owner = createdUsers[i % createdUsers.length]; // Distribuir entre os usuários
            
            const animal = new Animal({
                ...animalData,
                owner: owner._id
            });
            
            await animal.save();
            console.log(`✅ Animal criado: ${animal.name} (dono: ${owner.name})`);
        }

        console.log('\n🎉 Banco de dados populado com sucesso!');
        console.log('\n📋 Dados criados:');
        console.log(`👥 ${createdUsers.length} usuários`);
        console.log(`🐾 ${sampleAnimals.length} animais`);
        
        console.log('\n🔑 Credenciais de teste:');
        console.log('ONG Amigos dos Bichos - ong@amigosdosbichos.com / 123456');
        console.log('Maria Silva - maria@email.com / 123456');
        console.log('João Santos - joao@email.com / 123456');
        console.log('ONG Patas & Corações - contato@patasecoracoes.org / 123456');
        console.log('Ana Costa - ana@email.com / 123456');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao popular banco de dados:', error);
        process.exit(1);
    }
}

populateDatabase();
