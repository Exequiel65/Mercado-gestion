using Domain.Entity;

namespace Domain.Home.SectionHome
{
    public class ItemBannerGrid : IEntityScoped
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? TextButton { get; set; }
        public string? LinkButton { get; set; }
        public Theme Theme { get; set; }
        public int Priority { get; set; }
        public int BannerGridId { get; set; }
        public int EntityId { get; set; }
    }

    public enum Theme
    {
        light,
        dark
    }
}
