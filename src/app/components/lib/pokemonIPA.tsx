const POKEMON_API = "https://pokeapi.co/api/v2/";

export interface PokemonListItem {
  name: string;
  url: string; // URL til den individuelle Pokemons detaljer
}

// ---
// Nyt interface til det fulde svar fra getPokemonList API-kaldet
// Dette matcher den fulde struktur, som PokeAPI returnerer for lister
// ---
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[]; // Nu er 'results' et array af vores nye PokemonListItem
}

export async function getPokemonList(limit: number): Promise<PokemonListItem> {
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