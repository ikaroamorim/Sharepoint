import { app, InvocationContext, Timer } from "@azure/functions";

export async function pokemonFunction(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');
}

app.timer('pokemonFunction', {
    schedule: '0 */5 * * * *',
    handler: pokemonFunction
});
