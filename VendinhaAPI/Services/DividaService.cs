using System.ComponentModel.DataAnnotations;
using VendinhaAPI.Dtos;
using VendinhaAPI.Models;
using VendinhaAPI.Repository;

namespace VendinhaAPI.Services;

public class DividaService
{
    private readonly IRepository repository;

    public DividaService(IRepository repository)
    {
        this.repository = repository;
    }

    private bool Validar(Divida divida, out List<MensagemErro> mensagens)
    {
        mensagens = new List<MensagemErro>();
        var validationContext = new ValidationContext(divida);
        var erros = new List<ValidationResult>();
        divida.Cliente = repository.ConsultarPorId<Cliente>(divida.Cliente.Id);
        var validation = Validator.TryValidateObject(divida,
            validationContext,
            erros,
            true);
        
        
        
        foreach (var erro in erros)
        {
            var mensagem = new MensagemErro(
                erro.MemberNames.First(),
                erro.ErrorMessage);

            mensagens.Add(mensagem);
            Console.WriteLine("{0}: {1}",
                erro.MemberNames.First(),
                erro.ErrorMessage);
        }
        
        if (divida.Cliente.Id <= 0)
        {
            mensagens.Add(new MensagemErro("Cliente", "Cliente inválido ou não informado."));
            validation = false;
        }
        
        
        var totalDividas = repository.Consultar<Divida>()
            .Where(d => d.Cliente.Id == divida.Cliente.Id 
                        && divida.Id != d.Id
                        && d.Situacao == false)
            .Select(d => (decimal?)d.Valor)
            .Sum() ?? 0;
        
        if (divida.DataPagamento.Date <= DateTime.Today)
        {
            mensagens.Add(new MensagemErro("DataPagamento", "A data de pagamento deve ser pelo menos um dia após a data atual."));
            validation = false;
        }

        
        if (totalDividas + divida.Valor > 200)
        {
            mensagens.Add(new MensagemErro("Valor", "A soma das dívidas não pode ultrapassar R$ 200."));
            validation = false;
        }
        
       
        return validation;
        
    }

    public bool Cadastrar(Divida divida, out List<MensagemErro> mensagens)
    {
        if (Validar(divida, out mensagens))
        {
            try
            {
                divida.Situacao = false;
                using var transacao = repository.IniciarTransacao();
                repository.Incluir(divida);
                repository.Commit();
                return true;

            }
            catch (Exception)
            {
                repository.Rollback();
                return false;
            }
        }

        return false;
    }
    
    public RetornoDto<Divida> Consultar(int page)
    {
        
        var resultado = repository
            .Consultar<Divida>()
            .OrderByDescending(d =>  d.Valor)
            .Skip(10 * (page - 1))
            .Take(10)
            .ToList();
        
        var retorno = new RetornoDto<Divida>()
        {
            dados = resultado,
            quantidadeDeRegistros = repository
                .Consultar<Divida>().Count()
        };
        
        return retorno;
    }
    
    public RetornoDto<Divida> Consultar(string pesquisa, int page)
    {
        
        var resultado = repository
            .Consultar<Divida>()
            .Where(item => 
                           item.Valor.ToString() == pesquisa ||
                           item.Cliente.Nome.Contains(pesquisa)
                           )
            .OrderByDescending(d => d.Valor)
            .Skip(10 * (page - 1))
            .Take(10)
            .ToList();
        
        var retorno = new RetornoDto<Divida>()
        {
            dados = resultado,
            quantidadeDeRegistros = repository
                .Consultar<Divida>().Count()
        };
        
        return retorno;
    }

    public Divida ConsultarPorCodigo(long codigo)
    {
        return repository.ConsultarPorId<Divida>(codigo);
    }
    
    public Divida Editar(Divida divida, out List<MensagemErro> mensagens)
    {
        var existente = ConsultarPorCodigo(divida.Id);

        if (existente == null)
        {
            mensagens = null;
            return null;
        }
        existente.Valor = divida.Valor;
        existente.DataPagamento = divida.DataPagamento;
        existente.Descricao = divida.Descricao;
        existente.Situacao = divida.Situacao;

        var valido = Validar(divida,out mensagens);
        if (valido)
        {
            try
            {
                using var transacao = repository.IniciarTransacao();
                repository.Salvar(existente);
                repository.Commit();
                return existente;
            }
            catch (Exception)
            {
                repository.Rollback();
                return null;
            }
        }
        return null;

    }

    public decimal TotalDividas()
    {
        return repository.Consultar<Divida>().Where(d => d.Situacao == false).Sum(d => d.Valor ?? 0);
    }
    
    public Divida Deletar(long codigo)
    {
        var existente = ConsultarPorCodigo(codigo);
        try
        {
            using var transacao = repository.IniciarTransacao();

            repository.Excluir(existente);
            repository.Commit();
            return existente;
        }
        catch (Exception ex)
        {
            repository.Rollback();
            Console.WriteLine($"Erro ao deletar dívida: {ex.Message}");
            return null;
        }
    }
    

}