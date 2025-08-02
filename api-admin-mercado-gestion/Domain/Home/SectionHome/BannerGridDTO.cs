namespace Domain.Home.SectionHome
{
    public class BannerGridDTO
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public virtual List<ItemBannerGridDTO> Items { get; set; }
    }
}
