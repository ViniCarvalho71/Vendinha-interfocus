using System.ComponentModel.DataAnnotations;

namespace VendinhaAPI.Models;

public class Divida
{
    public long Id { get; set; }
    [Required]
    public decimal Valor { get; set; }
    public DateTime DataCriacao { get; private set; } = DateTime.Now;
    public DateTime DataPagamento { get; set; }
    [Required]
    public string Descricao { get; set; }
    [Required]
    public bool Situacao { get; set; }
    public Cliente Cliente { get; set; }
}