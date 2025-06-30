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

        if (servico.Cadastrar(cliente))
        {
            return Ok(cliente);
        }
        return BadRequest();
    }

}