using Microsoft.AspNetCore.Mvc;
using VendinhaAPI.Models;
using VendinhaAPI.Services;

namespace VendinhaAPI.Controllers;


[Route("api/cliente")]
public class ClienteController : ControllerBase
{
    private readonly ClienteService servico;

    public ClienteController(ClienteService servico)
    {
        this.servico = servico;
    }
    
    [HttpPost]
    public IActionResult Post([FromBody] Cliente cliente)
    {

        if (servico.Cadastrar(cliente, out List<MensagemErro> erros))
        {
            return Ok(cliente);
        }
        return UnprocessableEntity(erros);
    }

    [HttpGet]
    public IActionResult Get(string pesquisa, int page)
    {
        return string.IsNullOrEmpty(pesquisa) ? 
            Ok(servico.Consultar(page)) :
            Ok(servico.Consultar(pesquisa, page));
    }

    [HttpPut]
    public IActionResult Put([FromBody] Cliente cliente)
    {
        var resultado = servico.Editar(cliente,out _);
        if (resultado == null)
        {
            return NotFound();
        }
        return Ok(resultado);
    }
    [HttpDelete("{codigo}")]
    public IActionResult Delete(long codigo)
    {
        var resultado = servico.Deletar(codigo);
        if (resultado == null)
        {
            return NotFound();
        }
        return Ok(resultado);
    }
}