namespace Domain.WebConfig
{
    public class PolicyReadDTO
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? UpdateBy { get; set; }
        public PolicyReadDTO(int id, string description, DateTime createdAt, DateTime updatedAt, string updateBy, int entityId)
        {
            Id = id;
            Description = description;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            UpdateBy = updateBy;
        }

        public PolicyReadDTO()
        {
        }

        public PolicyReadDTO(Policy policy)
        {
            Id = policy.Id;
            Description = policy.Description;
            CreatedAt = policy.CreatedAt;
            UpdatedAt = policy.UpdatedAt;
        }
    }
}
