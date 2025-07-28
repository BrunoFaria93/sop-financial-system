@echo off
echo 🚀 Iniciando Sistema Financeiro SOP...
echo.

REM Verificar se Java está instalado
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java não encontrado! Instale Java 17 em: https://adoptium.net/
    pause
    exit /b 1
)

echo ✅ Java encontrado!

REM Verificar se Maven está instalado
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Maven não encontrado. Use o VS Code para executar o projeto.
    echo.
    echo 📋 Instruções:
    echo 1. Abra o VS Code
    echo 2. Instale "Extension Pack for Java"
    echo 3. Abra a pasta do projeto
    echo 4. Execute FinancialSystemApplication.java
    pause
    exit /b 1
)

echo ✅ Maven encontrado!
echo.
echo 🔄 Executando aplicação...
mvn spring-boot:run

pause
