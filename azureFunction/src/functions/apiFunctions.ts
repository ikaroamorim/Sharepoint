import * as fs from "fs"
import { Stream } from "node:stream"

export interface IPokemonResponse {
   count: Number,
   next?: String,
   previous?: String,
   results: [
      {
         name: String,
         url: URL
      }
   ]
}

export interface IPokemonDetailResponse {
   id: Number,
   name: String,
   height: Number,
   weight: Number,
   sprites: {
      "front_default"?: URL,
      other: {
         home?: {
            "front_default"?: URL
         },
         "official-artwork"?: {
            "front_default"?: URL
         }
      }
   },
   stats: [
      {
         "base_stat": Number,
         stat: {
            name: String,
            url: URL
         }
      }
   ],
   types: [
      {
         slot: number,
         type: {
            name: String,
            url: URL
         }
      }
   ]
}

export interface IPokemonFormated{
   Numero: Number,
   Altura: Number,
   Peso: Number,
   Estatisticas: String,
   Tipos: String
}

export async function getPokemons(): Promise<IPokemonResponse> {

   return fetch(`${process.env["POKEMON_LIST"]}`, {
      method: "GET",
   }).then(response => response.json())

}

export async function getPokemonDetail(url: URL): Promise<IPokemonDetailResponse> {
   
   return fetch(url, {
      method: "GET",
   }).then(response => response.json())
   
}

export function formatPokemonDetail( pokemonDetail: IPokemonDetailResponse): IPokemonFormated{

   return {
      Numero: pokemonDetail.id,
      Altura: pokemonDetail.height,
      Peso: pokemonDetail.weight,
      Estatisticas: pokemonDetail.stats.reduce( ( acc, curr) => acc + ` ${curr.stat.name}:${curr.base_stat}; `, ''),
      Tipos: pokemonDetail.types.reduce( ( acc, curr) => acc + `${curr.type.name}; `, '' )
   }
}
/*
export async function getPokemonImages(pokemonDetail: IPokemonDetailResponse) {

   const file = fs.createWriteStream(`/images/${pokemonDetail.name}.png`) // createWriteStream()

   const imageAddress = pokemonDetail.sprites.other["official-artwork"].front_default || pokemonDetail.sprites.other.home.front_default || pokemonDetail.sprites.front_default

   
   return fetch(imageAddress).then(response => Stream.Readable.fromWeb( response.body ).pipe(file))
 

}
*/