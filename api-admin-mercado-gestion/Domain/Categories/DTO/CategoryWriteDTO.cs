namespace Domain.Categories.DTO
{
    public class CategoryWriteDTO
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public List<SubCategoryWrite>? SubCategories { get; set; }

    }

    public class  SubCategoryWrite
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public int? CategoryId { get; set; }
        public List<ChildCategoryWrite>? ChildCategories { get; set; }

    }

    public class  ChildCategoryWrite
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public int? SubCategoryId { get; set; }
    }
}
