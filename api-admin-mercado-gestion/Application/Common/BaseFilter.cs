namespace Application.Common
{
    public class BaseFilter
    {
        public string? Name { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; } = false;
        public int? Limit { get; set; }
        public int? Skip { get; set; }
        public string? SortByColumn { get; set; }
        public SortDirection? SortDirection { get; set; }
        public BaseFilter(string? name, bool? isActive, int? limit, int? skip, string? sortBy, SortDirection? sortDirection)
        {
            Name = name;
            IsActive = isActive;
            Limit = limit;
            Skip = skip;
            SortByColumn = sortBy;
            SortDirection = sortDirection;
        }

        public BaseFilter()
        {
            
        }

        public int GetPageNumber()
        {
            if (Skip.HasValue && Limit.HasValue)
            {
                return (Skip.Value / Limit.Value) + 1;
            }

            return 1;
        }

    }

    public enum SortDirection
    {
        ASC,
        DESC
    }
}
