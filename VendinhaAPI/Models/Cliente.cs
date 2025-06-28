using System.ComponentModel.DataAnnotations;


namespace VendinhaAPI.Models;

public class Cliente
{
    public long Id { get; set; }
    [Required]
    public string Nome { get; set; }
    [Required]
    public string Cpf { get; set; }
    public string Email { get; set; }
    [Required]
    public DateTime? DataNascimento { get; set; }

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