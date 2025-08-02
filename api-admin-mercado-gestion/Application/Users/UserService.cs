using Application.Common;
using Application.Helpers;
using Application.Interfaces;
using Domain.User;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Application.Users
{
    public class UserService
    {
        private readonly IUserManagerAdapter _userManagerAdapter;
        private readonly IStorageService _storageService;
        private readonly IEntityAdapter _entityAdapter;
        private readonly IConfiguration _configuration;
        public UserService(IUserManagerAdapter userManagerAdapter, IStorageService storageService, IEntityAdapter entityAdapter, IConfiguration configuration)
        {
            _userManagerAdapter = userManagerAdapter ?? throw new ArgumentNullException(nameof(userManagerAdapter));
            _storageService = storageService ?? throw new ArgumentNullException(nameof(storageService));
            _entityAdapter = entityAdapter ?? throw new ArgumentNullException(nameof(entityAdapter));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(_configuration));
        }
        public async Task<bool> UserExistsAsync(string email)
        {
            return await _userManagerAdapter.UserExistsAsync(email);
        }
        public async Task<ApplicationUserDTO?> GetUserByEmailAsync(string email)
        {
            return await _userManagerAdapter.GetUserByEmailAsync(email);
        }
        public async Task<SimpleApplicationUserDTO?> GetUserByIdAsync(string userId, bool isAdmin = false)
        {
            var user = await _userManagerAdapter.GetUserByIdAsync<SimpleApplicationUserDTO>(userId);
            if ((user == null || !user.IsActive || !user.IsEnabled || user.IsDeleted) && !isAdmin)
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "USER_NOT_FOUND", "User not found or inactive.");

            return user;
        }

        public async Task<PaginationDTO<SimpleApplicationUserDTO>> GetAllUsersAsync(string userId, string? name, string?[] roles, bool? IsActive, int limit = 25, int skip = 0)
        {
            var user = await this.GetUser(userId);
            var roleHierarchy = user.Roles.OrderBy(x => x.Hierarchy).FirstOrDefault()?.Hierarchy ?? 0;
            return await _userManagerAdapter.GetAllUsersAsync(roleHierarchy, name, roles, IsActive, limit, skip);
        }

        public async Task<List<SimpleRoleReadDTO>> GetAllRoleAsync(string userId)
        {
            var user = await this.GetUser(userId);
            var roles = await _userManagerAdapter.GetAllRolesAsync(user.Roles.FirstOrDefault()?.Hierarchy);
            return roles;

        }

        public async Task<ApplicationUserDTO> AddUserAsync(string userId, CreateUserDTO userModel)
        {
            var user = await this.GetUser(userId);

            if (await _userManagerAdapter.UserExistsAsync(userModel.Email))
                throw new ApiErrorException(System.Net.HttpStatusCode.Conflict, "USER_ALREADY_EXISTS", "User with this email already exists.");

            if (!(await _userManagerAdapter.RoleExistsAsync(userModel.Roles.FirstOrDefault())))
                throw new ApiErrorException(System.Net.HttpStatusCode.BadRequest, "ROLES_NOT_PROVIDED", "At least one role must be provided.");
            var entityName = await _entityAdapter.GetEntityName();
            var endpoint = _configuration["StorageSettings:Cdn"]?.TrimEnd('/');
            var bucketName = _configuration["StorageSettings:BucketName"];
            var baseUrl = $"{endpoint}/{bucketName}";
            var image = await _storageService.ProcessImageUrl(baseUrl, userModel.Picture, entityName.Replace(" ", ""));
            var newUser = new ApplicationUserDTO
            {
                Email = userModel.Email,
                Name = userModel.Name,
                Picture = image,
                PhoneNumber = userModel.PhoneNumber,
                UserName = userModel.UserName,
                DateOfBirth = userModel.DateOfBirth,
                IsActive = true,
                IsEnabled = true,
                IsDeleted = false,
                Password = userModel.Password ?? PasswordGenerator.GenerateRandomPassword(6),
            };
            var result = await _userManagerAdapter.CreateUserAsync(newUser);

            if (!result.Succeeded)
                throw new ApiErrorException(System.Net.HttpStatusCode.BadRequest, "USER_CREATION_FAILED", string.Join(", ", result.Errors));

            await _userManagerAdapter.AssignRoleAsync(newUser.Email, userModel.Roles.FirstOrDefault());

            return result.user ?? new ApplicationUserDTO();
        }

        public async Task<ApplicationUserDTO> UpdateUserAsync(string userId, UpdateUserDTO userModel)
        {
            var updateUser = await _userManagerAdapter.GetUserByIdAsync<ApplicationUserDTO>(userModel.Id.ToString());
            var user = userId == userModel.Id ? updateUser : await this.GetUser(userId);

            if (updateUser is null || (userId == userModel.Id && (updateUser.IsDeleted || !updateUser.IsEnabled || !updateUser.IsActive)))
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "USER_NOT_FOUND", "User not found.");

            var isAdmin = user.Roles.Any(x => x.Name == "superadmin" || x.Name == "admin");

            var entityName = await _entityAdapter.GetEntityName();
            var endpoint = _configuration["StorageSettings:Cdn"]?.TrimEnd('/');
            var bucketName = _configuration["StorageSettings:BucketName"];
            var baseUrl = $"{endpoint}/{bucketName}";
            var image = await _storageService.ProcessImageUrl(baseUrl, userModel.Picture, entityName.Replace(" ", ""));

            updateUser.UpdatedDate = DateTime.UtcNow;

            //updateUser.Roles = user.Roles.Any(x => x.Name == "superadmin" || x.Name == "admin")
            updateUser.UserName = userModel.UserName?.Replace(" ", "") ?? updateUser.UserName;
            updateUser.Picture = image ?? updateUser.Picture;

            if (isAdmin)
            {
                if (userModel.IsActive.HasValue)
                    updateUser.IsActive = userModel.IsActive.Value;
                if (userModel.IsDeleted.HasValue)
                    updateUser.IsDeleted = userModel.IsDeleted.Value;
                if (userModel.IsEnabled.HasValue)
                    updateUser.IsEnabled = userModel.IsEnabled.Value;
                updateUser.Password = userModel.Password;

                if (updateUser.Roles.Select(x => x.Name).Any(x => x != userModel.Roles.FirstOrDefault()))
                {
                    var newRolName = userModel.Roles.FirstOrDefault();
                    var existNewRol = await _userManagerAdapter.RoleExistsAsync(newRolName);
                    if (!existNewRol)
                        throw new ApiErrorException(System.Net.HttpStatusCode.BadRequest, "ROLES_NOT_PROVIDED", "At least one role must be provided.");

                    await _userManagerAdapter.AssignRoleAsync(updateUser.Email, newRolName);
                }
            }
            else
            {
                userModel.Password = null;
            }

            var result = await _userManagerAdapter.UpdateUserAsync(updateUser);


            if (!result.Succeeded)
                throw new ApiErrorException(System.Net.HttpStatusCode.BadRequest, "USER_UPDATE_FAILED", string.Join(", ", result.Errors));
            return result.user;
        }

        private async Task<ApplicationUserDTO> GetUser(string userId)
        {
            var user = await _userManagerAdapter.GetUserByIdAsync<ApplicationUserDTO>(userId.ToString());
            if (user == null || !user.IsActive || !user.IsEnabled || user.IsDeleted)
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "USER_NOT_FOUND", "User not found or inactive.");
            return user;
        }

    }
}
