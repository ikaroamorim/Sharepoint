import { Url } from "url"

export interface IPokemonResponse {
   count: Number,
   next?: String,
   previous?: String,
   results: [
      {
         name: String,
         url: Url
      }
   ]
}

export async function getPokemons(): Promise<IPokemonResponse> {

   return fetch(`${process.env["POKEMON_LIST"]}`, {
      method: "GET",
   }).then( response => response.json())
   
}