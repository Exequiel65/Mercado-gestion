namespace Domain.WebConfig
{
    public class FrequentlyQuestionReadDTO
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? UpdateBy { get; set; }
    }
}
