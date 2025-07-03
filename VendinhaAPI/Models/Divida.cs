using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using VendinhaAPI.Interfaces;

namespace VendinhaAPI.Models;

public class Divida : IEntidade
{
    public long Id { get; set; }
    [Required]
    public decimal? Valor { get; set; }
    public DateTime DataCriacao { get; private set; } = DateTime.Now;
    public DateTime DataPagamento { get; set; }
    [Required]
    public string Descricao { get; set; }
    [Required]
    public bool Situacao { get; set; }
    [Required]
    public Cliente Cliente { get; set; }
}