using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace API.Middlewares.CustomPolicy
{
    public class SameUserOrAdminRequirement : IAuthorizationRequirement { }
    public class SameUserOrAdminHandler : AuthorizationHandler<SameUserOrAdminRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SameUserOrAdminRequirement requirement)
        {
            var userIdClaim = context.User.FindFirst(ClaimTypes.Sid)?.Value;
            var role = context.User.FindFirst(ClaimTypes.Role)?.Value;
            var type = context.Resource.GetType();
            if (context.Resource is DefaultHttpContext mvcContext)
            {
                var routeId = mvcContext.GetRouteData().Values["id"]?.ToString();

                if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(routeId))
                    return Task.CompletedTask;

                var isAdmin = role == "admin" || role == "superadmin";
                var isSameUser = userIdClaim == routeId;

                if (isAdmin || isSameUser)
                {
                    context.Succeed(requirement);
                }
            }

            return Task.CompletedTask;
        }
    }
}
