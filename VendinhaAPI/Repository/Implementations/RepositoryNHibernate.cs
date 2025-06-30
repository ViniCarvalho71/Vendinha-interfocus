using NHibernate;
using ISession = NHibernate.ISession;


namespace VendinhaAPI.Repository.Implementations;

public class RepositoryNHibernate : IRepository
{
    private readonly ISessionFactory sessionFactory;
    private readonly ISession session;

    public RepositoryNHibernate(ISessionFactory sessionFactory)
    {
        this.sessionFactory = sessionFactory;
        this.session = sessionFactory.OpenSession();
    }
    public void Incluir(object model)
    {
        session.Save(model);
    }

    public void Salvar(object model)
    {
        session.Merge(model);
    }

    public void Excluir(object model)
    {
        session.Delete(model);
    }

    public T ConsultarPorId<T>(long id)
    {
        return session.Get<T>(id);
    }

    public IQueryable<T> Consultar<T>()
    {
        return session.Query<T>();
    }

    public IDisposable IniciarTransacao()
    {
        var transaction = session.BeginTransaction();
        return transaction;
    }

    public void Commit()
    {
        session.GetCurrentTransaction().Commit();
    }

    public void Rollback()
    {
        session.GetCurrentTransaction()?.Rollback();
    }
}