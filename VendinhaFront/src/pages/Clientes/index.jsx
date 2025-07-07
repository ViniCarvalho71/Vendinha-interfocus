import { FaPlus,FaTrashAlt, FaEye, FaEdit } from "react-icons/fa";
import { listarClientes, salvarCliente, excluirCliente} from "../../services/clienteService";
import Modal from "../../components/Modal";
import { useState, useEffect} from "react";



export function LinhaCliente({cliente, excluir, edit}){
    const data = new Date(cliente.dataNascimento);
    return(
        <tr>
                    <td>{cliente.nome}</td>
                    <td>{cliente.cpf}</td>
                    <td>{data.toLocaleString()}</td>
                    <td>{cliente.dividas.length === 0 ? "Não Deve" : "Deve"}</td>
                    <td className="actions">
                        <button className="visualizar" id={cliente.id}><FaEye className="action-icon" /></button>
                        <button className="editar" id={cliente.id} onClick={edit}><FaEdit className="action-icon" /></button>
                        <button className="excluir" id={cliente.id} onClick={excluir}
                        ><FaTrashAlt className="action-icon" /></button>
                    </td>
                </tr>
    );
}

export default function ClientePage(){

    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState();
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDeletar, setOpenDeletar] = useState(false);

    const fetchData = async () => {
        const resultado = await listarClientes(search, page);
        if (resultado.status == 200) {
            setClientes(resultado.data);
        }
    }

    const submitForm = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const cliente = {
            nome: formData.get("nome"),
            cpf: formData.get("cpf"),
            email: formData.get("email"),
            dataNascimento: formData.get("data_nascimento"),
            descricao: formData.get("descricao")
        };
        // falsey values: 0, null, undefined, "", false
        // not falsey values = TRUE
        if (selected?.id) {
            cliente.id = selected.id;
        }
        const resultado = await salvarCliente(cliente);
        if (resultado.status == 200) {
            setOpen(false);
            fetchData();
        }
    }
    useEffect(() => {
        var timeout = setTimeout(() => {
            fetchData();
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, [search, openDeletar]);

    const abrirModalDelete = (cliente) => {
        setSelected(cliente);
        setOpenDeletar(true);
    }

    const abrirModalEdit = (cliente) => {
        setSelected(cliente);
        setOpen(true);
    }

    const excluirClientePorId = async () => {
        const resultado = await excluirCliente(selected?.id);
        if (resultado.status == 200) {
            setSelected(null);
            setOpenDeletar(false);
        }
    }


    return (
        <>
        <div className="tabela-container">
        <div className="tabela-header">
        <input type="text" placeholder="Pesquisa"
                onChange={(e) =>
                    setSearch(e.target.value)
                }/>
        <button onClick={() => {setOpen(true); setSelected(null);}}><FaPlus/></button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Cpf</th>
                    <th>Data Nascimento</th>
                    <th>Situação</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {
                    clientes.map(cliente =>
                        <LinhaCliente key={cliente.id}
                            cliente={cliente}
                            excluir={() => abrirModalDelete(cliente) }
                            edit = {()=> abrirModalEdit(cliente)}
                            ></LinhaCliente>
                    )
                }
            </tbody>
        </table>
        <div className="tabela-footer">
            <div className="paginacao">
                <button>Anter.</button>
                <p>1 de 3</p>
                <button>Prox.</button>
            </div>
        </div>
        </div>

        <Modal open={open}>
            <form method="post" onSubmit={submitForm}>
                <input defaultValue={selected?.nome} id="cliente-nome" required minLength="10" maxLength="50" name="nome" type="text" placeholder="Nome" />
                <input type="text" defaultValue={selected?.cpf} name="cpf" placeholder="Cpf"/>
                <input type="email" defaultValue={selected?.email} name="email" placeholder="Email"/>
                <label>Data de Nascimento:</label>
                <input type="date" defaultValue={selected?.dataNascimento} name="data_nascimento" />
                <textarea defaultValue={selected?.descricao} required name="descricao" placeholder="Descrição"></textarea>
                <div className="row">
                    <button type="reset" onClick={() => setOpen(false)}>Cancelar</button>
                    <button type="submit">Cadastrar</button>
                </div>
            </form>
        </Modal>
                <Modal open={openDeletar}>
            <div className="modal-deletar">
                <p>Deseja excluir o cliente {selected?.nome}?</p>
                <div className="row">
                    <div className="row">
                            <button type="reset" onClick={() => setOpenDeletar(false)}>Cancelar</button>
                            <button type="submit" onClick={() => excluirClientePorId()}>Excluir</button>
                        </div>
                </div>
            </div>
        </Modal>
        
        </>
    );
}

