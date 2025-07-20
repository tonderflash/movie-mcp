#!/bin/bash

echo "🎬 Instalando Servidor MCP de Películas..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

echo "✅ Node.js y npm encontrados"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"

# Compilar proyecto
echo "🔨 Compilando proyecto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al compilar proyecto"
    exit 1
fi

echo "✅ Proyecto compilado"

# Crear archivo de configuración si no existe
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    echo "⚠️  Por favor edita el archivo .env con tus API keys"
fi

# Mostrar rutas importantes
echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "📁 Ruta del ejecutable: $(pwd)/dist/index.js"
echo "📝 Archivo de configuración: $(pwd)/cursor-mcp-config.json"
echo ""
echo "📋 Próximos pasos:"
echo "1. Obtén tus API keys:"
echo "   - OMDb: https://www.omdbapi.com/apikey.aspx"
echo "   - TMDb: https://www.themoviedb.org/settings/api"
echo ""
echo "2. Edita el archivo .env con tus API keys"
echo ""
echo "3. Copia la configuración de cursor-mcp-config.json a tu .cursor/mcp.json"
echo "   y actualiza la ruta completa al archivo dist/index.js"
echo ""
echo "4. Reinicia Cursor y ¡disfruta buscando películas! 🍿" 
