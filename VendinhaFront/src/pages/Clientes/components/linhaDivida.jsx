import { realMask } from "../../../utils/masks";

export default function LinhaDivida({divida}){

    const classeSituacao = divida.situacao ? "paga" : "aberta";
    return(
            <div className={`divida ${classeSituacao}`}>
                <div className="dados">
                    <p>ID: {divida.id}</p>
                    <p>Valor: {realMask(divida.valor)}</p>
                    <p>Data de Pagamento: {new Date(divida.dataPagamento).toLocaleString().slice(0,10)}</p>
                </div>
            </div>         
    );

    
}