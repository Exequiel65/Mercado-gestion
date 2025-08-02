using Domain.Business.Config;
using Domain.Entity;
using System.Text.Json.Serialization;
namespace Domain.Business
{
    public class Business : IEntityScoped
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string? GoogleMapsUrl { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? LogoUrl { get; set; }
        public string? IconUrl { get; set; }
        public string? LegendUrl { get; set; }
        public int? SocialMediaId { get; set; }
        public virtual SocialMedia SocialMedia { get; set; }
        public virtual BusinesConfig Config { get; set; }

        [JsonIgnore]
        public virtual List<Store.Store> Stores { get; set; } = new List<Store.Store>();
        public override string ToString()
        {
            return $"{Name} - {Description} ({Address}, {PhoneNumber}, {Email})";
        }
        public int EntityId { get; set; }

        public Business()
        {
            
        }

        public Business(int id, string name, string description, string address, string phoneNumber, string email)
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
