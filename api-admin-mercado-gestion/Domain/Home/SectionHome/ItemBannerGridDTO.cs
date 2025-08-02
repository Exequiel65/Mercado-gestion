using System.Text.Json.Serialization;

namespace Domain.Home.SectionHome
{
    public class ItemBannerGridDTO
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public ButtonReadDTO? Button { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Theme Theme { get; set; }
        public int Priority { get; set; }
        public int BannerGridId { get; set; }
    }
}
