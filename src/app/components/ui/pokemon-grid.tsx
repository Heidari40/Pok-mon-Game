'use client';

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled"; // Correct import for @emotion/styled
import { getPokemonList, getPokemon, PokemonDetails} from "../lib/pokemonApi"; // Correct path assuming 'lib' is one level up
import { PokemonCard } from "./pokemonCards";// Correct component name and path

// Interface for the basic Pokémon data returned by getPokemonList
interface BasicPokemon {
  name: string;
  url: string;
}

/**
 * PokemonGrid component fetches a list of Pokémon, then their detailed information (including images),
 * and displays them in a responsive grid using the PokemonCard component.
 *JSX.Element - A grid of Pokémon cards.
 */
export function PokemonGrid() {
  // State to store the list of detailed Pokémon data
  const [pokemonList, setPokemonList] = useState<(PokemonDetails & { picture: string })[]>([]);
  // State to manage loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to perform data fetching when the component mounts
  useEffect(() => {
    const fetchAllPokemonData = async () => {
      try {
        // 1. Fetch the initial list of Pokémon names and URLs
        const basicPokemonList: BasicPokemon[] = await getPokemonList(100);

        // 2. For each basic Pokémon, fetch its detailed data (including the image URL)
        // Use Promise.all to fetch details for all Pokémon concurrently for efficiency
        const detailedPokemonPromises = basicPokemonList.map(async (p) => {
          const details: PokemonDetails = await getPokemon(p.name);
          // Extract the official artwork front_default sprite
          const picture = details.sprites.other["official-artwork"].front_default;
          // Return a new object combining name and picture for the PokemonCard
          return { ...details, picture };
        });

        // Wait for all detailed Pokémon data fetches to complete
        const fullPokemonData = await Promise.all(detailedPokemonPromises);
        
        // Update the state with the fetched data
        setPokemonList(fullPokemonData);
      } catch (err) {
        // Handle any errors during fetching
        console.error("Failed to fetch Pokémon data:", err);
        setError("Failed to load Pokémon. Please try again later.");
      } finally {
        // Set loading to false once fetching is complete (either success or error)
        setLoading(false);
      }
    };

    fetchAllPokemonData(); // Call the async function
  }, []); // Empty dependency array means this effect runs only once after initial render

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Pokémon game...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  // Render the grid of Pokémon cards
  return (
    <CardWrapper>
      {pokemonList.map((pokemon) => (
        // Render each PokemonCard, passing the necessary props
        <PokemonCard
          key={pokemon.name} // Unique key for each card
          name={pokemon.name}
          picture={pokemon.picture}
        />
        ))}

         {pokemonList.map((pokmeon) => (
          <PokemonCard 
          key={pokmeon.name}
          name={pokmeon.name}
          picture={pokmeon.picture}
          />
         ))}

    </CardWrapper>
    
  );
}

// Styled component for the grid container
const CardWrapper = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  padding: 10px; 
  max-width: 1200px; 
  margin: 0 auto;
  

  @media (max-width: 1200px) { // Hvis skærmen er mindre end 1200px, kan vi reducere antallet af kolonner
    grid-template-columns: repeat(7, 1fr); // 
  }

  @media (max-width: 992px) { // Mindre skærme, f.eks. tablet liggende
    grid-template-columns: repeat(5, 1fr); // 
  }

  @media (max-width: 768px) { // Tablet stående
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 600px) { // Mobil
    grid-template-columns: repeat(4, 1fr); 
    margin: 0 auto;
    max-width: 26.5em;
    gap: 3px;
    padding: 4px;
    margin-right: 12px;
  }
`;
