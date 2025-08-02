using System.Net;

namespace Application.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }

        public static ApiResponse<T> Ok(T data, string message = "Success") =>
            new() { Success = true, Data = data, Message = message };

        public static ApiResponse<T> Fail(string message) =>
            new() { Success = false, Message = message };

        public static ApiResponse<T> Fail(T data, string message) =>
            new() { Success = false, Data = data, Message = message};
    }

    public record ApiErrorResponse(int HttpCode, string ErrorCode, string ErrorDescription);

    public sealed class ApiErrorException : Exception
    {
        public ApiErrorResponse ErrorResponse { get; set; }
        public ApiErrorException(int httpCode, string errorCode, string description)
        : base(description)
        {
            ErrorResponse = new ApiErrorResponse(httpCode, errorCode, description);
        }

        public ApiErrorException(HttpStatusCode httpCode, string errorCode, string description)
        : base(description)
        {
            ErrorResponse = new ApiErrorResponse((int)httpCode, errorCode, description);
        }
        public ApiErrorException(ApiErrorResponse errorResponse)
            : base(errorResponse.ErrorDescription)
        {
            ErrorResponse = errorResponse;
        }

        public ApiErrorException(ApiErrorResponse errorResponse, Exception? inner)
            : base(errorResponse.ErrorDescription, inner)
        {
            ErrorResponse = errorResponse;
        }
    }
}
