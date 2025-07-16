import { FaTrashAlt, FaEye, FaEdit, FaRegCalendarPlus } from "react-icons/fa";

export default function LinhaCliente({cliente, excluir, edit, view, dividas}){
    const data = new Date(cliente.dataNascimento);
    const totalDividas = cliente.dividas
    .filter(divida => divida.situacao === false)
    .reduce((acc, divida) => acc + divida.valor, 0);

    return(
        <tr>
                    <td>{cliente.nome}</td>
                    <td>{cliente.cpf}</td>
                    <td>{data.toLocaleString().slice(0,10)}</td>
                    <td>{cliente.dividas.some(divida => divida.situacao === false) ? "Deve" : "Não Deve"}</td>
                    <td>R$ {totalDividas}</td>
                    <td className="actions">
                        <button className="visualizar" onClick={view}><FaEye className="action-icon" /></button>
                        <button className="editar"  onClick={edit}><FaEdit className="action-icon" /></button>
                        <button className="excluir" onClick={excluir}
                        ><FaTrashAlt className="action-icon" /></button>
                        <button className="divida" onClick={dividas}
                        ><FaRegCalendarPlus className="action-icon" /></button>
                    </td>
                </tr>
    );
}

