import { FaPlus,FaTrashAlt, FaEye, FaEdit, FaDollarSign } from "react-icons/fa";
import { useState, useEffect} from "react";
import Modal from "../../components/Modal";

export default function DividaPage(){
    const [clientes, setClientes] = useState([]);
        const [search, setSearch] = useState();
        const [page, setPage] = useState(1);
        const [selected, setSelected] = useState(null);
        const [open, setOpen] = useState(false);
        const [openDeletar, setOpenDeletar] = useState(false);
        const [openView, setOpenView] = useState(false);

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

    return(
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
                            <th>ID</th>
                            <th>Valor</th>
                            <th>Data Pagamento</th>
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
        </>
    );
}
