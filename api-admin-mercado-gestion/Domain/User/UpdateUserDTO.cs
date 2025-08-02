namespace Domain.User
{
    public class UpdateUserDTO : CreateUserDTO
    {
        public string Id { get; set; }
        public int EntityId { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsEnabled { get; set; }
        public bool? IsDeleted { get; set; }

    }
}
