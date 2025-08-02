namespace Domain.User
{
    public class ApplicationUserDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? Password { get; set; }
        public string? UserName { get; set; }
        public int? StoreId { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
        public string? Picture { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int EntityId { get; set; }

        public List<ApplicationRoleDTO> Roles { get; set; } = new();
        public List<UserClaimDTO> Claims { get; set; } = new();
        public bool IsActive { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class UserClaimDTO
    {
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }
    }

    public class SimpleApplicationUserDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string? UserName { get; set; }
        public string? Picture { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int EntityId { get; set; }
        public int? StoreId { get; set; }
        public bool IsActive { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsDeleted { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
