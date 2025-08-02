using Domain.Entity;

namespace Domain.Business
{
    public class SocialMedia : IEntityScoped
    {
        public int Id { get; set; }
        public string? Instagram { get; set; }
        public string? Facebook { get; set; }
        public string? Twitter { get; set; }
        public int EntityId { get; set; }
    }
}
