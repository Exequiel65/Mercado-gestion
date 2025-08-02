using Application.Common;
using Application.Users;
using Domain.User;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IValidator<CreateUserDTO> _createUserValidator;
        private readonly IValidator<UpdateUserDTO> _updateUserValidator;
        public UserController(UserService userService, IValidator<CreateUserDTO> createUserValidator, IValidator<UpdateUserDTO> updateUserValidator)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _createUserValidator = createUserValidator ?? throw new ArgumentNullException(nameof(createUserValidator));
            _updateUserValidator = updateUserValidator;
        }

        [HttpGet()]
        public async Task<IActionResult> GetUserAuthenticated()
        {
            var id = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(id))
            {
                throw new ApiErrorException(404, "BAD_REQUEST", "bad request");
            }
            var exists = await _userService.GetUserByIdAsync(id);
            return Ok(ApiResponse<SimpleApplicationUserDTO>.Ok(exists));
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "SameUserOrAdmin")]
        public async Task<IActionResult> GetUserByIdAsync(string id)
        {
            var roles = this.GetValue(ClaimTypes.Role);
            var isAdmin = roles == "admin" || roles == "superadmin";
            var exists = await _userService.GetUserByIdAsync(id, isAdmin);
            return Ok(ApiResponse<SimpleApplicationUserDTO>.Ok(exists));
        }

        [HttpGet("list")]
        [Authorize(Policy = "CanManageUsers")]
        public async Task<IActionResult> GetAllUsersAsync([FromQuery] string? name, string? roles, bool? IsActive, int limit, int skip)
        {
            var id = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(id))
            {
                throw new ApiErrorException(404, "BAD_REQUEST", "bad request");
            }
            var exists = await _userService.GetAllUsersAsync(id, name, !roles.IsNullOrEmpty() ? new List<string>(){ roles}.ToArray() : null, IsActive, limit, skip);
            return Ok(ApiResponse<PaginationDTO<SimpleApplicationUserDTO>>.Ok(exists));
        }

        [HttpGet("roles")]
        [Authorize(Policy = "CanManageUsers")]
        public async Task<IActionResult> GetAllRolesAsync()
        {
            var id = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(id))
            {
                throw new ApiErrorException(404, "BAD_REQUEST", "bad request");
            }
            var exists = await _userService.GetAllRoleAsync(id);
            return Ok(ApiResponse<List<SimpleRoleReadDTO>>.Ok(exists));
        }

        [HttpPost]
        [Authorize(Policy = "CanManageUsers")]
        public async Task<IActionResult> AddUserAsync([FromBody] CreateUserDTO userModel)
        {
            if (userModel == null)
            {
                throw new ApiErrorException(404, "BAD_REQUEST", "bad request");
            }
            var id = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(id))
            {
                throw new ApiErrorException(404, "BAD_REQUEST", "bad request");
            }

            ValidationResult validation = _createUserValidator.Validate(userModel);
            if (!validation.IsValid)
            {
                return BadRequest(ApiResponse<List<FluentValidation.Results.ValidationFailure>>.Fail(validation.Errors, "Bad request"));
            }
            var exists = await _userService.AddUserAsync(id, userModel);
            return Ok(ApiResponse<ApplicationUserDTO>.Ok(exists));
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "SameUserOrAdmin")]
        public async Task<IActionResult> UpdateUserAsync([FromBody] UpdateUserDTO userModel, [FromRoute(Name = "id")] string userId)
        {
            if (userModel == null)
            {
                throw new ApiErrorException(404, "BAD_REQUEST", "bad request");
            }
            ValidationResult validation = _updateUserValidator.Validate(userModel);
            if (!validation.IsValid)
            {
                return BadRequest(ApiResponse<List<FluentValidation.Results.ValidationFailure>>.Fail(validation.Errors, "Bad request"));
            }
            var id = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(id))
            {
                throw new ApiErrorException(404, "BAD_REQUEST", "bad request");
            }
            var result = await _userService.UpdateUserAsync(id, userModel);
            return Ok(ApiResponse<ApplicationUserDTO>.Ok(result));
        }

        private string GetValue(string claim, string defaultValue = "") =>
           User.Claims
               .FirstOrDefault(x => x.Type.Equals(claim, StringComparison.OrdinalIgnoreCase))
               ?.Value ??
           defaultValue;
    }
}
