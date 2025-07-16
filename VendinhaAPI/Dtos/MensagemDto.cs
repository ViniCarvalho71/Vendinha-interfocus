namespace VendinhaAPI.Dtos;

public class RetornoDto<T>
{
    public List<T> dados { get; set; }
    public int quantidadeDeRegistros { get; set; }
}