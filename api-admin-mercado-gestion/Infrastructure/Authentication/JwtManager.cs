using Infrastructure.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Infrastructure.Authentication
{
    public record JwtConfig(string Secret, string Audience, string Issuer);

    internal static class JwtManager
    {
        internal static string GenerateToken(JwtConfig config, ApplicationRole[] roles, Func<Claim[]> contextSpecificClaimsFunc, int expireMinutes = 1440)
        {
            var claims = (contextSpecificClaimsFunc() ?? Array.Empty<Claim>())
                .Concat(roles?.SelectMany(role => role?.Claims.Select(x => new Claim(x.ClaimType, x.ClaimValue))) ??
                        Array.Empty<Claim>())
                .Concat(roles?.Select(role => new Claim(ClaimTypes.Role, role.Name)) ?? Array.Empty<Claim>())
                .ToArray();
            var token = CreateJwt(config, claims, expireMinutes);

            return token;
        }

        internal static string GenerateToken(JwtConfig config, string[] roles, Func<Claim[]> contextSpecificClaimsFunc, int expireMinutes = 1440)
        {
            var claims = (contextSpecificClaimsFunc() ?? Array.Empty<Claim>())
                .Concat(roles?.Select(role => new Claim(ClaimTypes.Role, role)) ?? Array.Empty<Claim>())
                .ToArray();
            var token = CreateJwt(config, claims, expireMinutes);

            return token;
        }

        private static string CreateJwt(JwtConfig config, Claim[] claims, int expireMinutes = 1440)
        {
            var privateKey = Convert.FromBase64String(config.Secret);
            using var rsa = RSA.Create();
            rsa.ImportRSAPrivateKey(privateKey, out _);
            var credentials = new SigningCredentials(new RsaSecurityKey(rsa),
                SecurityAlgorithms.RsaSha256)
            {
                CryptoProviderFactory = new CryptoProviderFactory { CacheSignatureProviders = false }
            };
            var tokenHandler = new JwtSecurityTokenHandler();

            var now = DateTime.UtcNow;
            var tokenDescriptor = new JwtSecurityToken(
                claims: claims,
                notBefore: now,
                expires: now.AddMinutes(Convert.ToInt32(expireMinutes)),
                audience: config.Audience,
                issuer: config.Audience,
                signingCredentials: credentials
            );
            var token = tokenHandler.WriteToken(tokenDescriptor);
            return token;
        }
    }
}
