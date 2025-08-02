using Application.Common;
using Application.Interfaces;
using Domain.User;
using System.Net;

namespace Application.Users
{
    public class AuthUserService
    {
        private readonly IUserManagerAdapter _userManager;
        private readonly IJwtCreator _jwtCreator;
        private readonly IEntityAdapter _entityAdapter;
        public AuthUserService(IUserManagerAdapter userManagerAdapter, IJwtCreator jwtCreator, IEntityAdapter entityAdapter)
        {
            _userManager = userManagerAdapter ?? throw new ArgumentNullException(nameof(userManagerAdapter));
            _jwtCreator = jwtCreator ?? throw new ArgumentNullException(nameof(jwtCreator));
            _entityAdapter = entityAdapter ?? throw new ArgumentNullException(nameof(entityAdapter));
        }
        public async Task<string> RegisterUserAsync(ApplicationUserDTO user)
        {

            var entity = await _entityAdapter.Create();
            if (entity.Id == 0)
                throw new ApiErrorException(HttpStatusCode.BadRequest, "ERROR_CREATE_ENTITY", "Error al crear entidad");

            user.EntityId = entity.Id;
            var (success, userCreateModel) = await _userManager.CreateUserAsyncUnfilter(user);
            if (!success)
                throw new ApiErrorException(HttpStatusCode.BadRequest, "ERROR_CREATE_USER", "Error al registrar el usuario");

            if (!await _userManager.RoleExistsAsync("superadmin"))
                await _userManager.CreateRoleAsync("superadmin");

            await _userManager.AssignRoleUnfilterAsync(user.Email, entity.Id, "superadmin");

            return await _jwtCreator.GetTokenAndId(user.Email, user.EntityId, 10);
        }

        public async Task<string> LoginUserAsync(string email, string password)
        {
            var user = await _userManager.GetUserByEmailAsync(email);
            if (!await _userManager.UserExistsAsync(email) || user == null)
                throw new ApiErrorException(HttpStatusCode.NotFound, "USER_NOT_FOUND", "user not found");

            var validPassword = await _userManager.ValidatePassword(email, password);
            if (!validPassword)
                throw new ApiErrorException(HttpStatusCode.Unauthorized, "INVALID_CREDENTIALS", "Invalid email or password");
            if (!user.IsActive || !user.IsEnabled || user.IsDeleted) 
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "USER_NOT_FOUND", "user not found");
            }
            return await _jwtCreator.GetTokenAndId(user);
        }
    }
}
