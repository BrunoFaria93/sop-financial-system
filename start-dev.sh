#!/bin/bash

echo "🚀 Iniciando Sistema Financeiro SOP (Frontend + Backend)"
echo

echo "📂 Verificando estrutura do projeto..."
if [ ! -d "backend" ]; then
    echo "❌ Pasta backend não encontrada!"
    echo "Certifique-se de ter a pasta backend na raiz do projeto."
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado!"
    echo "Certifique-se de estar na raiz do projeto frontend."
    exit 1
fi

echo "✅ Estrutura do projeto OK!"
echo

echo "🔧 Instalando dependências do frontend..."
npm install

echo
echo "🔧 Compilando backend..."
cd backend
mvn clean compile
cd ..

echo
echo "🚀 Iniciando aplicações..."
echo
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8080/api"
echo "📚 Swagger: http://localhost:8080/api/swagger-ui.html"
echo

# Iniciar backend em background
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Aguardar um pouco para o backend iniciar
sleep 5

# Iniciar frontend
npm run dev

# Cleanup quando sair
trap "kill $BACKEND_PID" EXIT
