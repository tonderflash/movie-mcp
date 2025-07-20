# 🎬 Servidor MCP de Búsqueda de Películas

Un servidor MCP (Model Context Protocol) completo para buscar y obtener información detallada de películas usando las APIs de OMDb (IMDB) y TMDb.

## 🚀 Características

- ✅ Búsqueda de películas por título y año
- ✅ Información detallada de películas (sinopsis, director, actores, etc.)
- ✅ Recomendaciones por género
- ✅ Películas populares/trending
- ✅ Soporte para múltiples APIs (OMDb + TMDb)
- ✅ Respuestas en español
- ✅ Manejo de errores robusto

## 📋 Requisitos

- Node.js 18+
- TypeScript
- Claves de API (ver configuración)

## 🛠️ Instalación

1. **Clona o crea el proyecto:**

```bash
git clone <repo> # o crea una carpeta nueva
cd movie-mcp
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Compila el proyecto:**

```bash
npm run build
```

## 🔐 Configuración de APIs

### OMDb API (Gratuita)

1. Ve a: https://www.omdbapi.com/apikey.aspx
2. Regístrate para obtener tu API key gratuita
3. Agrega la variable de entorno: `OMDB_API_KEY=tu_api_key`

### TMDb API (Gratuita)

1. Ve a: https://www.themoviedb.org/settings/api
2. Regístrate y solicita una API key
3. Agrega la variable de entorno: `TMDB_API_KEY=tu_api_key`

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
OMDB_API_KEY=tu_omdb_api_key
TMDB_API_KEY=tu_tmdb_api_key
```

## 🎯 Herramientas Disponibles

### 1. `buscar_peliculas`

Busca películas por título y opcionalmente por año.

**Parámetros:**

- `titulo` (string, requerido): Título de la película
- `año` (string, opcional): Año de la película

**Ejemplo:**

```
Busca películas con título "Batman" del año "2008"
```

### 2. `obtener_detalles_pelicula`

Obtiene información completa de una película específica.

**Parámetros:**

- `id` (string, requerido): ID de la película (IMDB ID o TMDb ID)
- `fuente` (string, opcional): 'omdb' o 'tmdb' (por defecto: 'omdb')

**Ejemplo:**

```
Obtén detalles de la película con ID "tt0468569" usando fuente "omdb"
```

### 3. `recomendar_peliculas`

Obtiene recomendaciones de películas por género.

**Parámetros:**

- `genero` (string, opcional): Género específico

**Géneros disponibles:**

- accion, aventura, animacion, comedia, crimen
- documental, drama, familia, fantasia, historia
- terror, musica, misterio, romance, ciencia ficcion
- suspense, guerra, western

**Ejemplo:**

```
Recomiéndame películas de "accion"
```

### 4. `peliculas_populares`

Obtiene las películas más populares de la semana.

**Parámetros:** Ninguno

**Ejemplo:**

```
¿Cuáles son las películas populares?
```

### 5. `ayuda_peliculas`

Muestra información de ayuda sobre todas las herramientas disponibles.

## 🔧 Configuración en Cursor

Para usar este servidor MCP en Cursor, agrega la siguiente configuración a tu archivo `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "movie-search": {
      "command": "node",
      "args": ["/ruta/completa/a/tu/proyecto/dist/index.js"],
      "env": {
        "OMDB_API_KEY": "tu_omdb_api_key",
        "TMDB_API_KEY": "tu_tmdb_api_key"
      }
    }
  }
}
```

## 🎮 Uso en Cursor

Una vez configurado, puedes usar las herramientas directamente en Cursor:

```
// Buscar películas
"Busca películas de Batman del 2008"

// Obtener detalles
"Dame detalles de la película tt0468569"

// Recomendaciones
"Recomiéndame películas de acción"

// Películas populares
"¿Cuáles son las películas populares esta semana?"

// Ayuda
"Muéstrame la ayuda del servidor de películas"
```

## 🧪 Pruebas

Para probar el servidor localmente:

```bash
# Compilar
npm run build

# Ejecutar el servidor
npm start

# O en modo desarrollo
npm run dev
```

## 📝 Scripts Disponibles

- `npm run build`: Compila el TypeScript a JavaScript
- `npm run dev`: Compila en modo watch
- `npm start`: Ejecuta el servidor compilado
- `npm test`: Ejecuta el servidor (alias de start)

## 🔍 Estructura del Proyecto

```
movie-mcp/
├── src/
│   ├── index.ts          # Servidor MCP principal
│   ├── movie-apis.ts     # Funciones de APIs
│   └── types.ts          # Tipos TypeScript
├── dist/                 # JavaScript compilado
├── package.json
├── tsconfig.json
└── README.md
```

## 🌟 Características Técnicas

- **Protocolo MCP**: Implementa el estándar Model Context Protocol
- **APIs múltiples**: Combina OMDb y TMDb para mejores resultados
- **Validación**: Usa Zod para validación de parámetros
- **TypeScript**: Código completamente tipado
- **Manejo de errores**: Respuestas informativas en caso de error
- **Internacionalización**: Respuestas en español

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver el archivo LICENSE para más detalles.

## 🆘 Solución de Problemas

### Error: "Module not found"

- Asegúrate de ejecutar `npm install`
- Verifica que Node.js esté instalado (versión 18+)

### Error: "API key invalid"

- Verifica que las variables de entorno estén configuradas correctamente
- Confirma que las API keys sean válidas

### Error: "No results found"

- Verifica tu conexión a internet
- Confirma que los nombres de películas estén escritos correctamente

### El servidor no responde

- Verifica que el archivo esté compilado (`npm run build`)
- Revisa la configuración en `.cursor/mcp.json`
- Confirma que la ruta al archivo sea correcta
