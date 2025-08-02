namespace Application.Common
{
    public class ProductFilter : BaseFilter
    {
        public List<int>? CategoryId { get; set; }
        public List<int>? SubCategoryId { get; set; }
        public List<int>? ChildCategoryId { get; set; }
        public bool? IsFeatured { get; set; }
        public bool? IsSoldOut { get; set; }
        public bool? HasDiscount { get; set; }
        public decimal? AmountDiscount { get; set; }

        public ProductFilter(string? sortBy, SortDirection? sortDirection, string? name = null, bool? isActive = null, int limit = 10, int skip = 0)
            : base(name, isActive, limit, skip, sortBy, sortDirection)
        {
        }

        public ProductFilter()
        {
        }

        public ProductFilter(List<int>? categoryId, List<int>? subCategoryId, List<int>? childCategoryId, bool? isFeatured, bool? isSoldOut, bool? hasDiscount, decimal? amountDiscount, string? sortBy, SortDirection? sortDirection, string? name = null, bool? isActive = null, int limit = 10, int skip = 0)
            : base(name, isActive, limit, skip, sortBy, sortDirection)
        {
            CategoryId = categoryId;
            SubCategoryId = subCategoryId;
            ChildCategoryId = childCategoryId;
            IsFeatured = isFeatured;
            IsSoldOut = isSoldOut;
            HasDiscount = hasDiscount;
            AmountDiscount = amountDiscount;
        }

        public ProductFilter(List<int>? categoryId, List<int>? subCategoryId, List<int>? childCategoryId, bool? isFeatured, bool? isSoldOut, bool? hasDiscount, decimal? amountDiscount)
        {
            CategoryId = categoryId;
            SubCategoryId = subCategoryId;
            ChildCategoryId = childCategoryId;
            IsFeatured = isFeatured;
            IsSoldOut = isSoldOut;
            HasDiscount = hasDiscount;
            AmountDiscount = amountDiscount;
        }
    }
}
