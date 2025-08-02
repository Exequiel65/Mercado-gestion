using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace API.Middlewares
{
    public class CommerceManagerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CommerceManagerMiddleware> _logger;
        private readonly IConfiguration _configuration;

        public CommerceManagerMiddleware(RequestDelegate next, ILogger<CommerceManagerMiddleware> logger, IConfiguration configuration)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            _logger.LogInformation("CommerceManagerMiddleware invoked for request: {RequestPath}", context.Request.Path);

            if (context.Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                string tokenRaw = authHeader.ToString();

                if (tokenRaw.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    string token = tokenRaw.Substring("Bearer ".Length).Trim();

                    try
                    {
                        var handler = new JwtSecurityTokenHandler();
                        var jwtToken = handler.ReadToken(token) as JwtSecurityToken;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to parse JWT token.");
                    }
                }
                else
                {
                    _logger.LogWarning("Authorization header does not start with 'Bearer'. Value: {AuthHeader}", tokenRaw);
                }
            }
            else
            {
                _logger.LogWarning("No Authorization header found in request.");
            }
            _logger.LogInformation("IsAuthenticated: {IsAuthenticated}", context.User.Identity?.IsAuthenticated);
            _logger.LogInformation("Claims count: {Count}", context.User.Claims.Count());
            _logger.LogInformation("User Identifier: {Id}", context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            await _next(context);
            _logger.LogInformation("CommerceManagerMiddleware completed for request: {RequestPath}", context.Request.Path);
        }
    }
}
