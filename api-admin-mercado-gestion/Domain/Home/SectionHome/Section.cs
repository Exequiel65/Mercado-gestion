using Domain.Entity;
using System.Text.Json.Serialization;

namespace Domain.Home.SectionHome
{
    public class Section : IEntityScoped
    {
        public int Id { get; set; }
        public string? SectionItem { get; set; }
        public string? Title { get; set; }
        public DateTime? EndDate { get; set; }
        public string? TextButton { get; set; }
        public string? LinkButton { get; set; }
        public ButtonPosition? PositionButton { get; set; }
        public bool ShowButtonSlider { get; set; }
        public bool SecondLine { get; set; }
        public int EntityId { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ButtonPosition
    {
        bottom,
        top
    }
}
