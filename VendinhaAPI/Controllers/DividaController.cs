using Microsoft.AspNetCore.Mvc;
using VendinhaAPI.Models;
using VendinhaAPI.Services;

namespace VendinhaAPI.Controllers;

[Route("api/divida")]
public class DividaController : ControllerBase
{
    private readonly DividaService servico;

    public DividaController(DividaService servico)
    {
        this.servico = servico;
    }
    
    [HttpPost]
    public IActionResult Post([FromBody] Divida divida)
    {

        if (servico.Cadastrar(divida, out List<MensagemErro> erros))
        {
            return Ok(divida);
        }
        return UnprocessableEntity(erros);
    }

    [HttpGet]
    public IActionResult Get(string pesquisa, int page = 0)
    {
        return string.IsNullOrEmpty(pesquisa) ? 
            Ok(servico.Consultar(page)) :
            Ok(servico.Consultar(pesquisa, page));
    }

    [HttpPut]
    public IActionResult Put([FromBody] Divida divida)
    {
        var resultado = servico.Editar(divida,out List<MensagemErro> erros);
        if (resultado == null)
        {
            return UnprocessableEntity(erros);;
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

    [HttpGet("totalDividas")]
    public IActionResult TotalDividas()
    {
        var resultado = servico.TotalDividas();
        return Ok(resultado);
    }
}