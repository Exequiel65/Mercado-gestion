using Application.Common;
using Application.Users;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthUserService _registerUserService;
        public AuthController( AuthUserService registerUserService )
        {
            _registerUserService = registerUserService ?? throw new ArgumentNullException(nameof(registerUserService));
        }
        [HttpPost("register")]
        [Obsolete("This endpoint is deprecated. Use the new registration flow instead.")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto model)
        {
            try
            {
                var user = new Domain.User.ApplicationUserDTO
                {
                    Email = model.Email,
                    Name = model.Name,
                    Password = model.password,
                    IsActive = true,
                    IsEnabled = true
                };

                var token = await _registerUserService.RegisterUserAsync(user);
                return Ok(ApiResponse<string>.Ok(token));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto model)
        {

            var token = await _registerUserService.LoginUserAsync(model.Email, model.password);
            return Ok(ApiResponse<string>.Ok(token));

        }


        public record LoginUserDto(string Email, string password);

        public record RegisterUserDto(string Email, string Name, string password);
    }
}
