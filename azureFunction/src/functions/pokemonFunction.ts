import { app, InvocationContext, Timer } from "@azure/functions";

import {
    getPokemons,
    getPokemonDetail, /*getPokemonImages*/
    formatPokemonDetail
} from "./apiFunctions";

import { getArrayOfItemNumbers, getSPAuth, getSPItems } from "./spFunctions";

export async function pokemonFunction(myTimer: Timer, context: InvocationContext): Promise<void> {
    const authHeaders = await getSPAuth(`${process.env["SITEURL"]}`)

    const pokemonList = await getPokemons()
    
    const siteItems = await getSPItems(`${process.env["SITEURL"]}`, `${process.env["LISTGUID"]}`, authHeaders.headers)

    const siteItemsPkmnNumbers = getArrayOfItemNumbers(siteItems)

    console.log({ siteItemsPkmnNumbers})

    pokemonList.results.forEach(async pokemonItem => {
        const pkmnDetail = formatPokemonDetail(await getPokemonDetail(pokemonItem.url))

        siteItemsPkmnNumbers.indexOf( pkmnDetail.Numero)

        console.log({
            //pokemonDetail: pkmnDetail,
            existe: siteItemsPkmnNumbers.indexOf( pkmnDetail.Numero)
        })
    });



}

app.timer('pokemonFunction', {
    schedule: '0 * * * * *',
    handler: pokemonFunction
});
