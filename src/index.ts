#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  searchMovies,
  getMovieDetails,
  getMovieRecommendations,
  getTrendingMovies,
} from "./movie-apis.js";

// Create MCP server
const server = new McpServer({
  name: "movie-search-server",
  version: "1.0.0",
  description: "MCP server for movie searches using OMDb and TMDb APIs",
});

/**
 * Tool to search movies by title
 */
server.tool(
  "search_movies",
  {
    title: z.string().describe("Movie title to search for"),
    year: z.string().optional().describe("Movie year (optional)"),
  },
  async ({ title, year }) => {
    try {
      const results = await searchMovies(title, year);

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No movies found with title "${title}"${
                year ? ` from year ${year}` : ""
              }.`,
            },
          ],
        };
      }

      let response = `🎬 **Found ${results.length} movies for "${title}":**\n\n`;

      results.forEach((movie, index) => {
        response += `${index + 1}. **${movie.title}** (${movie.year})\n`;
        response += `   - ID: ${movie.id}\n`;
        response += `   - Source: ${movie.source.toUpperCase()}\n`;
        if (movie.poster !== "N/A") {
          response += `   - Poster: ${movie.poster}\n`;
        }
        response += "\n";
      });

      response +=
        '\n💡 *Use "get_movie_details" with the ID for more information.*';

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error searching movies: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }
  }
);

/**
 * Tool to get complete movie details
 */
server.tool(
  "get_movie_details",
  {
    id: z.string().describe("Movie ID (IMDB ID or TMDb ID)"),
    source: z
      .enum(["omdb", "tmdb"])
      .default("omdb")
      .describe("Data source (omdb or tmdb)"),
  },
  async ({ id, source }) => {
    try {
      const details = await getMovieDetails(id, source);

      if (!details) {
        return {
          content: [
            {
              type: "text",
              text: `❌ No details found for movie with ID "${id}" in ${source.toUpperCase()}.`,
            },
          ],
        };
      }

      let response = `🎬 **${details.title}** (${details.year})\n\n`;
      response += `📝 **Plot:** ${details.plot}\n\n`;
      response += `🎭 **Genre:** ${details.genre}\n`;
      response += `⭐ **Rating:** ${details.rating}\n`;
      response += `⏱️ **Runtime:** ${details.runtime || "N/A"}\n`;

      if (details.director) {
        response += `🎬 **Director:** ${details.director}\n`;
      }

      if (details.actors) {
        response += `👥 **Main Cast:** ${details.actors}\n`;
      }

      if (details.language) {
        response += `🌍 **Language:** ${details.language}\n`;
      }

      if (details.country) {
        response += `🏴 **Country:** ${details.country}\n`;
      }

      if (details.awards && details.awards !== "N/A") {
        response += `🏆 **Awards:** ${details.awards}\n`;
      }

      if (details.boxOffice && details.boxOffice !== "N/A") {
        response += `💰 **Box Office:** ${details.boxOffice}\n`;
      }

      if (details.imdbId) {
        response += `🔗 **IMDB ID:** ${details.imdbId}\n`;
      }

      response += `\n📊 **Source:** ${details.source.toUpperCase()}`;

      if (details.poster !== "N/A") {
        response += `\n\n🖼️ **Poster:** ${details.poster}`;
      }

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error getting details: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }
  }
);

/**
 * Tool to get movie recommendations
 */
server.tool(
  "recommend_movies",
  {
    genre: z
      .string()
      .optional()
      .describe(
        "Movie genre (optional). Examples: action, comedy, drama, horror, sci-fi, romance"
      ),
  },
  async ({ genre }) => {
    try {
      const recommendations = await getMovieRecommendations(genre);

      if (recommendations.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `❌ No recommendations found${
                genre ? ` for genre "${genre}"` : ""
              }.`,
            },
          ],
        };
      }

      let response = `🎯 **Movie recommendations${
        genre ? ` for ${genre}` : " (popular)"
      }:**\n\n`;

      recommendations.forEach((movie, index) => {
        response += `${index + 1}. **${movie.title}** (${movie.year})\n`;
        response += `   - TMDb ID: ${movie.id}\n`;
        if (movie.poster !== "N/A") {
          response += `   - Poster: ${movie.poster}\n`;
        }
        response += "\n";
      });

      response +=
        '\n💡 *Use "get_movie_details" with the ID and source "tmdb" for more information.*';

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error getting recommendations: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
    }
  }
);

/**
 * Tool to get popular/trending movies
 */
server.tool("popular_movies", {}, async () => {
  try {
    const popular = await getTrendingMovies();

    if (popular.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "❌ Could not get popular movies at this time.",
          },
        ],
      };
    }

    let response = "🔥 **Most popular movies this week:**\n\n";

    popular.forEach((movie, index) => {
      response += `${index + 1}. **${movie.title}** (${movie.year})\n`;
      response += `   - TMDb ID: ${movie.id}\n`;
      if (movie.poster !== "N/A") {
        response += `   - Poster: ${movie.poster}\n`;
      }
      response += "\n";
    });

    response +=
      '\n💡 *Use "get_movie_details" with the ID and source "tmdb" for more information.*';

    return {
      content: [
        {
          type: "text",
          text: response,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error getting popular movies: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ],
    };
  }
});

/**
 * Help tool that explains how to use the server
 */
server.tool("movie_help", {}, async () => {
  const help = `
🎬 **Movie Search MCP Server** 🎬

**Available tools:**

1. **search_movies** - Search movies by title
   - \`title\`: Movie title (required)
   - \`year\`: Movie year (optional)

2. **get_movie_details** - Get complete movie information
   - \`id\`: Movie ID (IMDB ID or TMDb ID)
   - \`source\`: 'omdb' or 'tmdb' (default: omdb)

3. **recommend_movies** - Get movie recommendations
   - \`genre\`: Specific genre (optional)
   - Available genres: action, adventure, animation, comedy, crime, documentary, drama, family, fantasy, history, horror, music, mystery, romance, science fiction, thriller, war, western

4. **popular_movies** - Get the most popular movies of the week

5. **movie_help** - Show this help

**APIs used:**
- 🎭 **OMDb API**: For detailed IMDB information
- 🎬 **TMDb API**: For advanced searches and recommendations

**Required configuration:**
- Environment variable \`OMDB_API_KEY\` (get at: http://www.omdbapi.com/apikey.aspx)
- Environment variable \`TMDB_API_KEY\` (get at: https://www.themoviedb.org/settings/api)

**Usage examples:**
- "Search for Batman movies"
- "Get details for movie tt0468569"
- "Recommend action movies"
- "What are the popular movies?"
`;

  return {
    content: [
      {
        type: "text",
        text: help,
      },
    ],
  };
});

/**
 * Initialize the server
 */
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("🎬 Movie MCP server started successfully");
  } catch (error) {
    console.error("❌ Error starting MCP server:", error);
    process.exit(1);
  }
}

// Handle exit signals
process.on("SIGINT", async () => {
  console.error("\n🛑 Shutting down MCP server...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.error("\n🛑 Shutting down MCP server...");
  process.exit(0);
});

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
