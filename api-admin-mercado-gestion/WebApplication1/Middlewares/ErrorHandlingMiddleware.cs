using Application.Common;

namespace API.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch(ApiErrorException ex)
            {
                context.Response.StatusCode = ex.ErrorResponse.HttpCode;
                context.Response.ContentType = "application/json";
                var response = ApiResponse<string>.Fail(ex.ErrorResponse.ErrorCode, ex.ErrorResponse.ErrorDescription);
                await context.Response.WriteAsJsonAsync(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";

                var response = ApiResponse<string>.Fail("Ha ocurrido un error inesperado.");
                await context.Response.WriteAsJsonAsync(response);
            }
        }
    }
}
