namespace Domain.Home.SectionHome
{
    public class SectionDTO
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public DateTime? EndDate { get; set; }
        public ButtonReadDTO? Button { get; set; }
        public bool ShowButtonSlider { get; set; }
        public bool SecondLine { get; set; }
        public OptionSectionDTO? OptionSection { get; set; }
    }

    public class ButtonReadDTO
    {
        public string? Text { get; set; }
        public string? Path { get; set; }
        public ButtonPosition? Position { get; set; }
    }

    public class OptionSectionDTO
    {
        public bool? HasDiscount { get; set; }
        public decimal? toDiscount { get;set; }
        public bool? IsFeatured { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public int? ChildCategoryId { get; set; }

    }
}
