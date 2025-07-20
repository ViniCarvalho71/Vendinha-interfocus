const URL_API = "http://localhost:5230";

export function listarDividas(busca,page) {
    return fetch(`${URL_API}/api/divida?pesquisa=${busca || ""}&page=${page}`, {
        method: "GET"
    }).then(async resultado => {
        if (resultado.status === 200) {
            const data = await resultado.json();
            return {
                status: resultado.status,
                data: data
            }
        }
        return {
            status: resultado.status,
            data: null
        }
    })

}

export async function salvarDivida(divida) {
    const resultado = await fetch(`${URL_API}/api/divida`, {
        method: divida.id ? "PUT" : "POST",
        body: JSON.stringify(divida),
        headers: {
            "Content-type": "application/json"
        }
    });
    var dados = await resultado.json();
    return {
        status: resultado.status,
        data: dados
    }
}

export async function excluirDivida(id) {
    const resultado = await fetch(`${URL_API}/api/divida/${id}`, {
        method: "DELETE" 
    });
    return {
        status: resultado.status
    }
}

export async function totalDividas(){
    const resultado = await fetch(`${URL_API}/api/divida/totalDividas`, {
        method: "GET" 
    });
    return {
        data: await resultado.json(),
        status: resultado.status
    }
}



