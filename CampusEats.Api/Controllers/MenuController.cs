using CampusEats.Api.Dtos;
using CampusEats.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CampusEats.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _svc;

    public MenuController(IMenuService svc)
    {
        _svc = svc;
    }


    [HttpGet]
    public ActionResult<IEnumerable<MenuItemDto>> GetAll()
    {
        return Ok(_svc.GetAll());
    }


    [HttpGet("{id}")]
    public ActionResult<MenuItemDto> GetById(int id)
    {
        var item = _svc.GetById(id);

        return item is null ? NotFound() : Ok(item);
    }


    [HttpPost]
    [Authorize(Roles = "Admin")] // create: Admins only
    public ActionResult<MenuItemDto> Create(
        [FromBody] CreateMenuItemDto dto)
    {
        var created = _svc.Create(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")] // update: Admins only
    public IActionResult Update(
        int id,
        [FromBody] CreateMenuItemDto dto)
    {
        return _svc.Update(id, dto)
            ? NoContent()
            : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // delete: Admins only
    public IActionResult Delete(int id)
    {
        return _svc.Delete(id)
            ? NoContent()
            : NotFound();
    }
}