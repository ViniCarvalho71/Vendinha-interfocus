import { FaPlus,FaTrashAlt, FaEye, FaEdit, FaDollarSign,FaSearch } from "react-icons/fa";
import { listarClientes, salvarCliente, excluirCliente} from "../../services/clienteService";
import Modal from "../../components/Modal";
import { useState, useEffect} from "react";



export function LinhaCliente({cliente, excluir, edit, view, dividas}){
    const data = new Date(cliente.dataNascimento);
    return(
        <tr>
                    <td>{cliente.nome}</td>
                    <td>{cliente.cpf}</td>
                    <td>{data.toLocaleString().slice(0,10)}</td>
                    <td>{cliente.dividas.length === 0 ? "Não Deve" : "Deve"}</td>
                    <td className="actions">
                        <button className="visualizar" onClick={view}><FaEye className="action-icon" /></button>
                        <button className="editar"  onClick={edit}><FaEdit className="action-icon" /></button>
                        <button className="excluir" onClick={excluir}
                        ><FaTrashAlt className="action-icon" /></button>
                        <button className="divida" onClick={dividas}
                        ><FaDollarSign className="action-icon" /></button>
                    </td>
                </tr>
    );
}

export function LinhaDivida({divida}){
    return(
        <>
        <p>Dívida: {divida.id}</p>
        <p>Valor: {divida.valor}</p>
        <p>Data de Pagamento: {new Date(divida.dataPagamento).toLocaleString().slice(0,10)}</p>
        </>
    );

    
}

export default function ClientePage(){

    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState();
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDeletar, setOpenDeletar] = useState(false);
    const [openView, setOpenView] = useState(false);

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
        }, 500);

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

    const abrirModalView = (cliente) => {
        setSelected(cliente)
        setOpenView(true)
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
        <input type="text" placeholder="Pesquisar"
                onChange={(e) =>
                    setSearch(e.target.value)
                }/>
        <button onClick={() => {setOpen(true);
        setSelected(null); 
        }}>
            <FaPlus/>
        </button>
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
                            view = {()=> abrirModalView(cliente)}
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
                <input type="date" defaultValue={selected?.dataNascimento
      ? new Date(selected.dataNascimento).toISOString().slice(0, 10)
      : ''} name="data_nascimento" />
                <div className="row">
                    <button type="reset" onClick={() => setOpen(false)}>Cancelar</button>
                    <button type="submit">Enviar</button>
                </div>
            </form>
        </Modal>

        <Modal open={openDeletar}>
            <div className="modal-deletar">
                <p>Deseja excluir o cliente {selected?.nome}?</p>
                <div className="row">
                            <button type="reset" onClick={() => setOpenDeletar(false)}>Cancelar</button>
                            <button type="submit" onClick={() => excluirClientePorId()}>Excluir</button>
                </div>
            </div>
        </Modal>

        <Modal open={openView}>
            <div className="modal-view">
                <div className="dados">
                    <p>Cliente: {selected?.nome}</p>
                    <p>Cpf: {selected?.cpf}</p>
                    <p>Email: {selected?.email}</p>
                    <p>Data de Nascimento: </p>
                    <p>Idade: {selected?.idade}</p>
                </div>
                <div className="dividas">
                    {
                        selected?.dividas.map(divida => 
                            <LinhaDivida key={divida.id} divida={divida}></LinhaDivida>
                        )
                    }
                </div>
                <div className="row">
                    <button type="reset" onClick={() => setOpenView(false)}>Fechar</button>
                </div>
            </div>
        </Modal>

        
        
        </>
    );
}

