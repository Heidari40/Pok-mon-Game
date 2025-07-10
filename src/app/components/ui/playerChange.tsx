'use client'


import React from "react";
import styled from "@emotion/styled";
// import MemoryGameTimer, {TimerHandles}from "../gameTimer";
// import { PokemonGame } from "../generte-pic";

interface ChengPlayer {
    numberOfPlayers: 1 | 2;
    time: string;
    moves: number;
    currentPlayers: 1 | 2;
    firstPlayerScore: number;
    secondPlayerScore: number;
}


const StatPlayer : React.FC<ChengPlayer> = ({
    numberOfPlayers,
    time,
    moves,
    currentPlayers,
    firstPlayerScore,
    secondPlayerScore,

}: ChengPlayer) => {
    const isFirstPlayerActive = currentPlayers === 1;
    const isSecondPlayerActive  = currentPlayers === 2;

    return numberOfPlayers === 1 ? (

        <Wrapper numberOfPlayers={numberOfPlayers}>
            <StatBox>
                <SpaceAroundWrapper>
                   <span style={{color: "#6790a0"}}>Time</span>
                 <span style={{fontSize: "16px"}}>{time}</span>
                </SpaceAroundWrapper>
            </StatBox>

            <StatBox>
                <SpaceAroundWrapper>
                    <span style={{color : "#6790a0"}}>Moves</span>
                    <span style={{fontSize : "16px"}}>{moves}</span>
                </SpaceAroundWrapper>
            </StatBox>
        </Wrapper>
       

    ):(
        <Wrapper numberOfPlayers={numberOfPlayers}>

        <PlayerStatWrapper>
            <ArrowUp isActive={isFirstPlayerActive}/>
            <StatBox isActive={isFirstPlayerActive}>
                <div>
                    <div>Player 1</div>
                    <div style={{fontSize : "16px", fontWeight: "normal", textAlign:"center"}}>
                        score: {firstPlayerScore}
                    </div>
                </div>
            </StatBox>
        </PlayerStatWrapper>

         <PlayerStatWrapper>
            <ArrowUp isActive={isSecondPlayerActive }/>
            <StatBox isActive={isSecondPlayerActive }>
                <div>
                    <div>Player 2</div>
                    <div style={{fontSize : "16px", fontWeight: "normal", textAlign:"center"}}>
                        score: {secondPlayerScore}
                    </div>
                </div>
            </StatBox>
        </PlayerStatWrapper>

        </Wrapper>
    );
}

export default StatPlayer;

const Wrapper = styled.div<{numberOfPlayers: 1 | 2}>`
width: 100%;
max-width: 700px;
display: flex;
justify-content: center;
margin: 10px;
padding: 10px;
gap: 10px;

@media (max-width: 600px) {
 flex-direction: ${({numberOfPlayers}) => (numberOfPlayers === 1 ? "column" : "row")};
}
`

const StatBox = styled.div<{isActive?: boolean}>`
display: flex;
justify-content: center;
align-items: center;
width: 100%;
height: 65px;
border-radius: 12px;
padding: 5px;
font-size: 18px;
font-weight: bold;
color: ${({isActive}) => (isActive ? "white" : "#31485a")};
 background-color: ${({isActive}) => (isActive ? "#BFA100" : "#dfe6ec")};
`
const SpaceAroundWrapper = styled.div`
display: flex;
justify-content: space-around;
align-items: center;
width: 100%;
`

const ArrowUp = styled.div<{isActive? : boolean}>`
width: 0;
height: 0;
margin: 5px;
border-left: 16px solid transparent;
border-right: 16px solid transparent;
border-top: 16px solid ${({isActive}) => (isActive ? "red" : "transparent")};

`;

const PlayerStatWrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
width: 100%;
max-width: 200px;
`
