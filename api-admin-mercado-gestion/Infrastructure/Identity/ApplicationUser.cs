using Domain.Entity;
using Domain.Store;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class ApplicationUser: IdentityUser, IEntityScoped
    {
        public string Name { get; set; }
        public int? StoreId { get; set; }
        public override string? UserName { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
        public string? Picture { get; set; }
        public string? ExternalId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int EntityId { get; set; }
        public virtual ICollection<ApplicationRole> UserRoles { get; set; } = new List<ApplicationRole>();
        public virtual ICollection<IdentityUserClaim<string>> Claims { get; set; }
        public virtual Store Store { get; set; }
        public bool IsActive { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsDeleted { get; set; }
    }
}
