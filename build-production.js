const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build de produção...');

// Verificar estrutura atual
console.log('📁 Diretório atual:', process.cwd());
console.log('📋 Arquivos na raiz:', fs.readdirSync('.').filter(f => !f.startsWith('.')).join(', '));

// Limpar dist se existir
if (fs.existsSync('dist')) {
  console.log('🗑️ Removendo pasta dist antiga...');
  fs.rmSync('dist', { recursive: true, force: true });
}

try {
  // Executar build
  console.log('🔨 Executando vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Verificar se o build foi bem-sucedido
  if (fs.existsSync('dist')) {
    console.log('✅ Pasta dist criada com sucesso!');
    
    const distFiles = fs.readdirSync('dist');
    console.log('📋 Arquivos em dist:', distFiles.join(', '));
    
    if (fs.existsSync('dist/index.html')) {
      console.log('✅ index.html encontrado!');
      
      // Verificar tamanho do arquivo
      const stats = fs.statSync('dist/index.html');
      console.log(`📊 Tamanho do index.html: ${stats.size} bytes`);
      
      if (stats.size > 0) {
        console.log('🎉 Build concluído com sucesso!');
        process.exit(0);
      } else {
        console.error('❌ index.html está vazio');
        process.exit(1);
      }
    } else {
      console.error('❌ index.html não foi gerado');
      process.exit(1);
    }
  } else {
    console.error('❌ Pasta dist não foi criada');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}