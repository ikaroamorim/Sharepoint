import * as spauth from 'node-sp-auth'
import * as rp from 'request-promise'

export async function getSPAuth(siteUrl): Promise<spauth.IAuthResponse> {
    return spauth
        .getAuth(siteUrl, {
            clientId: `${process.env["CLIENT_ID"]}`,
            clientSecret: `${process.env["CLIENT_SECRET"]}`,
            realm: `${process.env["REALM"]}`
        })
}

export async function getFormDigest(siteUrl, headers) {

    return fetch(
        siteUrl + '_api/contextinfo', {
        method: "POST",
        headers: headers,
        body: JSON.stringify('{}')
    })
        .then(response => response.json())
        .then(json => json?.d?.GetContextWebInformation?.FormDigestValue)
}

export async function getSPItems(siteUrl, listGuid, headers) {

    headers.Accept = "application/json;odata=verbose"

    return fetch(
        `${siteUrl}/_api/web/lists(guid'${listGuid}')/items`, {
        method: 'GET',
        headers: headers,
    })
        .then(response => response.json())
        .then(json => {
            if (json?.d?.results) {
                return json.d.results
            } else {
                return []
            }
        })

    /*const options: rp.OptionsWithUri  = {
        uri: `${siteUrl}/_api/web/lists(guid'${listGuid}')/items`,
        headers: headers,
        json: true
    }

    return rp.get(options)
        .then(response => response.d.results)
        .catch(err => console.error('getSPItemsPaginated' + err.message))
        */

}

export async function getSPItemsPaginated(siteUrl, listDispName, headers, idiomaId) {
    const responseObj = {}
    let next = true
    let urlConsulta = `${siteUrl}/_api/web/lists/GetByTitle('${listDispName}')/items?$top=5000`

    do {
        let consultaAtual = await rp.get({
            url: urlConsulta,
            headers: headers,
            json: true
        }).catch(err => console.error('getSPItemsPaginated' + err.message))


        for (const item of consultaAtual.d.results) {
            if (item['IdiomaId'] == idiomaId) {
                responseObj[`${item['SAP_CM']}${item['SAP_CT']}${item['SAP_SI']}${item['SAP_DS']}`] = {
                    ID: item.ID,
                    CM: item['SAP_CM'],
                    CT: item['SAP_CT'],
                    SI: item['SAP_SI'],
                    DS: item['SAP_DS'],
                    CMCT: `${item['SAP_CM']}${item['SAP_CT']}`,
                    IdiomaId: item['IdiomaId']
                }
            }
        }

        urlConsulta = consultaAtual.d.__next

        if (!consultaAtual.d.__next) {
            next = false
        }

    }
    while (next)

    return responseObj
}

export async function uploadFile(config, headers, siteUrl, fileString) {
    const startDate = new Date()
    const fileName = `${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, '0')}${startDate.getDate().toString().padStart(2, '0')}-${config.siglaBanco}-${config.Title}.json`
    const url = `${siteUrl}_api/web/GetFolderByServerRelativeUrl('AppArquivosIntegracao/')/Files/add(url='${fileName}', overwrite=true)`;

    //const file = await fs.writeFile(fileName, fileString, (err) => { console.log })

    return fetch(
        url, {
        method: "POST",
        headers: headers,
        body: fileString // file //
    })
        .then(response => response.json())
        .catch(e => console.error('upload file error' + e.message))
}

export async function updateFileUploaded(uploadResponse, formDigest, headers, estrutura, idiomaId) {
    const headersUpdate = Object.assign({}, headers)
    headersUpdate['X-HTTP-Method'] = "MERGE"
    headersUpdate['Accept'] = "application/json;odata=verbose"
    headersUpdate['Content-Type'] = "application/json;odata=verbose"
    headersUpdate['X-RequestDigest'] = formDigest
    headersUpdate['If-Match'] = "*"

    return rp
        .get({
            url: `${uploadResponse.d.ListItemAllFields['__deferred'].uri}`,
            headers: headers,
            json: true
        })
        .then(data => {
            const requestBodyUpdate = JSON.stringify({
                "__metadata": { "type": data.d['__metadata'].type },
                "Estrutura": estrutura,
                "IdiomaId": idiomaId
            })

            headersUpdate['content-length'] = (new TextEncoder().encode(requestBodyUpdate)).length

            return fetch(
                data.d['__metadata'].uri, {
                method: "POST",
                headers: headersUpdate,
                body: requestBodyUpdate,
            })
                .then(response => response.status)
        })
        .catch(err => console.error("Erro updateFileUploaded " + err.message))
}

export async function recordLog(siteUrl, listDispName, headers, title, detalhes, idioma, estrutura, context) {
    const headersLog = Object.assign({}, headers)
    headersLog['Accept'] = "application/json;odata=verbose"
    headersLog['Content-Type'] = "application/json;odata=verbose"
    headersLog['X-RequestDigest'] = await getFormDigest(siteUrl, headers)

    rp
        .get({
            url: `${siteUrl}_api/web/lists/GetByTitle('${encodeURIComponent(listDispName)}')?$select=ListItemEntityTypeFullName`,
            headers: headers,
            json: true
        })
        .then(data => {


            const requestLogBody = JSON.stringify({
                "__metadata": { "type": data.d.ListItemEntityTypeFullName },
                "Title": title,
                "Detalhes": detalhes,
                "Idioma": idioma,
                "Estrutura": estrutura
            })

            headersLog['Content-Length'] = (new TextEncoder().encode(requestLogBody)).length

            return fetch(`${siteUrl}_api/web/lists/GetByTitle('${encodeURIComponent(listDispName)}')/items`, {
                method: "POST",
                headers: headersLog,
                body: requestLogBody
            })
                .then(response => {
                    console.log({ response })
                    return response.status
                })
        })
        .catch(err => context.log(err.message))
}