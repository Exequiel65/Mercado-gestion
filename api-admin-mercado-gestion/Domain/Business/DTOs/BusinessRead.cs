namespace Domain.Business.DTOs
{
    public class BusinessRead
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
        public virtual SocialMediaRead SocialMedia { get; set; }
    }
}
