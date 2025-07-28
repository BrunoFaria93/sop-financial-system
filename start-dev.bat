@echo off
echo 🚀 Iniciando Sistema Financeiro SOP (Frontend + Backend)
echo.

echo 📂 Verificando estrutura do projeto...
if not exist "backend" (
    echo ❌ Pasta backend não encontrada!
    echo Certifique-se de ter a pasta backend na raiz do projeto.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ❌ package.json não encontrado!
    echo Certifique-se de estar na raiz do projeto frontend.
    pause
    exit /b 1
)

echo ✅ Estrutura do projeto OK!
echo.

echo 🔧 Instalando dependências do frontend...
call npm install

echo.
echo 🔧 Compilando backend...
cd backend
call mvn clean compile
cd ..

echo.
echo 🚀 Iniciando aplicações...
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8080/api
echo 📚 Swagger: http://localhost:8080/api/swagger-ui.html
echo.

start cmd /k "cd backend && mvn spring-boot:run"
timeout /t 3 /nobreak > nul
call npm run dev

pause
