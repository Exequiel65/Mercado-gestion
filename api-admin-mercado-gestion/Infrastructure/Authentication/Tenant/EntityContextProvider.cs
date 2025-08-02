using Application.Interfaces;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;

namespace Infrastructure.Authentication.Tenant
{
    public class EntityContextProvider : IEntityContextProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppContexUnfiltered _dbContext;
        private readonly List<string> allowedPathAnonymous = new List<string> { "/api/status", "/api/auth/register" };
        private readonly ILogger<EntityContextProvider> _logger;
        public EntityContextProvider(IHttpContextAccessor httpContextAccessor, AppContexUnfiltered appDbContext, ILogger<EntityContextProvider> logger)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = appDbContext ?? throw new ArgumentNullException(nameof(appDbContext));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public int GetCurrentEntityId()
        {
            int EntityId = -1;

            if (_httpContextAccessor == null || _httpContextAccessor.HttpContext == null)
            {
                return EntityId;
            }
            string token = _httpContextAccessor.HttpContext.Request.Headers.TryGetValue("Authorization", out var tokenValue) ? tokenValue.ToString() : null;

            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext != null)
            {
                if (!string.IsNullOrEmpty(token))
                {
                    var decodeToken = DecodeToken(token);
                    EntityId = decodeToken.EntityId;
                    //response.Roles = decodeToken.Roles;
                }
                else
                {
                    EntityId = GetEntityByDomain(GetDomain(httpContext));
                }
            }

            var path = _httpContextAccessor.HttpContext.Request.Path.HasValue ? _httpContextAccessor.HttpContext.Request.Path.Value : "PATH IS EMPTY";

            if (EntityId == -1 && !allowedPathAnonymous.Contains(path))
            {
                _logger.LogError($"ENTITY WARNING | EntityId is -1 | PATH: {path}");
            }
            ////    if (_httpContextAccessor.HttpContext?.Request?.Headers.TryGetValue("x-entity", out var entityIdHeader) == true)
            ////{
            ////    if (int.TryParse(entityIdHeader.ToString(), out var entityId))
            ////    {
            ////        return EntityId;
            ////    }
            ////}
            return EntityId;
        }
        private DecodeTokenDTO DecodeToken(string token)
        {
            DecodeTokenDTO response = new DecodeTokenDTO();
            var handler = new JwtSecurityTokenHandler();
            int EntityId = -1;
            var jwtToken = handler.ReadToken(token.Replace("Bearer ", "")) as JwtSecurityToken;
            var claimEntity = jwtToken?.Claims.FirstOrDefault(claim => claim.Type == "EntityId");
            //var Roles = jwtToken?.Claims?.Where(claim => claim.Type.EndsWith("/role")).Select(x => x.Value.ToString()).ToList();

            if (claimEntity != null)
            {
                int.TryParse(claimEntity.Value, out EntityId);
            }

            response.EntityId = EntityId;
            //response.Roles = Roles;
            return response;
        }

        private class DecodeTokenDTO
        {
            public int EntityId { get; set; }
            //public List<string> Roles { get; set; }
        }

        private string GetDomain(HttpContext httpContext)
        {
            string host = string.Empty;

            var Request = httpContext.Request;

            string origin = Request.Headers.Origin.ToString();

            if (string.IsNullOrEmpty(origin))
            {
                origin = Request.Headers.Host.ToString();

                if (!string.IsNullOrEmpty(origin))
                    return origin;
            }

            if (string.IsNullOrEmpty(origin))
            {
                origin = Request.Headers.Referer.ToString();
            }

            if (string.IsNullOrEmpty(origin))
            {
                return string.Empty;
            }

            var url = new Uri(origin);
            host = url.Host;

            return host;
        }

        private int GetEntityByDomain(string domain)
        {
            int? entityId = _dbContext.Domains.Where(p => p.Domain == domain).Select(p => p.EntityId).FirstOrDefault();
            if (entityId is null || entityId.Value == 0)
            {
                entityId = -1;
            }

            return entityId.Value;
        }


    }

}
