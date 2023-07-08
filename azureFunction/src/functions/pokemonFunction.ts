import { app, InvocationContext, Timer } from "@azure/functions";

import {
    getPokemons, 
    getPokemonDetail, /*getPokemonImages*/
    formatPokemonDetail
} from "./apiFunctions";

import { getSPAuth } from "./spFunctions";





export async function pokemonFunction(myTimer: Timer, context: InvocationContext): Promise<void> {
    const authHeaders = await getSPAuth(`${process.env["SITEURL"]}`)

    const pokemonList = await getPokemons()

    pokemonList.results.forEach(async pokemonItem => {
        const pkmnDetail = formatPokemonDetail(await getPokemonDetail(pokemonItem.url))

        console.log(pkmnDetail)

        //console.log( await getPokemonImages(pkmnDetail))
    });





}

app.timer('pokemonFunction', {
    schedule: '0 * * * * *',
    handler: pokemonFunction
});
