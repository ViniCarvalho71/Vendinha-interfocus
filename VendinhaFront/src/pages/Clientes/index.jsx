export function TabelaCliente(){

    return (
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Cpf</th>
                    <th>Data Nascimento</th>
                    <th>Situação</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Vinícius</td>
                    <td>158.058.898-38</td>
                    <td>00/00/00</td>
                    <td>Deve</td>
                </tr>
                <tr>
                    <td>Vinícius Carvalho da Silva</td>
                    <td>158.058.898-38</td>
                    <td>00/00/00</td>
                    <td>Deve</td>
                </tr>
                <tr>
                    <td>Vinícius Carvalho da Silva</td>
                    <td>158.058.898-38</td>
                    <td>00/00/00</td>
                    <td>Deve</td>
                </tr>
                <tr>
                    <td>Vinícius Carvalho da Silva</td>
                    <td>158.058.898-38</td>
                    <td>00/00/00</td>
                    <td>Deve</td>
                </tr>
            </tbody>
        </table>
    );
}

export default function ClientePage(){

    return (
        <>
        <h1>Tabela de Clientes</h1>
        <TabelaCliente></TabelaCliente>
        </>
    );
}

