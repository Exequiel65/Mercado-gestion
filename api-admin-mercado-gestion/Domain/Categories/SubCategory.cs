using Domain.Entity;

namespace Domain.Categories
{
    public class SubCategory : IEntityScoped
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public virtual ICollection<ChildCategory> ChildCategories { get; set; } = new List<ChildCategory>();
        public int EntityId { get; set; }
    }
}
