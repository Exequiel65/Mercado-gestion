using Domain.Categories;
using Domain.Entity;

namespace Domain.Products
{
    public class Product : IEntityScoped
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        public int Stock { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }

        public bool IsFeatured { get; set; }
        public bool IsSoldOut { get; set; }
        public bool HasDiscount { get; set; }
        public decimal? AmountDiscount { get; set; }


        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public int? ChildCategoryId { get; set; }
        public virtual List<MediaProduct>? Images { get; set; }
        public virtual Category? Category { get; set; }
        public virtual SubCategory? SubCategory { get; set; }
        public virtual ChildCategory? ChildCategory { get; set; }

        public int EntityId { get; set; }
    }
}
