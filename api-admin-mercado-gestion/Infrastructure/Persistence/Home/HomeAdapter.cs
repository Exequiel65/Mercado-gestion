using Application.Interfaces;
using AutoMapper;
using Domain.Home;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Home
{
    public class HomeAdapter : IHomeAdapter
    {
        private readonly AppDbContext _context;
        public HomeAdapter(AppDbContext appDb)
        {
            _context = appDb ?? throw new ArgumentNullException(nameof(appDb), "AppDbContext cannot be null");
        }

        public async Task<HomeReadDTO> GetHomeDataAsync()
        {
            var products = await _context.Products
                .AsNoTracking()
                .Include(x => x.Images)
                .ToListAsync();

            var active = products.Count(p => p.IsActive);
            var disabled = products.Count(p => !p.IsActive);
            var lowStock = products.Count(p => p.Stock <= 5);
            var notImage = products.Count(p => p.Images == null || p.Images.Count == 0);
            var hasDiscount = products.Count(p => p.HasDiscount);

            return new HomeReadDTO
            {
                ActiveProducts = active,
                DisabledProducts = disabled,
                LowStockProducts = lowStock,
                ProductsWithoutImages = notImage,
                ProductsWithDiscount = hasDiscount
            };
        }

        public enum AnaliticsType
        {
            ACTIVE,
            DISABLED,
            LOW_STOCK,
            NOT_IMAGE,
            HAS_DISCOUNT
        }
    }
}
