using System.ComponentModel.DataAnnotations;
using VendinhaAPI.Enums;

namespace VendinhaAPI.Models;

public class Divida
{
    public long Id { get; set; }
    [Required]
    public decimal Valor { get; set; }
    public DateTime DataCriacao { get; private set; } = DateTime.Now;
    [Required]
    public DateTime DataPagamento { get; set; }
    [Required]
    public string Descricao { get; set; }
    [Required]
    public Situacao Situacao { get; set; }
    public Cliente Cliente { get; set; }
}