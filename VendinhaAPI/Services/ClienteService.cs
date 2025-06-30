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
        
    public bool Cadastrar(Cliente aluno)
    {

        try
        {
            using var transacao = repository.IniciarTransacao();
            repository.Incluir(aluno);
            repository.Commit();
            return true;
        }
        catch (Exception)
        {
            repository.Rollback();
            return false;
        }
    

    }
}