@echo off
echo 🚀 Iniciando Backend do Sistema Financeiro SOP...
echo.

REM Verificar se Java está instalado
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java não encontrado! Instale Java 17 em: https://adoptium.net/
    pause
    exit /b 1
)

echo ✅ Java encontrado!

REM Verificar se .env existe
if not exist ".env" (
    echo ❌ Arquivo .env não encontrado!
    echo Crie o arquivo .env com:
    echo DB_USERNAME=postgres
    echo DB_PASSWORD=SUA_SENHA_AQUI
    echo SERVER_PORT=8080
    pause
    exit /b 1
)

echo ✅ Arquivo .env encontrado!
echo.
echo 🔄 Executando aplicação...

REM Usar Maven Wrapper
mvnw.cmd spring-boot:run

pause
