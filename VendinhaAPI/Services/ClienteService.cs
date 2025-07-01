using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using VendinhaAPI.Models;
using VendinhaAPI.Repository;

namespace VendinhaAPI.Services;

public class ClienteService
{
    private readonly IRepository repository;

    public ClienteService(IRepository repository)
    {
        this.repository = repository;
    }

    private bool ValidarCPF(string cpf)
    {
        string regex = @"^\d{3}\.\d{3}\.\d{3}-\d{2}$";
        bool formatoValido = Regex.IsMatch(cpf, regex);

        if (formatoValido)
        {
            var numeros = Regex.Replace(cpf, @"\D", "");
            if (numeros.Distinct().Count() == 1)
                return false;
            List<int> numerosCpf = numeros.Select(c => int.Parse(c.ToString())).ToList();
            List<int> novePrimeirosDigitos = numerosCpf.Take(9).ToList();
            List<int> dezPrimeirosDigitos = numerosCpf.Take(10).ToList();
            List<int> digitosVerificadores = numerosCpf.Skip(9).ToList();
            int contador = 10;
            int somaPrimeiroDigito= 0;
            foreach (var numero in novePrimeirosDigitos)
            {
                somaPrimeiroDigito += numero * contador;
                contador--;
            }
            int resto = somaPrimeiroDigito % 11;
            int primeiroDigito = resto < 2 ? 0 : 11 - resto;
            int somaSegundoDigito = 0;
            contador = 11;
            
            foreach (var numero in dezPrimeirosDigitos)
            {
                somaSegundoDigito += numero * contador;
                contador--;
            }
            resto = somaSegundoDigito % 11;
            int segundoDigito = resto < 2 ? 0 : 11 - resto;
            
            return digitosVerificadores[0] == primeiroDigito && digitosVerificadores[1] == segundoDigito;
        }

        return false;
    }
    public bool Validar(Cliente cliente, out List<MensagemErro> mensagens)
    {
        mensagens = new List<MensagemErro>();
        var validationContext = new ValidationContext(cliente);
        var erros = new List<ValidationResult>();
        var validation = Validator.TryValidateObject(cliente,
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

        if (!ValidarCPF(cliente.Cpf))
        {
            mensagens.Add(new MensagemErro("Cpf", "Digite um cpf válido"));
            validation = false;
        }
        
        var cpfJaExiste = repository.Consultar<Cliente>().Count(c => c.Cpf == cliente.Cpf && c.Id != cliente.Id);
        if (cpfJaExiste != 0)
        {
            mensagens.Add(new MensagemErro("Cpf", "Cpf já cadastrado"));
            validation = false;
        }
        
        var emailJaExiste = repository.Consultar<Cliente>().Count(c => c.Email == cliente.Email && c.Id != cliente.Id);
        if (emailJaExiste != 0)
        {
            mensagens.Add(new MensagemErro("Email", "Email já cadastrado"));
            validation = false;
        }
        return validation;
    }
        
    public bool Cadastrar(Cliente cliente, out List<MensagemErro> mensagens)
    {
        if (Validar(cliente, out mensagens))
        {
            try
            {
                using var transacao = repository.IniciarTransacao();
                repository.Incluir(cliente);
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
    public List<Cliente> Consultar(int page)
    {
        
        var resultado2 = repository
            .Consultar<Cliente>()
            .Skip(10 * (page - 1))
            .Take(10)
            .ToList();
        return resultado2;
    }
    
    public List<Cliente> Consultar(string pesquisa, int page)
    {
        
        var resultado2 = repository
            .Consultar<Cliente>()
            .Where(item => item.Nome.Contains(pesquisa) || 
                           item.Cpf.Contains(pesquisa) || 
                           item.Email.Contains(pesquisa))
            .OrderByDescending(item => item.Dividas.Sum(d => d.Valor))
            .Skip(10 * (page - 1))
            .Take(10)
            .ToList();
        return resultado2;
    }

    public Cliente ConsultarPorCodigo(long codigo)
    {
        return repository.ConsultarPorId<Cliente>(codigo);
    }
    
    public Cliente Editar(Cliente cliente, out List<MensagemErro> mensagens)
    {
        var existente = ConsultarPorCodigo(cliente.Id);

        if (existente == null)
        {
            mensagens = null;
            return null;
        }
        existente.Nome = cliente.Nome;
        existente.Email = cliente.Email;
        existente.Cpf = cliente.Cpf;
        existente.DataNascimento = cliente.DataNascimento;

        var valido = Validar(cliente, out mensagens);
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

    public Cliente Deletar(long codigo)
    {
        var existente = ConsultarPorCodigo(codigo);
        try
        {
            using var transacao = repository.IniciarTransacao();
            repository.Excluir(existente);
            repository.Commit();
            return existente;
        }
        catch (Exception)
        {
            repository.Rollback();
            return null;
        }
    }
    
    
}