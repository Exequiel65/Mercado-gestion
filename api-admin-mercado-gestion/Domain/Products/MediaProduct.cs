using Domain.Entity;

namespace Domain.Products
{
    public class MediaProduct : IEntityScoped
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string MediaUrl { get; set; }
        public string MediaType { get; set; } // e.g., "image", "video", etc.
        public int EntityId { get; set; }
    }
}
