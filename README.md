# 🎬 Movie Search MCP Server

A complete MCP (Model Context Protocol) server for searching and obtaining detailed movie information using OMDb (IMDB) and TMDb APIs.

<a href="https://glama.ai/mcp/servers/@tonderflash/movie-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@tonderflash/movie-mcp/badge" alt="Movie Search Server MCP server" />
</a>

## 🚀 Features

- ✅ Search movies by title and year
- ✅ Detailed movie information (synopsis, director, actors, etc.)
- ✅ Genre-based recommendations
- ✅ Popular/trending movies
- ✅ Support for multiple APIs (OMDb + TMDb)
- ✅ English responses
- ✅ Robust error handling

## 📋 Requirements

- Node.js 18+
- TypeScript
- API keys (see configuration)

## 🛠️ Installation

1. **Clone or create the project:**

```bash
git clone <repo> # or create a new folder
cd movie-mcp
```

2. **Install dependencies:**

```bash
npm install
```

3. **Build the project:**

```bash
npm run build
```

## 🔐 API Configuration

### OMDb API (Free)

1. Go to: https://www.omdbapi.com/apikey.aspx
2. Register to get your free API key
3. Add the environment variable: `OMDB_API_KEY=your_api_key`

### TMDb API (Free)

1. Go to: https://www.themoviedb.org/settings/api
2. Register and request an API key
3. Add the environment variable: `TMDB_API_KEY=your_api_key`

### Environment Variables

Create a `.env` file in the project root:

```bash
OMDB_API_KEY=your_omdb_api_key
TMDB_API_KEY=your_tmdb_api_key
```

## 🎯 Available Tools

### 1. `search_movies`

Search movies by title and optionally by year.

**Parameters:**

- `title` (string, required): Movie title
- `year` (string, optional): Movie year

**Example:**

```
Search movies with title "Batman" from year "2008"
```

### 2. `get_movie_details`

Get complete information for a specific movie.

**Parameters:**

- `id` (string, required): Movie ID (IMDB ID or TMDb ID)
- `source` (string, optional): 'omdb' or 'tmdb' (default: 'omdb')

**Example:**

```
Get details for movie with ID "tt0468569" using source "omdb"
```

### 3. `recommend_movies`

Get movie recommendations by genre.

**Parameters:**

- `genre` (string, optional): Specific genre

**Available genres:**

- action, adventure, animation, comedy, crime
- documentary, drama, family, fantasy, history
- horror, music, mystery, romance, science fiction
- thriller, war, western

**Example:**

```
Recommend me "action" movies
```

### 4. `popular_movies`

Get the most popular movies of the week.

**Parameters:** None

**Example:**

```
What are the popular movies?
```

### 5. `movie_help`

Show help information about all available tools.

## 🔧 Cursor Configuration

To use this MCP server in Cursor, add the following configuration to your `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "movie-search": {
      "command": "node",
      "args": ["/full/path/to/your/project/dist/index.js"],
      "env": {
        "OMDB_API_KEY": "your_omdb_api_key",
        "TMDB_API_KEY": "your_tmdb_api_key"
      }
    }
  }
}
```

## 🎮 Usage in Cursor

Once configured, you can use the tools directly in Cursor:

```
// Search movies
"Search movies of Batman from 2008"

// Get details
"Give me details of movie tt0468569"

// Recommendations
"Recommend me action movies"

// Popular movies
"What are the popular movies this week?"

// Help
"Show me the movie server help"
```

## 🧪 Testing

To test the server locally:

```bash
# Build
npm run build

# Run the server
npm start

# Or in development mode
npm run dev
```

## 📝 Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Build in watch mode
- `npm start`: Run the compiled server
- `npm test`: Run the server (start alias)

## 🔍 Project Structure

```
movie-mcp/
├── src/
│   ├── index.ts          # Main MCP server
│   ├── movie-apis.ts     # API functions
│   └── types.ts          # TypeScript types
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🌟 Technical Features

- **MCP Protocol**: Implements the Model Context Protocol standard
- **Multiple APIs**: Combines OMDb and TMDb for better results
- **Validation**: Uses Zod for parameter validation
- **TypeScript**: Fully typed code
- **Error handling**: Informative responses in case of error
- **Internationalization**: English responses

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the LICENSE file for more details.

## 🆘 Troubleshooting

### Error: "Module not found"

- Make sure to run `npm install`
- Verify that Node.js is installed (version 18+)

### Error: "API key invalid"

- Verify that environment variables are configured correctly
- Confirm that API keys are valid

### Error: "No results found"

- Check your internet connection
- Confirm that movie names are spelled correctly

### Server not responding

- Verify that the file is compiled (`npm run build`)
- Check the configuration in `.cursor/mcp.json`
- Confirm that the path to the file is correct