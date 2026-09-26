@echo off
chcp 65001 >nul
title Despliegue Automático APEX LIFE - Servidor Contabo (80.241.212.9)
color 0B

echo =====================================================================
echo    🚀 DESPLIEGUE AUTOMÁTICO EN SERVIDOR CONTABO VPS (80.241.212.9)
echo =====================================================================
echo.
echo  Conectando con el servidor remoto...
echo  Cuando el servidor te solicite la contrasena, ingresa:
echo.
echo     >> AplexLife2026 <<
echo.
echo =====================================================================
echo.

ssh -t root@80.241.212.9 "bash -c 'set -e; echo \"=== 📥 1. DESCARGANDO ÚLTIMAS ACTUALIZACIONES DESDE GITHUB ===\"; TARGET_DIR=\$(find /var/www /root /home -maxdepth 3 -type d \( -name \"apex-life*\" -o -name \"APLICATIVO*\" -o -name \"gym-fit*\" \) 2>/dev/null | head -n 1); if [ -z \"\$TARGET_DIR\" ]; then TARGET_DIR=\"/var/www/apex-life\"; fi; echo \"Directorio del proyecto: \$TARGET_DIR\"; cd \"\$TARGET_DIR\"; git stash; git pull origin main; echo \"=== 📦 2. COMPILANDO BACKEND Y ACTUALIZANDO BASE DE DATOS ===\"; cd \"\$TARGET_DIR/backend\"; npm install --production=false; npx prisma generate; npx prisma db push --skip-generate; npm run build; echo \"=== 🔄 3. REINICIANDO PROCESOS EN PM2 ===\"; pm2 restart all || pm2 start dist/index.js --name \"apex-backend\"; pm2 save; echo \"\"; echo \"=== ✅ DESPLIEGUE COMPLETADO CON ÉXITO EN 80.241.212.9 ===\"; uptime; pm2 list'"

echo.
echo =====================================================================
echo   Proceso finalizado. Presiona cualquier tecla para salir.
echo =====================================================================
pause >nul
