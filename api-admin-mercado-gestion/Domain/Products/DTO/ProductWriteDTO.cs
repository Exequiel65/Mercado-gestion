namespace Domain.Products.DTO
{
    public class ProductWriteDTO
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        public int Stock { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }

        public bool IsFeatured { get; set; }
        public bool IsSoldOut { get; set; }
        public bool HasDiscount { get; set; }
        public decimal? AmountDiscount { get; set; }


        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public int? ChildCategoryId { get; set; }
        public List<MediaProductWriteDTO>? Images { get; set; }
    }
}
