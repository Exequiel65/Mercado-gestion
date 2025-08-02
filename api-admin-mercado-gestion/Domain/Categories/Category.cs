using Domain.Entity;

namespace Domain.Categories
{
    public class Category : IEntityScoped
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<SubCategory> SubCategories { get; set; } = new List<SubCategory>();
        public int EntityId { get; set; }

    }
}
