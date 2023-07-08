import { app, InvocationContext, Timer } from "@azure/functions";

import { getPokemons } from "./apiFunctions";
import { getSPAuth } from "./spFunctions";





export async function pokemonFunction(myTimer: Timer, context: InvocationContext): Promise<void> {
    const authHeaders = await getSPAuth(`${process.env["SITEURL"]}`)

    const pokemonList = await getPokemons()

    


    console.log( pokemonList.results );

}

app.timer('pokemonFunction', {
    schedule: '0 * * * * *',
    handler: pokemonFunction
});
