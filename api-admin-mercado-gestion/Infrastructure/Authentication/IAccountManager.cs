using Infrastructure.Identity;

namespace Infrastructure.Authentication
{
    public interface IAccountManager
    {
        Task<ApplicationRole> GetRoleLoadRelatedAsync(string roleName, CancellationToken token = default);
        Task<Tuple<ApplicationUser, ApplicationRole[]>> GetUserAndRolesAsync(string username, int? entityId = null, CancellationToken token = default);
        Task<ApplicationUser> GetUserByUserNameAsync(string userName, CancellationToken token = default);
        Task<ApplicationRole> GetRoleWithClaims(string roleName, CancellationToken token = default);
    }
}
