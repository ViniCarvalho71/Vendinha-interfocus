export default function LinhaDivida({divida}){
    return(
            <div className="divida">
                <div className="dados">
                    <p>ID: {divida.id}</p>
                    <p>Valor: R$ {divida.valor}</p>
                    <p>Data de Pagamento: {new Date(divida.dataPagamento).toLocaleString().slice(0,10)}</p>
                </div>
            </div>         
    );

    
}