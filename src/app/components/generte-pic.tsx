'use client'

import { useCallback, useEffect, useState } from "react";
import { getPokemonList, getPokemon, PokemonDetails  } from "./lib/pokemonIPA";
import styled from "@emotion/styled";
import { PokemonCard } from "./ui/pokemonCards";
import pokemonCardBack from './ui/pik/pikachu_528098.png'
import Image from "next/image";
 


interface CardData {
    id: number;
    name: string;
    picture: string;
    isFlipped: boolean;
    isMatch: boolean;
    uniqueId: string;
}
interface PokemonGameProps {
    gameLimit: number;
    gridSize: number;
}

export function PokemonGame({gameLimit, gridSize}: PokemonGameProps){
   
    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedCards, setFlippedCards] = useState <CardData[]>([]);
    const [lockBoard, setLockBoard] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

// useCallback der bruges til at memoize funktioner.

const shuffleCards = useCallback(async () =>{
    try{
        setLoading(true)
        setError(null);


        const numberOfPairs = gameLimit / 2;
        const basicPokemonList = await getPokemonList(numberOfPairs);

        const detailePokemonPromises = basicPokemonList.map(async (e) =>{
            const details: PokemonDetails = await getPokemon(e.name);
            const picture = details.sprites.other["official-artwork"].front_default || '';
            return{ name: details.name, picture, id: details.id};
        });
        

       const uniquePokemon = await Promise.all(detailePokemonPromises);

            if (uniquePokemon.length < numberOfPairs) {
                // Fejlhåndtering hvis der ikke er nok unikke Pokémon
                throw new Error(`Not enough unique Pokémon found for limit ${gameLimit}. Found: ${uniquePokemon.length}.`);
            }

        const duplicatedCard : CardData[] = [];
        uniquePokemon.forEach((pokemon, index) =>{
            duplicatedCard.push({
            id: pokemon.id,
            name: pokemon.name,
            picture: pokemon.picture,
            isFlipped: false,
            isMatch: false,
            uniqueId: `${pokemon.id}-${pokemon.name}-a-${index}` 
            });
            duplicatedCard.push({
                id: pokemon.id,
                name: pokemon.name,
                picture: pokemon.picture,
                isFlipped: false,
                isMatch: false,
                uniqueId: `${pokemon.id}-${pokemon.name}-b-${index}`
            });
        });

         setCards(duplicatedCard.sort(() => Math.random() - 0.5));
        

    } catch (error) {

        console.error("Failed to prepare game cards", error);
        setError("Failed to load gam. please try agin later!")
        setCards([])
    }finally{
        setLoading(false)
    }
}, [gameLimit])

useEffect (() => {
    shuffleCards();
}, [shuffleCards]);

const restart = () => {
    setLockBoard(false);
    setFlippedCards([]);
    shuffleCards();
};

    // Håndtering af klik på kort
const handleCardClick = (clickedCard: CardData) => {
    if (lockBoard || clickedCard.isFlipped || clickedCard.isMatch) return;
    //vend kortet
    const updatedCards = cards.map(card => 
        card.uniqueId === clickedCard.uniqueId ? {...card, isFlipped: true} : card
    );
    setCards(updatedCards);
    setFlippedCards(prev =>[...prev, { ...clickedCard, isFlipped: true}]);
};


    useEffect (() => {
      if ( flippedCards.length === 2){
        setLockBoard(true);
        const [firstCard, secondCard] = flippedCards;


        if ( firstCard.id === secondCard.id){
            setCards(prevCards => 
                prevCards.map(card =>
                    card.id === firstCard.id ? {...card, isMatch: true, isFlipped: true} : card
                )
            );
            setFlippedCards([]);
            setLockBoard(false);
        }else{
            setTimeout(() => {
                setCards(prevCards =>
                    prevCards.map(card =>
                    (card.uniqueId === firstCard.uniqueId || card.uniqueId === secondCard.uniqueId)
                    ? {...card, isFlipped: false}
                    :card
                    )
                );
                setFlippedCards([])
                setLockBoard(false);
            }, 1000);
        }
      }

    },[flippedCards, cards]);

 if (loading) return <div>Loading Game...!</div>;
 if (error) return <div>Error: {error}</div>;

 


return(
   
     <GameContainer>
        <GridWrapper gridSize= {gridSize}>
            {cards.map((cardItem) =>(
                <MemoryCard
                key={cardItem.uniqueId}
                onClick={() => handleCardClick(cardItem)}
                isFlipped ={cardItem.isFlipped}
                isMatched = {cardItem.isMatch}
                >
               {cardItem.isFlipped ? (
                <PokemonCard name={cardItem.name} picture={cardItem.picture} />
               ):(
                <CardBack>
                       <Image
                   src={pokemonCardBack}
                   alt="Bagsiden af et pokemon kort"
                   width={40}
                   height={40}
                   >
                   </Image>
                </CardBack>
                
               )}
                </MemoryCard>
            ))}
            
        </GridWrapper>
        <button
               className="bg-slate-500 rounded-md p-5  m-4 cursor-pointer"
               onClick={restart}
               >
                Restart Game
               </button>
     </GameContainer>
)

}

const Breakpoints = {
    mobil: '768px'
    
};


const GameContainer = styled.div  `
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  max-width: 100vw;

`;
interface MemoryCardsPorps {
    isFlipped: boolean;
    isMatched: boolean;
}

const GridWrapper = styled.div<{gridSize:number}>`
 display: grid;
  grid-template-columns: repeat(${props => props.gridSize}, 1fr);
  gap: 9px;
  align-items: center;
  max-width: 100%;
  margin-top: 10px;
  color: black;

  @media (max-width: ${Breakpoints.mobil}){
  grid-template-columns: repeat(3, 2fr);
  max-width: 100vw;
  gap: 4px;
  }
`

// props =>: Dette er en JavaScript arrow-funktion, der modtager alle de "props", der sendes til MemoryCard-komponenten.
const MemoryCard = styled.div<MemoryCardsPorps>`
width: 130px;
height: 120px;
border: 2px solid #ccc;
border-radius: 8px;
display: flex;
justify-content: center;
align-items: center;
font-size: 2em;
cursor: pointer;
    background-color: ${props => props.isMatched ? '#e0ffe0' : '#f0f0f0'};
     transition: transform 0.6s, background-color 0.3s, opacity 0.3s;
     transform-style: preserve-3d;
    position: relative;
    opacity: ${props => props.isMatched ? 0.7 : 1};
    pointer-events: ${props => (props.isFlipped || props.isMatched) ? 'none' : 'auto'};
   
& > div {
position: absolute;
width: 100%;
height: 100%;
backface-visibility: hidden;
}
 
& > div:first-child:not{
position: absolute;
width: 100%;
height: 100%;
backface-visibility: hidden;
transform: rotateY(180deg);
}

`;

const CardBack = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #342F5D; 
  justify-content: center;
  position: relative;
  align-items: center;
   & > img { // Target billedet inde i CardBack
    max-width: 100%;
    height: auto;
    display: block; // Fjerner ekstra plads under billedet
  
`;