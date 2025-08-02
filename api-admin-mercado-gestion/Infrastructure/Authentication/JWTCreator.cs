using Application.Interfaces;
using Domain.User;
using Infrastructure.Identity;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Infrastructure.Authentication
{
    public class JWTCreator : IJwtCreator
    {
        private readonly IConfiguration _configuration;
        private readonly JwtConfig _jwtConfig;
        private readonly IAccountManager _accountManager;

        public JWTCreator(IConfiguration configuration, JwtConfig jwtConfig, IAccountManager accountManager)
        {
            _configuration = configuration;
            _jwtConfig = jwtConfig;
            _accountManager = accountManager;
        }

        public async Task<string> GetTokenAndId(string username, int entityId, int expireMinutes)
        {
            var userRole = await _accountManager.GetUserAndRolesAsync(username, entityId);
            var (user, role) = userRole;
            var token = JwtManager.GenerateToken(
                _jwtConfig,
                role,
                () => GenerateUserClaims(user).ToArray()
                       .Concat(user.Claims?.Select(x => new Claim(x.ClaimType, x.ClaimValue)) ?? Array.Empty<Claim>())
                       .ToArray(),
                expireMinutes
                );
            return token;
        }

        public async Task<string> GetTokenAndId(ApplicationUserDTO user)
        {
            var token = JwtManager.GenerateToken(
                _jwtConfig,
                user.Roles.Select(x => x.Name.ToLower()).ToArray(),
                () => GenerateUserClaims(user).ToArray()
                       .Concat(user.Claims?.Select(x => new Claim(x.ClaimType, x.ClaimValue)) ?? Array.Empty<Claim>())
                       .ToArray(),
                int.Parse(_configuration.GetValue<string>("JWT:ExpirationMinutes"))
                );
            return token;
        }

        public JwtSecurityToken DecodeToken(string stoken)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadToken(stoken.Replace("Bearer ", "")) as JwtSecurityToken;
            return jwtToken ?? throw new ArgumentException("Invalid token format", nameof(stoken));
        }

        private static IEnumerable<Claim> GenerateUserClaims(ApplicationUser user)
        {
            yield return new Claim(ClaimTypes.Sid, user.Id);
            yield return new Claim(JwtRegisteredClaimNames.Sub, user.Id);
            yield return new Claim(ClaimTypes.Name, $"{user.Name}");
            yield return new Claim("EntityId", $"{user.EntityId}");
            if (!string.IsNullOrWhiteSpace(user.Email))
                yield return new Claim(ClaimTypes.Email, user.Email);
            if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                yield return new Claim(ClaimTypes.MobilePhone, user.PhoneNumber);
            if (!string.IsNullOrWhiteSpace(user.Picture))
                yield return new Claim("Picture", user.Picture);
            if (user.StoreId.HasValue)
                yield return new Claim("StoreId", user.StoreId.Value.ToString());
            yield return new Claim("UserName", user.UserName);
        }

        private static IEnumerable<Claim> GenerateUserClaims(ApplicationUserDTO user)
        {
            yield return new Claim(ClaimTypes.Sid, user.Id);
            yield return new Claim(JwtRegisteredClaimNames.Sub, user.Id);
            yield return new Claim(ClaimTypes.Name, $"{user.Name}");
            yield return new Claim("EntityId", $"{user.EntityId}");
            if (!string.IsNullOrWhiteSpace(user.Email))
                yield return new Claim(ClaimTypes.Email, user.Email);
            if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
                yield return new Claim(ClaimTypes.MobilePhone, user.PhoneNumber);
            if (!string.IsNullOrWhiteSpace(user.Picture))
                yield return new Claim("Picture", user.Picture);
            if (user.StoreId.HasValue)
                yield return new Claim("StoreId", user.StoreId.Value.ToString());
            yield return new Claim("UserName", user.UserName);
        }

    }
}
