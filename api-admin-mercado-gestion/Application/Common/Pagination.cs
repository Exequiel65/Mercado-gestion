namespace Application.Common
{
    public class PaginationDTO<T>
    {
        public PaginationDTO()
        {
        }

        public PaginationDTO(int totalCount, int pageSize, int pageNumber, List<T> items)
        {
            TotalCount = totalCount;
            PageSize = pageSize;
            PageNumber = pageNumber;
            Items = items ?? new List<T>();
        }

        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public List<T> Items { get; set; }
    }
}
