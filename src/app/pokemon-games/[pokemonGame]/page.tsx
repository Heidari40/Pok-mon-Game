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
  const playersFromUrl = Number(searchparms.get('players') || 1);
  const initialNumPlayer: 1 | 2 = (playersFromUrl === 1 || playersFromUrl === 2) ? (playersFromUrl as 1 | 2) : 1;

  // Calculate the total number of cards for the game
  const totalGameCards = gameLimit * 2;

  // Determine the number of columns (gridSize) based on the total number of cards
  let gridSize: number;
  if (totalGameCards === 40) { 
    gridSize = 5; 
  } else if (totalGameCards === 80) { 
    gridSize = 8; 
  } else if (totalGameCards === 120) { 
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
        className="text-right text-2xl m-7 sm:my-10 border-2 cursor-pointer text-#808080 p-2 rounded-lg hover:bg-green-700 transition-colors">
          Settings
        </Link>

        </div>
      
                  <PokemonGame gameLimit={gameLimit} gridSize={gridSize} initialNumPlayers={initialNumPlayer}/>

          
       <Link href={"/"} className="text-blue-500  p-3 mb-10 border-amber-600 hover:underline text-xl margin-top: auto;">
          Go Back
        </Link>
    
      <div className=" text-gray-600 dark:text-gray-400 text-sm">
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