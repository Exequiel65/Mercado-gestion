using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AspNetUserRoles
    {
        public string UserId { get; set; }
        public string RoleId { get; set; }
        public virtual ApplicationUser User { get; set; }
        public virtual ApplicationRole Role { get; set; }
    }
}
