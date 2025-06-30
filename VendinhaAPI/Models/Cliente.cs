using System.ComponentModel.DataAnnotations;
using VendinhaAPI.Interfaces;


namespace VendinhaAPI.Models;

public class Cliente : IEntidade
{
    public long Id { get; set; }
    [Required]
    [StringLength(100)]
    public string Nome { get; set; }
    [Required]
    [StringLength(14)]
    public string Cpf { get; set; }
    [EmailAddress]
    [StringLength(254)]
    public string Email { get; set; }
    [Required]
    public DateTime? DataNascimento { get; set; }
    
    public List<Divida> Dividas { get; set; }

    public int Idade { get
    {
        if (!DataNascimento.HasValue)
        {
            return 0;
        }
        var anoAtual = DateTime.Today.Year;
        var idade = anoAtual - DataNascimento.Value.Year;
        var aniversario = DateTime.Today.AddYears(-idade);
        if (DataNascimento > aniversario) idade--;
        return idade;
    } }
    
}