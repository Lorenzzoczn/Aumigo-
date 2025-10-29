#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🐾 Configurando o Aumigo...\n');

// Verificar se o Node.js está instalado
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js ${nodeVersion} encontrado`);
} catch (error) {
    console.error('❌ Node.js não encontrado. Instale o Node.js v14+ primeiro.');
    process.exit(1);
}

// Verificar se o MongoDB está disponível
console.log('🔍 Verificando MongoDB...');
try {
    execSync('mongod --version', { encoding: 'utf8', stdio: 'ignore' });
    console.log('✅ MongoDB encontrado');
} catch (error) {
    console.log('⚠️  MongoDB não encontrado localmente. Certifique-se de ter MongoDB rodando ou configure MongoDB Atlas.');
}

// Criar arquivo .env se não existir
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    console.log('📝 Criando arquivo .env...');
    const envExample = fs.readFileSync(path.join(__dirname, '..', 'env.example'), 'utf8');
    fs.writeFileSync(envPath, envExample);
    console.log('✅ Arquivo .env criado. Configure as variáveis conforme necessário.');
}

// Instalar dependências
console.log('\n📦 Instalando dependências...');
try {
    execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ Dependências instaladas com sucesso');
} catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
    process.exit(1);
}

console.log('\n🎉 Setup concluído com sucesso!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure o arquivo .env com suas credenciais');
console.log('2. Inicie o MongoDB (mongod ou MongoDB Atlas)');
console.log('3. Execute: npm run dev');
console.log('4. Acesse: http://localhost:3000');
console.log('\n🐾 Aumigo está pronto para conectar corações e patas!');

