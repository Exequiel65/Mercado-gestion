
using Application.Common;
using Domain.User;


namespace Application.Interfaces
{
    public interface IUserManagerAdapter
    {
        Task<bool> UserExistsAsync(string email);
        Task<(bool Succeeded, IEnumerable<string> Errors, ApplicationUserDTO? user)> CreateUserAsync(ApplicationUserDTO user);
        Task<(bool Succeeded, ApplicationUserDTO? user)> CreateUserAsyncUnfilter(ApplicationUserDTO user);
        Task<(bool Succeeded, IEnumerable<string> Errors, ApplicationUserDTO? user)> UpdateUserAsync(ApplicationUserDTO user);
        Task<bool> RoleExistsAsync(string roleName);
        Task CreateRoleAsync(string roleName);
        Task AssignRoleAsync(string email, string roleName);
        Task AssignRoleUnfilterAsync(string email, int entityId, string roleName);
        Task<ApplicationUserDTO?> GetUserByEmailAsync(string email);
        Task<bool>ValidatePassword (string email, string password);
        Task<T?> GetUserByIdAsync<T>(string userId);
        Task<PaginationDTO<SimpleApplicationUserDTO>> GetAllUsersAsync(int? hierarchy, string? name, string?[] roles, bool? IsActive, int limit = 25, int skip = 0);
        Task<List<SimpleRoleReadDTO>> GetAllRolesAsync(int? hierarchy);
    }
}
