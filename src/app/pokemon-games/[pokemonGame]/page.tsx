'use client'; 

import Link from "next/link";
import styled from "@emotion/styled";
import {PokemonGame} from "../../components/generte-pic";
import { useSearchParams } from "next/navigation";


export default function PokemonPlayerPage() {
  const searchparms = useSearchParams();
  const limitFromUrl = Number(searchparms.get('limit')) || 20;
   const validLimits = [20, 40, 60];
  const gameLimit = validLimits.includes(limitFromUrl) ? limitFromUrl : 20;

  // Calculate the total number of cards for the game
  const totalGameCards = gameLimit * 2;

  // Determine the number of columns (gridSize) based on the total number of cards
  let gridSize: number;
  if (totalGameCards === 40) { // 20 unique Pokemon -> 40 total cards
    gridSize = 5; // Example: 8 columns (will result in 8x5 grid)
  } else if (totalGameCards === 80) { // 40 unique Pokemon -> 80 total cards
    gridSize = 8; // Example: 10 columns (will result in 10x8 grid)
  } else if (totalGameCards === 120) { // 60 unique Pokemon -> 120 total cards
    gridSize = 10; 
  } else {
    // Fallback: If an unexpected limit somehow gets through, default to 8 columns
    gridSize = 8; 
  }


  return (
    <MainWrapper>
    
      <div>
        
        <div className="flex justify-between itmes-center">
           <h1 className="text-left text-2xl font-extrabold text-gray-800 dark:text-white m-7 sm:my-10">
        Pokémon Game
      </h1>
      <Link
        href= "/settings/settingsPage" 
        className="text-right text-2xl m-7 sm:my-10 border-2 cursor-pointer text-white p-2 rounded-lg hover:bg-green-700 transition-colors">
          Settings
        </Link>

        </div>
      
                  <PokemonGame gameLimit={gameLimit} gridSize={gridSize}/>

          
       <Link href={"/"} className="text-blue-500  p-3 mb-10 border-amber-600 hover:underline text-xl margin-top: auto;">
          Go Back
        </Link>
    
      <div className="mt-10 mb-5 text-gray-600 dark:text-gray-400 text-sm">
        Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">PokeAPI</a>
      </div>

        
      </div>
    </MainWrapper>
  );
}

const MainWrapper = styled.main`
  display: flex;
  flex-direction: column;
   align-items: center;
`