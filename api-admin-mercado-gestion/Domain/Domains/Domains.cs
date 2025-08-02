using Domain.Entity;

namespace Domain.Domains
{
    public class Domains : IEntityScoped
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Domain { get; set; }
        public bool IsActive { get; set; }
        public int EntityId { get; set; }

    }
}
