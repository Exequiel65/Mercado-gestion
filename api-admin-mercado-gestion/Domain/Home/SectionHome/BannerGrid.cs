using Domain.Entity;

namespace Domain.Home.SectionHome
{
    public class BannerGrid : IEntityScoped
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public int EntityId { get; set; }
        public virtual ICollection<ItemBannerGrid> Items { get; set; }
    }
}
