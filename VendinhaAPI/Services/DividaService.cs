using System.ComponentModel.DataAnnotations;
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
        
        if (divida.Cliente == null || divida.Cliente.Id <= 0)
        {
            mensagens.Add(new MensagemErro("Cliente", "Cliente inválido ou não informado."));
            return false;
        }
        
        
        var totalDividas = repository.Consultar<Divida>()
            .Where(d => d.Cliente.Id == divida.Cliente.Id)
            .Select(d => (decimal?)d.Valor)
            .Sum() ?? 0;
        
        if (totalDividas + divida.Valor > 200)
        {
            mensagens.Add(new MensagemErro("Valor", "A soma das dívidas não pode ultrapassar R$ 200."));
            return false;
        }
        
        return validation;
        
    }

    public bool Cadastrar(Divida divida, out List<MensagemErro> mensagens)
    {
        if (Validar(divida, out mensagens))
        {
            try
            {
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
    
    public List<Divida> Consultar(int page)
    {
        
        var resultado2 = repository
            .Consultar<Divida>()
            .Skip(10 * (page - 1))
            .Take(10)
            .ToList();
        
        return resultado2;
    }
    
    public List<Divida> Consultar(string pesquisa, int page)
    {
        
        var resultado2 = repository
            .Consultar<Divida>()
            .Where(item => 
                           item.Valor.ToString() == pesquisa ||
                           item.Cliente.Nome.Contains(pesquisa)
                           )
            .Skip(10 * (page - 1))
            .Take(10)
            .ToList();
        return resultado2;
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