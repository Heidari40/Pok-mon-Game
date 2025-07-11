import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto]
     items-center justify-items-left min-h-screen p-10 pb-20 gap-10
      sm:p-20 font-[family-name:var(--font-geist-sans)]
      @max (width: )
      ">
      <div className="flex flex-row  items-center gap-5  text-2xl">
           <Image
          className="dark:invert "
          src="/AT-arcane.png"
          alt="Next.js logo"
          width={50}
          height={40}
          priority
        /> ArcaneTouch

        </div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center  justify-items-center">

        <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#a3a3a3] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href = "/pokemon-games/PokemonPlayerPage"
            >
               <Image
              className="dark:invert"
              src="/game-pad.png"
              alt="Vercel logomark"
              width={33}
              height={20}
            />
             Pokemon game
            </Link>

          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#272727] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://pokemon-api-two-steel.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Info Pokemon
          </a>
        </div>
      </main>
    </div>
  );
}


