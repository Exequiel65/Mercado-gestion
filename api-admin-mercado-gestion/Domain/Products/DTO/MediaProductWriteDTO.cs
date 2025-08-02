namespace Domain.Products.DTO
{
    public class MediaProductWriteDTO
    {
        public int? Id { get; set; }
        public int? ProductId { get; set; }
        public string MediaUrl { get; set; }
        public string? MediaType { get; set; } = "image";
    }
}
