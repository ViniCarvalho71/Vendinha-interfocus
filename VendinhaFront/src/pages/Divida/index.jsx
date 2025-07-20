import { FaPlus, FaExclamation } from "react-icons/fa";
import { useState, useEffect, useReducer} from "react";
import { listarDividas, salvarDivida, excluirDivida, totalDividas} from "../../services/dividaService";
import { todosOsClientes } from "../../services/clienteService";
import { realMask } from "../../utils/masks";
import LinhaDivida from "./components/linhaDivida";
import Modal from "../../components/Modal";

export default function DividaPage(){
    const [dividas, setDividas] = useState([]);
    const [search, setSearch] = useState();
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDeletar, setOpenDeletar] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openPagar, setOpenPagar] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [registros, setRegistros] = useState(0);
    const [valorDividas, setValorDividas] = useState(0);
    const [erros, setErros] = useState([]);
    const [valor, setValor] = useReducer(
        (oldValue, newValue) => {

            if (newValue) {
                
                return realMask(newValue);
            }

            return newValue?.toLowerCase();
        }, "R$ 00,00");

    const fetchData = async () => {
        const resultado = await listarDividas(search, page);
        if (resultado.status == 200) {
            setDividas(resultado.data.dados);
            setRegistros(resultado.data.quantidadeDeRegistros);
        }
    }

    const listarClientes = async () => {
        const resultado = await todosOsClientes();
        if (resultado.status == 200 ){
            setClientes(resultado.data.dados);
        }
    }

    const somaDividas = async () => {
        const resultado = await totalDividas();
        if (resultado.status == 200){
            setValorDividas(resultado.data);
        }
    }

    const abrirModalEdit = (divida) => {
        setSelected(divida);
        setValor(divida.valor);
        setOpen(true);
    }

    const abrirModalView = (divida) => {
        setSelected(divida);
        setOpenView(true);
    }

    const abrirModalDelete = (divida) => {
        setSelected(divida);
        setOpenDeletar(true);
    }

    const abrirModalPagar = (divida) => {
        setSelected(divida);
        setOpenPagar(true);
    }

    const excluirDividaPorId = async () => {
            const resultado = await excluirDivida(selected?.id);
            if (resultado.status == 200) {
                setSelected(null);
                setOpenDeletar(false);
            }
        }
    
    const pagar = (divida) => {
        divida.situacao = true;
        salvarDivida(divida);
        setSelected(null);
        setOpenPagar(false);
    }

    const submitForm = async (event) => {
            event.preventDefault();
    
            const form = event.target;
            const formData = new FormData(form);
            const divida = {
                valor: formData.get("valor").replace(/\s|R\$/g, '')    
                .replace(/\./g, '')         
                .replace(',', '.'),
                dataPagamento: formData.get("data_nascimento"),
                descricao: formData.get("descricao"),
                cliente: { id: formData.get("cliente") }
            };
            if (selected?.id) {
                divida.id = selected.id;
            }
            const resultado = await salvarDivida(divida);
            if (resultado.status == 200) {
                setOpen(false);
                fetchData();
            } else if (resultado.status == 422){
                    setErros(resultado.data);
            }
        }

        useEffect(() => {
            var timeout = setTimeout(() => {
                fetchData();
                somaDividas();
            }, 500);

        return () => {
            clearTimeout(timeout);
        }
        }, [search, openDeletar, page, valorDividas]);

        useEffect(() => {
            var timeout = setTimeout(() => {
                listarClientes();
            }, 200)
        
        return () => {
            clearTimeout(timeout)
        }
        }, [open])

        useEffect(() => {
            setErros([]);
        }, [open])
        
    return(
        <>
        <div className="tabela-container">
                <div className="tabela-header">
                <h1>Tabela de Dividas</h1>
                <div className="funcionalidades">
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
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Valor</th>
                            <th>Data Pagamento</th>
                            <th>Situação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dividas.map(divida =>
                                <LinhaDivida key={divida.id}
                                    divida={divida}
                                    excluir={() => abrirModalDelete(divida) }
                                    edit = {()=> abrirModalEdit(divida)}
                                    view = {()=> abrirModalView(divida)}
                                    pagar = {()=> abrirModalPagar(divida)}
                                    ></LinhaDivida>
                            )
                        }
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
                    <p>Total de dívidas: {realMask(valorDividas)} </p>
                </div>
                </div>
        
                <Modal open={open}>
                    <form method="post" onSubmit={submitForm}>
                        <ul className="erros">
                            {erros.map((erro, index) => (
                                <li className="erro" key={index}><FaExclamation/>{erro.mensagem}</li>
                            ))}
                        </ul>
                        <label>Cliente: </label>
                        <select
                            name="cliente"
                            value={selected?.cliente.id}
                            disabled={!!selected}>
                            {clientes.map(cliente => (
                            <option value={cliente.id} key={cliente.id}>
                                {cliente.nome}
                            </option>
                            ))}
                        </select>

                        {selected && (
                            <input type="hidden" name="cliente" value={selected.cliente.id} />
                        )}
                        <label>Valor: </label>
                        <input type="text" defaultValue={selected?.valor} value={valor} name="valor" disabled={selected?.situacao}
                        onKeyDown={(e) => {
                        if (e.key.length == 1 && !e.key.match(/\d/)) {
                            e.preventDefault();
                        }
                        }} 
                        onChange={(e) => setValor(realMask(e.target.value))}/>
                        <label>Data de Pagamento:</label>
                        <input type="date" defaultValue={selected?.dataPagamento
              ? new Date(selected.dataPagamento).toISOString().slice(0, 10)
              : ''} name="data_nascimento" disabled={selected?.situacao} />
                        <label>Descrição: </label>
                        <textarea name="descricao" id="" defaultValue={selected?.descricao} disabled={selected?.situacao}></textarea>
                        <div className="row">
                            <button type="reset" onClick={() => setOpen(false)}>Cancelar</button>
                            <button type="submit" disabled={selected?.situacao}>Enviar</button>
                        </div>
                    </form>
                </Modal>
                <Modal open={openView}>
                        <div className="modal-view modal-divida">
                            <div className="titulo">
                                <h1>Descrição da dívida</h1>
                            </div>
                            <p className="descricao">
                                {selected?.descricao}
                            </p>
                            <button type="reset" className="close-button-view" onClick={() => setOpenView(false)}>Fechar</button>
                        </div>
                </Modal>
                <Modal open={openDeletar}>
                        <div className="modal-deletar">
                            <h2>Deseja excluir a dívida?</h2>
                            <div className="row">
                                <button type="reset" onClick={() => setOpenDeletar(false)}>Cancelar</button>
                                <button type="submit" onClick={() => excluirDividaPorId()}>Excluir</button>
                            </div>
                        </div>
                </Modal>
                <Modal open={openPagar}>
                        <div className="modal-pagar">
                            <h2>Deseja pagar a dívida?</h2>
                            <div className="row">
                                <button type="reset" onClick={() => setOpenPagar(false)}>Cancelar</button>
                                <button type="submit" onClick={() => pagar(selected)}>Confirmar</button>
                            </div>
                        </div>
                </Modal>
        </>
    );
}
