namespace Domain.User
{
    public class ApplicationRoleDTO
    {
        public ApplicationRoleDTO()
        {
        }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? NormalizedName { get; set; }
        public string? Description { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public string? PrettyName { get; set; }
        public int? Hierarchy { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}
