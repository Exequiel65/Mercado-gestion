using Domain.Entity;

namespace Domain.Home.SectionHome
{
    public class Banner : IEntityScoped
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public string? link { get; set; }
        public string sm { get; set; }
        public string md { get; set; }
        public string xl { get; set; }
        public int EntityId { get; set; }
    }
}
