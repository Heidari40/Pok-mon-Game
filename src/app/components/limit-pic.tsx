'use client'

import { PokemonGame } from "./generte-pic";
import { useSearchParams } from "next/navigation";

function LimitedPokemon(){
  const searchParams = useSearchParams(); // giver adgang itl URL
  const initialLimit = Number(searchParams.get('limit')) || 20; //Hent limit fra url en standard til 36

    const validLimits = [20, 40, 60];

    const gameLimit = validLimits.includes(initialLimit) ? initialLimit : 20;

    const effectiveGameLimit = gameLimit * 2;
    let gridSize: number;

    if (effectiveGameLimit === 40){
      gridSize = 6;
    }else if (effectiveGameLimit === 80){
      gridSize = 8;
    }else if(effectiveGameLimit === 120){
      gridSize = 10;
    }else{
      gridSize = 8;
    }
    
return (
     
           
               <PokemonGame gameLimit = {gameLimit} gridSize = {gridSize}/>
   
)

}
export default LimitedPokemon;

