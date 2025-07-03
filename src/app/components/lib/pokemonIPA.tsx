// components/lib/pokemonIPA.tsx

// interface PokemonDetails {
//   sprites: {
//     other: {
//       "official-artwork": {
//         front_default: string;
//       };
//     };
//   };
// }

const POKEMON_API = "https://pokeapi.co/api/v2/";
export async function getPokemonList(limit: number): Promise<any[]> {
  try {
    const response = await fetch(`${POKEMON_API}pokemon?limit=${limit}&offset=0`);
    if (!response.ok) {
      throw new Error("failed to fetch");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
  
}


export async function getPokemon(name: string): Promise<PokemonDetails> {
  try {
    const response = await fetch(POKEMON_API + "pokemon/" + name.toLowerCase()); 
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon ${name}. Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching Pokemon ${name}:`, error);
    throw error;
  }
}

export interface PokemonDetails {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: {
            "official-artwork": {
                front_default: string;
            };
        };
    };
    
}