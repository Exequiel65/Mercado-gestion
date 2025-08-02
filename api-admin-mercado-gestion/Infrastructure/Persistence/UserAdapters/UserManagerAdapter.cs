using Application.Common;
using Application.Interfaces;
using AutoMapper;
using Domain.User;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Net;

namespace Infrastructure.Persistence.UserAdapters
{
    public class UserManagerAdapter : IUserManagerAdapter
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly AppContexUnfiltered _appContexUnfiltered;
        private readonly AppDbContext _appDbContext;

        public UserManagerAdapter(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IMapper mapper, AppContexUnfiltered appContexUnfiltered, AppDbContext appDbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _appContexUnfiltered = appContexUnfiltered;
            _appDbContext = appDbContext;
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email);
        }

        public async Task<(bool Succeeded, IEnumerable<string> Errors, ApplicationUserDTO? user)> CreateUserAsync(ApplicationUserDTO user)
        {
            var newUser = new ApplicationUser
            {
                Email = user.Email,
                UserName = user.Email.Replace(" ", ""),
                NormalizedUserName = user.Name,
                Name = user.Name,
                Picture = user.Picture,
                IsActive = user.IsActive,
                IsEnabled = user.IsEnabled,
                IsDeleted = user.IsDeleted,
                PhoneNumber = user.PhoneNumber,
                StoreId = user.StoreId,
                CreatedDate = DateTimeOffset.UtcNow,
                DateOfBirth = user.DateOfBirth,
                PasswordHash = _userManager.PasswordHasher.HashPassword(null, user.Password),
                EntityId = user.EntityId
            };

            var result = await _userManager.CreateAsync(newUser);
            ApplicationUserDTO userDto = null;
            if (result.Succeeded)
            {
                userDto = _mapper.Map<ApplicationUserDTO>(newUser);
            }
            return (result.Succeeded, result.Errors.Select(e => e.Description), userDto);
        }

        public async Task<(bool Succeeded, ApplicationUserDTO? user)> CreateUserAsyncUnfilter(ApplicationUserDTO user)
        {
            var newUser = new ApplicationUser
            {
                Email = user.Email,
                UserName = user.Email,
                NormalizedUserName = user.Email,
                Name = user.Name,
                Picture = user.Picture,
                IsActive = user.IsActive,
                IsEnabled = user.IsEnabled,
                IsDeleted = user.IsDeleted,
                PhoneNumber = user.PhoneNumber,
                StoreId = user.StoreId,
                CreatedDate = DateTimeOffset.UtcNow,
                DateOfBirth = user.DateOfBirth,
                PasswordHash = _userManager.PasswordHasher.HashPassword(null, user.Password),
                EntityId = user.EntityId
            };

            var result = await _userManager.CreateAsync(newUser);
            ApplicationUserDTO userDto = null;
            return (result.Succeeded, _mapper.Map<ApplicationUserDTO>(newUser));
        }

        public async Task<(bool Succeeded, IEnumerable<string> Errors, ApplicationUserDTO? user)> UpdateUserAsync(ApplicationUserDTO user)
        {
            var existingUser = await _userManager.FindByIdAsync(user.Id);
            if (existingUser == null) throw new ApiErrorException(HttpStatusCode.BadRequest, "USER_NOT_FOUND", "User not found");
            _mapper.Map(user, existingUser); 
            var result = await _userManager.UpdateAsync(existingUser);
            if (!string.IsNullOrEmpty(user.Password))
            {
                var hasPassword = await _userManager.HasPasswordAsync(existingUser);
                if (hasPassword)
                {
                    var removeResult = await _userManager.RemovePasswordAsync(existingUser);
                    if (!removeResult.Succeeded)
                    {
                        return (false, removeResult.Errors.Select(e => e.Description), null);
                    }
                }

                var addResult = await _userManager.AddPasswordAsync(existingUser, user.Password);
                if (!addResult.Succeeded)
                {
                    return (false, addResult.Errors.Select(e => e.Description), null);
                }
            }
            return (result.Succeeded, result.Errors.Select(e => e.Description), _mapper.Map<ApplicationUserDTO>(existingUser));
        }

        public async Task<bool> RoleExistsAsync(string roleName)
        {
            return await _roleManager.RoleExistsAsync(roleName);
        }

        public async Task CreateRoleAsync(string roleName)
        {
            var role = new ApplicationRole(roleName);
            await _roleManager.CreateAsync(role);
        }

        public async Task AssignRoleAsync(string email, string roleName)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                ApplicationRole? role = await _roleManager.Roles.FirstOrDefaultAsync(x => x.Name == roleName);
                if (role != null)
                {
                    user.UserRoles = new List<ApplicationRole>() { role};
                    //user.UserRoles.Add(role);
                    await _userManager.UpdateAsync(user);
                }
            }
        }

        public async Task AssignRoleUnfilterAsync(string email, int entityId, string roleName)
        {
            _appDbContext.SetScopedEntityId(entityId);
            var user = await _appDbContext.Users
                .Include(x => x.UserRoles)
                .FirstOrDefaultAsync(u => u.Email == email);
            if (user != null)
            {
                ApplicationRole? role = await _roleManager.Roles.AsNoTracking().FirstOrDefaultAsync(x => x.Name == roleName);
                if (role != null)
                {
                    //user.UserRoles = new List<ApplicationRole>() { role };
                    //await _userManager.UpdateAsync(user);
                    _appDbContext.AspNetUserRoles.Add(new AspNetUserRoles()
                    {
                        UserId = user.Id,
                        RoleId = role.Id
                    });
                    await _appDbContext.SaveChangesAsync();

                }
            }
        }

        public async Task<ApplicationUserDTO?> GetUserByEmailAsync(string email)
        {
            var user = await _appDbContext.Users
                .Include(x => x.UserRoles)
                .FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return null;
            return new ApplicationUserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                UserName = user.UserName,
                CreatedDate = user.CreatedDate,
                UpdatedDate = user.UpdatedDate,
                Picture = user.Picture,
                DateOfBirth = user.DateOfBirth,
                EntityId = user.EntityId,
                Roles = _mapper.Map<List<ApplicationRoleDTO>>(user.UserRoles.ToList()),
                IsActive = user.IsActive,
                IsEnabled = user.IsEnabled,
                IsDeleted = user.IsDeleted,
                StoreId = user.StoreId
            };
        }

        public async Task<bool> ValidatePassword(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return false;
            return await _userManager.CheckPasswordAsync(user, password);
        }
        public async Task<T?> GetUserByIdAsync<T>(string userId)
        {
            var user = await _userManager.Users
                .Include(x => x.UserRoles)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return default(T);
            return _mapper.Map<T>(user);
        }

        public async Task<PaginationDTO<SimpleApplicationUserDTO>> GetAllUsersAsync(int? hierarchy, string? name, string?[] roles, bool? IsActive, int limit = 25, int skip = 0)
        {
            var count = 0;

            var users = _userManager.Users.Include(x => x.UserRoles).AsQueryable();
            if (hierarchy.HasValue && hierarchy.Value > 0 && hierarchy.Value != 1)
            {
                users = users.Where(u => u.UserRoles.Where(x => x.Hierarchy.Value > hierarchy).Any());
            }

            if (!string.IsNullOrEmpty(name))
            {
                users = users.Where(u => u.Name.ToLower().Contains(name));
            }
            if (roles != null && roles.Length > 0)
            {
                users = users.Where(u => u.UserRoles.Any(x => roles.Any(s => s.ToLower() == x.Name.ToLower())));
            }
            if (IsActive.HasValue)
            {
                users = users.Where(u => u.IsActive == IsActive.Value);
            }

            count = await users.CountAsync();

            if (skip > 0)
            {
                users = users.Skip(skip);
            }
            if (limit > 0)
            {
                users = users.Take(limit);
            }
            return new PaginationDTO<SimpleApplicationUserDTO>()
            {
                Items = await users.Select(x => _mapper.Map<SimpleApplicationUserDTO>(x)).ToListAsync(),
                PageNumber = skip > 0 ? skip : 1,
                PageSize = limit > 0 ? limit : 25,
                TotalCount = count,
            };
        }

        public async Task<List<SimpleRoleReadDTO>> GetAllRolesAsync(int? hierarchy)
        {
            var roles = _roleManager.Roles.AsQueryable();
            if (hierarchy.HasValue && hierarchy.Value > 0)
            {
                roles = roles.Where(x => x.Hierarchy >= hierarchy);
            }
            roles = roles.OrderBy(x => x.Hierarchy).ThenBy(x => x.Name);

            return _mapper.Map<List<SimpleRoleReadDTO>>((await roles.ToListAsync()));
        }
    }
}
