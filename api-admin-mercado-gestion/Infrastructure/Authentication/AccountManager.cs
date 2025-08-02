using Infrastructure.Identity;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Infrastructure.Authentication
{
    public class AccountManager : IAccountManager
    {
        private readonly AppDbContext _context;
        public UserManager<ApplicationUser> UserManager { get; }
        private readonly RoleManager<ApplicationRole> _roleManager;

        public AccountManager(AppDbContext context, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _context = context;
            UserManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<ApplicationUser> GetUserByUserNameAsync(string userName, CancellationToken token = default)
        {
            var user = await _context.Users
                .Include(u => u.Claims)
                .Where(u => u.UserName == userName)
                .FirstOrDefaultAsync(cancellationToken: token);
            return user;
        }

        public async Task<Tuple<ApplicationUser, ApplicationRole[]>> GetUserAndRolesAsync(string username, int? entityId = null, CancellationToken token = default)
        {
            if (entityId != null && entityId > 0)
            {
                _context.SetScopedEntityId(entityId);
            }
            var user = await _context.Users
                .Include(u => u.Claims)
                .Where(u => u.UserName == username)
                .FirstOrDefaultAsync(cancellationToken: token);

            if (user == null)
                throw new Exception("USER NOT FOUND");


            var userRoleIds = user.UserRoles.Select(r => r.Id).ToList();

            var roles = await _context.Roles
                .Include(u => u.Claims)
                .Where(r => userRoleIds.Contains(r.Id))
                .Select(r => r)
                .OrderBy(r => r.Hierarchy)
                .ToArrayAsync(cancellationToken: token);


            return Tuple.Create(user, roles);
        }

        public async Task<ApplicationRole> GetRoleWithClaims(string roleName, CancellationToken token = default)
        {
            var role = await _context.Roles
                .Include(u => u.Claims)
                .Where(r => r.Name.Equals(roleName))
                .Select(r => r)
                .FirstOrDefaultAsync(cancellationToken: token);

            return role;
        }
        public async Task<ApplicationRole> GetRoleLoadRelatedAsync(string roleName, CancellationToken token = default)
        {
            var role = await _context.Roles
                .Include(r => r.Claims)
                .Where(r => r.Name == roleName)
                .FirstOrDefaultAsync(cancellationToken: token);

            return role;
        }

    }
}
