namespace Domain.User
{
    public class CreateUserDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? UserName { get; set; }
        public int? StoreId { get; set; }
        public string? Picture { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public List<string>? Roles { get; set; }
        public string? Password { get; set; }
    }
}
