'use client';
// Define the interface for the Pokemon data that this component expects as props
interface PokemonCardProps {
  name: string;    // The name of the Pokémon
  picture: string; // The URL of the Pokémon's image
}

/**
 * PokemonCard component displays a single Pokémon with its image and name.
 * It's designed to be used within a grid or list of Pokémon.
 *
 * @param {PokemonCardProps} { name, picture } - Props containing the Pokémon's name and image URL.
 * @returns JSX.Element - A card displaying the Pokémon.
 */
export function PokemonCard({ name, picture }: PokemonCardProps) {
  return (
    // The main container for the Pokémon card
    <div
      className="
        transition-colors flex flex-col items-center justify-center 
        hover:bg-[#f2f2f2] dark:hover:bg-[#272727]
        hover:border-transparent font-medium text-sm sm:text-base
        shadow-sm hover:shadow-md
      "
      key={name + "-card"} // Unique key for list rendering, using name is more reliable
    >
      {/* Display the Pokémon's image */}
      {picture ? (
        <img
          src={picture}
          alt={name}
          className="w-15px h-15px sm:w-17 sm:h-17 object-contain mb-2"
          // Add an onerror fallback for broken images, though not strictly necessary with pokeapi
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/100x100/CCCCCC/000000?text=No+Image`;
          }}
        />
      ) : (
        // Placeholder if no picture URL is provided
        <div className="w-24 h-24 sm:w-22 sm:h-22 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
          <span className="text-gray-500 text-xs">No Image</span>
        </div>
      )}

      {/* Display the Pokémon's name, capitalized */}
      <span className="text-center font-bold text-lg">
        {name.charAt(0).toUpperCase() + name.slice(0)}
      </span>
    </div>
  );
}
