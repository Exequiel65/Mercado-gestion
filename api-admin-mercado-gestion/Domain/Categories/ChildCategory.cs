using Domain.Entity;

namespace Domain.Categories
{
    public class ChildCategory : IEntityScoped
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SubCategoryId { get; set; }
        public int EntityId { get; set; }
    }
}
