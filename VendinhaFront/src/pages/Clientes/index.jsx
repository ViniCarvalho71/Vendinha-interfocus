import { FaPlus} from "react-icons/fa";
import { listarClientes, salvarCliente, excluirCliente} from "../../services/clienteService";
import { salvarDivida} from "../../services/dividaService";
import Modal from "../../components/Modal";
import  LinhaCliente  from "./components/linhaCliente"
import  LinhaDivida  from "./components/linhaDivida"
import { useState, useEffect} from "react";


export default function ClientePage(){

    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState();
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDeletar, setOpenDeletar] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDivida, setOpenDivida] = useState(false);
    const [filtro, setFiltro] = useState(null);
    const [registros, setRegistros] = useState(0);

    const fetchData = async () => {
        const resultado = await listarClientes(search, page);
        if (resultado.status == 200) {
            setClientes(resultado.data.dados);
            setRegistros(resultado.data.quantidadeDeRegistros);
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
            dataNascimento: formData.get("data_nascimento")
        };
        if (selected?.id) {
            cliente.id = selected.id;
        }
        const resultado = await salvarCliente(cliente);
        if (resultado.status == 200) {
            setOpen(false);
            fetchData();
        }
    }

     const submitFormDivida = async (event) => {
                event.preventDefault();
        
                const form = event.target;
                const formData = new FormData(form);
        
                const divida = {
                    valor: formData.get("valor"),
                    dataPagamento: formData.get("data_nascimento"),
                    descricao: formData.get("descricao"),
                    cliente: { id: formData.get("cliente") }
                };
                const resultado = await salvarDivida(divida);
                if (resultado.status == 200) {
                    setOpenDivida(false);
                    fetchData();
                }
            }
    
    useEffect(() => {
        var timeout = setTimeout(() => {
            fetchData();
        }, 200);

        return () => {
            clearTimeout(timeout);
        }
    }, [search, openDeletar, page]);

    const abrirModalDelete = (cliente) => {
        setSelected(cliente);
        setOpenDeletar(true);
    }

    const abrirModalEdit = (cliente) => {
        setSelected(cliente);
        setOpen(true);
    }

    const abrirModalView = (cliente) => {
        setSelected(cliente);
        setOpenView(true);
    }

    const abrirModalDivida = (cliente) => {
        setSelected(cliente);
        setOpenDivida(true);
    }
    const excluirClientePorId = async () => {
        const resultado = await excluirCliente(selected?.id);
        if (resultado.status == 200) {
            setSelected(null);
            setOpenDeletar(false);
        }
    }

    const totalGeral = clientes.reduce((total, cliente) => {
        const totalCliente = cliente.dividas
        .filter(divida => divida.situacao === false)
        .reduce((soma, divida) => soma + divida.valor, 0);
            return total + totalCliente;
    }, 0);


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
                    <th>Dividas</th>
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
                            dividas = {()=> abrirModalDivida(cliente)}
                            ></LinhaCliente>
                    )
                }
                <tr><td>Divida total: R$ {totalGeral}</td></tr>
            </tbody>
        </table>
        <div className="tabela-footer">
            <div className="paginacao">
                <button onClick={ () => setPage(page - 1)}
                    disabled={page === 1}>Anter.</button>
                <p>{page} de { Math.ceil(registros / 10) }</p>
                <button onClick={ () => setPage(page + 1)} 
                    disabled={page === Math.ceil(registros / 10)}>Prox.
                </button>
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
                <h2>Deseja excluir o cliente {selected?.nome}?</h2>
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
                <h2>Dívidas:</h2>
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

        <Modal open={openDivida}>
            <form method="post" onSubmit={submitFormDivida}>
                <div className="titulo">
                    <h2>Cadastrar nova dívida para o cliente:
                    </h2>
                    <h2>
                        {selected?.nome.toUpperCase()}
                    </h2>
                </div>
                <input type="hidden" name="cliente" value={selected?.id} />
                <label>Valor: </label>
                <input type="text" defaultValue={selected?.valor} name="valor"  placeholder="R$ 00,0"/>
                <label>Data de Pagamento:</label>
                <input type="date" defaultValue={selected?.dataPagamento
        ? new Date(selected.dataPagamento).toISOString().slice(0, 10)
        : ''} name="data_nascimento"  />
                <label>Descrição: </label>
                <textarea name="descricao" id="" defaultValue={selected?.descricao} ></textarea>
                <div className="row">
                    <button type="reset" onClick={() => setOpenDivida(false)}>Cancelar</button>
                    <button type="submit" >Enviar</button>
                </div>
            </form>
        </Modal>

        
        
        </>
    );
}

