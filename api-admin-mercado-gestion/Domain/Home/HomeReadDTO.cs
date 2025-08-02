namespace Domain.Home
{
    public class HomeReadDTO
    {
        public int ActiveProducts { get; set; }
        public int DisabledProducts { get; set; }
        public int LowStockProducts { get; set; }
        public int ProductsWithoutImages { get; set; }
        public int ProductsWithDiscount { get; set; }
    }
}
