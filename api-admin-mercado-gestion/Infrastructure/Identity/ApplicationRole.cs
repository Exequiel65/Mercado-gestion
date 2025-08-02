using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class ApplicationRole: IdentityRole
    {
        public ApplicationRole() { }
        public ApplicationRole(string roleName) : base(roleName)
        {

        }
        public string? Name { get; set; }
        public string? NormalizedName { get; set; }
        public string? Description { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public string? PrettyName { get; set; }
        public int? Hierarchy { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
        public virtual ICollection<IdentityRoleClaim<string>> Claims { get; set; }

        internal virtual string[] DefaultClaims() => new string[0];
    }
}
