using Application.Common;
using Application.Interfaces;
using Domain.Entity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebController : ControllerBase
    {
        private readonly IEntityAdapter _entityAdapter;
        public WebController(IEntityAdapter entityAdapter)
        {
            _entityAdapter = entityAdapter ?? throw new ArgumentNullException(nameof(entityAdapter));
        }
        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
       
        {
            var response = await _entityAdapter.GetEntityByIdAsync();

            return Ok(ApiResponse<EntityDTO>.Ok(response));
        }
    }
}
