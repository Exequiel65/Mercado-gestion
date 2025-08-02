using Domain.Entity;

namespace Domain.WebConfig
{
    public class Policy : IEntityScoped
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UpdateBy { get; set; }
        public int EntityId
        {
            get; set;
        }
    }

}
