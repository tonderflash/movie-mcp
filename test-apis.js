#!/usr/bin/env node

// Simple script to test movie APIs
import { searchMovies, getMovieDetails } from "./dist/movie-apis.js";

async function testAPIs() {
  console.log("🎬 Testing movie APIs...\n");

  try {
    // Test basic search
    console.log('🔍 Searching for "Batman"...');
    const results = await searchMovies("Batman");

    if (results.length > 0) {
      console.log(`✅ Found ${results.length} movies:`);
      results.slice(0, 3).forEach((movie, i) => {
        console.log(
          `   ${i + 1}. ${movie.title} (${
            movie.year
          }) - ${movie.source.toUpperCase()}`
        );
      });

      // Test details for first movie
      const firstMovie = results[0];
      console.log(`\n📝 Getting details for "${firstMovie.title}"...`);

      const details = await getMovieDetails(firstMovie.id, firstMovie.source);
      if (details) {
        console.log(`✅ Details obtained:`);
        console.log(`   Title: ${details.title}`);
        console.log(`   Year: ${details.year}`);
        console.log(`   Genre: ${details.genre}`);
        console.log(`   Rating: ${details.rating}`);
        console.log(`   Director: ${details.director || "N/A"}`);
      } else {
        console.log("❌ Could not get details");
      }
    } else {
      console.log("⚠️  No movies found. This could be due to:");
      console.log("   - Missing API keys configuration");
      console.log("   - Internet connection issues");
      console.log("   - API rate limits reached");
    }
  } catch (error) {
    console.error("❌ Error during tests:", error.message);
    console.log("\n💡 Make sure to:");
    console.log(
      "   1. Configure environment variables OMDB_API_KEY and TMDB_API_KEY"
    );
    console.log("   2. Have internet connection");
    console.log("   3. Use valid API keys");
  }

  console.log("\n🎉 Test completed");
  console.log("\n📋 Available MCP tools (use in Claude):");
  console.log("   - search_movies");
  console.log("   - get_movie_details");
  console.log("   - recommend_movies");
  console.log("   - popular_movies");
  console.log("   - movie_help");
  console.log("\n🎬 Ready to use in Claude Desktop!");
}

testAPIs();
