'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { getPokemonList, getPokemon, PokemonDetails, PokemonListItem } from "./lib/pokemonApi";
import styled from "@emotion/styled";
import { PokemonCard } from "./ui/pokemonCards";
import pokemonCardBack from './ui/pik/pikachu_528098.png'
import Image from "next/image";
import MemoryGameTimer, { TimerHandles } from "./gameTimer";
import StatPlayer from "./ui/playerChange";

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
    initialNumPlayers: 1 | 2;
}

export function PokemonGame({ gameLimit, gridSize, initialNumPlayers }: PokemonGameProps) {
    // State for antal spillere og aktuelle spiller
    const [numPlayers, setNumberPlayers] = useState<1 | 2>(initialNumPlayers);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [playerScores, setPlayerScores] = useState<number[]>(Array(numPlayers).fill(0));

    // State for kort og spil-tilstand
    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedCards, setFlippedCards] = useState<CardData[]>([]);
    const [lockBoard, setLockBoard] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [gameStarted, setGamStarted] = useState(false);
    const [matchedPairCount, setMatchedPairCount] = useState(0);
    const totalPairs = gameLimit / 2;
    const [moves, setMoves] = useState(0);

    // Ref til din timer-komponent
    const timerRef = useRef<TimerHandles>(null);

    // Funktion til at hente og blande kort
    const shuffleCards = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const numberOfPairs = gameLimit / 2;
            const basicPokemonList: PokemonListItem[] = await getPokemonList(numberOfPairs);
          
            const detailePokemonPromises = basicPokemonList.map(async (e) => {
                const details: PokemonDetails = await getPokemon(e.name);
                const picture = details.sprites.other["official-artwork"].front_default || '';
                return { name: details.name, picture, id: details.id };
            });

            const uniquePokemon = await Promise.all(detailePokemonPromises);

            if (uniquePokemon.length < numberOfPairs) {
                throw new Error(`Not enough unique Pokémon found for limit ${gameLimit}. Found: ${uniquePokemon.length}.`);
            }

            const duplicatedCard: CardData[] = [];
            uniquePokemon.forEach((pokemon, index) => {
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
            setError("Failed to load game. Please try again later!");
            setCards([]);
        } finally {
            setLoading(false);
        }
    }, [gameLimit]);

    // Funktion til at initialisere/nulstille hele spillet
    const initializeGame = useCallback(async () => {
        setGamStarted(false);
        setFlippedCards([]);
        setLockBoard(false);
        setMatchedPairCount(0);
        setCurrentPlayer(1);
        // Brug den aktuelle numPlayers state til at initialisere scores
        setPlayerScores(Array(numPlayers).fill(0));
        setMoves(0);

        if (timerRef.current) {
            timerRef.current.resetTimer();
        }
        await shuffleCards();

    }, [shuffleCards, numPlayers]); // numPlayers er en afhængighed her
        
    useEffect(() => {
        // Opdater numPlayers state baseret på den nye prop
        setNumberPlayers(initialNumPlayers);
        // Nulstil spillets tilstand, da vi potentielt starter et "nyt" spil
        // med et nyt antal spillere
        // setCurrentPlayer(1);
        setPlayerScores(Array(initialNumPlayers).fill(0)); // Brug initialNumPlayers her for at sikre korrekt størrelse
        // Kald initializeGame for at hente kort osv.
        initializeGame();
    }, [initialNumPlayers, initializeGame]); // initialNumPlayers og initializeGame er dependencies

    const restart = () => {
        // Nulstil spillet fuldstændigt ved at kalde initializeGame
        // Dette vil også trigge useEffect ovenfor, hvis initialNumPlayers ikke er ændret
        // Men det vil sikre, at spillet starter forfra med aktuelle indstillinger.
        initializeGame();
    };

    // Håndtering af klik på kort
    const handleCardClick = (clickedCard: CardData) => {
        if (lockBoard || clickedCard.isFlipped || clickedCard.isMatch) return;

        if (!gameStarted) {
            setGamStarted(true);
        }
        setMoves(prev => prev + 1);

        const updatedCards = cards.map(card =>
            card.uniqueId === clickedCard.uniqueId ? { ...card, isFlipped: true } : card
        );
        setCards(updatedCards);
        setFlippedCards(prev => [...prev, { ...clickedCard, isFlipped: true }]);
    };

    // Styrer timeren baseret på gameStarted state
    useEffect(() => {
        if (gameStarted) {
            if (timerRef.current) {
                timerRef.current.startTimer();
            }
        } else {
            if (timerRef.current) {
                timerRef.current.resetTimer();
            }
        }
    }, [gameStarted]);

    // Logik for at tjekke for match efter to kort er vendt
    useEffect(() => {
        if (flippedCards.length === 2) {
            console.log("To kort vendt:", flippedCards);
            setLockBoard(true);
            const [firstCard, secondCard] = flippedCards;

            if (firstCard.id === secondCard.id) {
                console.log("MATCH! Spiller", currentPlayer, "fortsætter.");
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.id === firstCard.id ? { ...card, isMatch: true, isFlipped: true } : card
                    )
                );

                setFlippedCards([]);
                setLockBoard(false);
                setMatchedPairCount(prevCount => prevCount + 1);

                setPlayerScores(prevScores => {
                    const newScores = [...prevScores];
                    newScores[currentPlayer - 1]++;
                    return newScores;
                });
            } else {
                console.log("INTET MATCH! Kort vendes tilbage om 1 sekund.");
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            (card.uniqueId === firstCard.uniqueId || card.uniqueId === secondCard.uniqueId)
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    setFlippedCards([]);
                    setLockBoard(false);
                    // Brug den aktuelle numPlayers state for at afgøre tur-skifte
                    if (numPlayers > 1) {
                        setCurrentPlayer(prevPlayer => {
                            const nextPlayer = (prevPlayer === 1 ? 2 : 1);
                            console.log("Skifter spiller fra", prevPlayer, "til", nextPlayer);
                            return nextPlayer;
                        });
                    } else {
                        console.log("Kun én spiller, skifter ikke tur.");
                    }

                }, 1000);
            }
        }
    }, [flippedCards, cards, currentPlayer, numPlayers]); // numPlayers er en afhængighed

    // Logik for spilafslutning
    useEffect(() => {
        if (gameStarted && matchedPairCount > 0 && matchedPairCount === totalPairs) {
            if (timerRef.current) {
                timerRef.current.stopTimer();
                alert(`Game finished! Time: ${timerRef.current.getFormattedTime()}`);
            }
        }
    }, [matchedPairCount, totalPairs, gameStarted]);

    if (loading) return <div>Loading Game...!</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <GameContainer>
            <StatPlayer
                numberOfPlayers={numPlayers} // Sender den korrekte, opdaterede numPlayers state
                time={timerRef.current?.getFormattedTime?.() || "00:00"}
                moves={moves}
                currentPlayers={currentPlayer}
                firstPlayerScore={playerScores[0]}
                secondPlayerScore={numPlayers > 1 ? playerScores[1] : 0}
            />
            <div style={{ display: "none" }}>
                <MemoryGameTimer ref={timerRef} />
            </div>

            <GridWrapper gridSize={gridSize}>
                {cards.map((cardItem) => (
                    <MemoryCard
                        key={cardItem.uniqueId}
                        onClick={() => handleCardClick(cardItem)}
                        isFlipped={cardItem.isFlipped}
                        isMatched={cardItem.isMatch}
                    >
                        {cardItem.isFlipped ? (
                            <PokemonCard name={cardItem.name} picture={cardItem.picture} />
                        ) : (
                            <CardBack>
                                <Image
                                    src={pokemonCardBack}
                                    alt="Bagsiden af et pokemon kort"
                                    width={40}
                                    height={40}
                                />
                            </CardBack>
                        )}
                    </MemoryCard>
                ))}
            </GridWrapper>
            <button
                className="bg-slate-500 rounded-md p-5 m-4 cursor-pointer"
                onClick={restart}
            >
                Restart Game
            </button>
        </GameContainer>
    );
}

