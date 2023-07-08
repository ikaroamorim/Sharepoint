import * as spauth from "node-sp-auth"

export async function getSPAuth(siteUrl): Promise<spauth.IAuthResponse> {
   return spauth
       .getAuth(siteUrl, {
           clientId: `${process.env["CLIENT_ID"]}`,
           clientSecret: `${process.env["CLIENT_SECRET"]}`,
           realm: `${process.env["REALM"]}`
       })
}

