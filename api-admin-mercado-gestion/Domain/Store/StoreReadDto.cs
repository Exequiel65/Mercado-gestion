namespace Domain.Store
{
    public class StoreReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int EntityId { get; set; }
        public int BusinessId { get; set; }
    }
}
