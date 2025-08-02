using Application.Common;
using Application.Home;
using Domain.Home;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "CanViewCommerce")]
    public class HomeController : ControllerBase
    {
        private readonly HomeService _homeService;
        public HomeController( HomeService homeService )
        {
            _homeService = homeService;
        }


        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var result = await _homeService.GetHomeDataAsync();
            if (result == null)
            {
                throw new ApiErrorException(System.Net.HttpStatusCode.BadRequest, "ERROR", "Error to get data");
            }

            return Ok(ApiResponse<HomeReadDTO>.Ok(result));
        }

    }
}