// --- Styled Components ---
const Breakpoints = {
    mobil: '768px'
};

const GameContainer = styled.div`
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

const GridWrapper = styled.div<{ gridSize: number }>`
    display: grid;
    grid-template-columns: repeat(${props => props.gridSize}, 1fr);
    gap: 9px;
    align-items: center;
    max-width: 100%;
    margin-top: 10px;
    color: black;

    @media (max-width: 1024px){
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    max-width: 100vw;
    }

    @media (max-width: ${Breakpoints.mobil}) {
        grid-template-columns: repeat(3, 1fr);
        align-items: center;
        max-width: 90vw;
        gap: 4px;
    }
`;

const MemoryCard = styled.div<MemoryCardsPorps>`
    width: 120px;
    height: 120px;
    border: 2px solid #ccc;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    cursor: pointer; /* Rettet: fra 'ponter' til 'pointer' */
    background-color: ${props => props.isMatched ? '#e0ffe0' : '#f0f0f0'};
    transition: transform 0.6s, background-color 0.3s, opacity 0.3s;
    transform-style: preserve-3d;
    position: relative;
    opacity: ${props => props.isMatched ? 0.7 : 1};
    pointer-events: ${props => (props.isFlipped || props.isMatched) ? 'none' : 'auto'};
`;

const CardBack = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #342F5D;
    justify-content: center;
    position: relative;
    align-items: center;
    & > img { /* Target billedet inde i CardBack */
        max-width: 100%;
        height: auto;
        display: block; /* Fjerner ekstra plads under billedet */
    } /* Rettet: Manglende lukkende krølleparentes her */
`;