using Domain.Entity;

namespace Domain.Store
{
    public class Store: IEntityScoped
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int EntityId { get; set; }
        public int BusinessId { get; set; }
        public virtual Business.Business? Business { get; set; }
        public override string ToString()
        {
            return $"{Name} - {Description} ({Address}, {PhoneNumber}, {Email})";
        }
        public Store()
        {
            
        }
        public Store(int id, string name, string description, string address, string phoneNumber, string email)
        {
            Id = id;
            Name = name;
            Description = description;
            Address = address;
            PhoneNumber = phoneNumber;
            Email = email;
        }
    }
}
