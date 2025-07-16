import { FaTrashAlt, FaEye, FaEdit, FaCheck } from "react-icons/fa";

export default function LinhaDivida({divida, excluir, edit, view, pagar}){
    const data = new Date(divida.dataPagamento);
    return(
        <tr>
                    <td>{divida.cliente.nome}</td>
                    <td>{divida.valor}</td>
                    <td>{data.toLocaleString().slice(0,10)}</td>
                    <td>{divida.situacao ? "Paga" : "Aberta"}</td>
                    <td className="actions">
                        <button className="visualizar" onClick={view}><FaEye className="action-icon" /></button>
                        <button className="editar"  onClick={edit}><FaEdit className="action-icon" /></button>
                        <button className="excluir" onClick={excluir}
                        ><FaTrashAlt className="action-icon" /></button>
                        {!divida.situacao ? <button className="pagar" onClick={pagar}
                        ><FaCheck className="action-icon" /></button> : 
                        <button className="pago" disabled={divida.situacao} 
                        ><FaCheck className="action-icon" /></button>}
                    </td>
                </tr>
    );
}

