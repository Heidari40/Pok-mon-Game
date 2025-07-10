'use client'

import styled from "@emotion/styled";
import Link from "next/link";
import SettinsButton from "@/app/components/statsSetting/SettingsButton";
import { useState } from "react";

export default function SettingsPage() { // Brug PascalCase for komponentnavne
    const [selectedGameLimit, setSelctedGameLimit] = useState(20);
    const [numPlayers, setNumPlayers] = useState<1 | 2>(1);

    const handleNumPlyersChange = (player: 1 | 2) => {
        setNumPlayers(player)
    }

    const handleLimitChange = (limit: number) =>{
        setSelctedGameLimit(limit)
    } 

    const handleStartNewGame = () => {
      // Konstruer URL'en her for at logge den præcist
        const gameUrl = `/pokemon-games/PokemonPlayerPage?limit=${selectedGameLimit}&players=${numPlayers}`;
        console.log(`DEBUG: Starter nyt spil med URL: ${gameUrl}`);
        // Du kan også logge de individuelle værdier for at dobbelttjekke
        console.log(`DEBUG: Valgt limit: ${selectedGameLimit}, Valgt antal spillere: ${numPlayers}`);
        // Link komponenten håndterer navigationen, så du behøver ikke router.push her.
    }
    return (
        <Wrapper>
            <Row>
                <Title>
                    Settings
                </Title>
            </Row>

            <Row>
                <Text>
                   Difficulty
                </Text>
                
            </Row>

            <Row>
                
                <SettinsButton 
                 onClick={() => handleLimitChange(20)}
                 isActive={selectedGameLimit === 20}
                >
                    Easy
                </SettinsButton>
          
             
                <SettinsButton
                onClick={() => handleLimitChange(40)}
                isActive = {selectedGameLimit === 40} 
                >
                    Hard
                </SettinsButton>

                <SettinsButton
                onClick={() => handleLimitChange(60)}
                isActive = {selectedGameLimit === 60}
                >
                    Max
                </SettinsButton>
            </Row>

            <Row>
                <Text>
                       Number of Players
                </Text>
            </Row>
            <Row>
            <SettinsButton
             onClick={() => handleNumPlyersChange(1)}
             isActive={numPlayers === 1}
            >
                1
            </SettinsButton>
            <SettinsButton
            onClick={() => handleNumPlyersChange(2)}
            isActive={numPlayers === 2}
            >
                2
            </SettinsButton>
            </Row>
            <Row>
                <InfoLabel>
                    <Link 
                    href={`/pokemon-games/PokemonPlayerPage?limit=${selectedGameLimit}&players=${numPlayers} `} // Link til roden af din applikation
                    className="cursor-pointer"
                    onClick={handleStartNewGame}
                >
                 Start new game
                    
                </Link>
                </InfoLabel>
               </Row>
               <Row>
                  <InfoLabel>
                    <Link
                    href="/pokemon-games/PokemonPlayerPage" // Link til roden af din applikation
                    className="cursor-pointer"
                >
                  Back to Play
                    
                </Link>
                </InfoLabel>
               </Row>
               
        </Wrapper>
    )
}

const Wrapper = styled.section`
width: 100%;
max-width: 500px;
margin: 10px auto; /* Centrerer wrapperen */
padding: 10px;
display: flex;
flex-direction: column;
background-color: #333; /* Eksempel: En baggrund for settings-siden */
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

const Row = styled.div`
display: flex;
gap: 10px;
margin-bottom: 10px;
padding: 4px;

@media (max-width: 600px){
    flex-direction: column;
}
`;

const Title = styled.p`
font-size: 24px; /* Lidt større titel */
margin: 0;
font-weight: bold;
color: #FFFF; /* Gør titlen hvid, da baggrunden er mørk */
`;

const Text = styled.p`
font-size: 19px;
margin: 0;
font-weight: bold;
color: #808080; 
`

const InfoLabel = styled.div`
font-size: 16px;
margin: 0;
font-weight: bold; 
color: #EEC272; 
`;