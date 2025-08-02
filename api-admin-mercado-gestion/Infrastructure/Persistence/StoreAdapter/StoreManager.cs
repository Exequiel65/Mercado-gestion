using Application.Interfaces;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.StoreAdapter
{
    public class StoreManager : IStoreManager
    {
        private readonly AppDbContext _context;
        public StoreManager(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<Domain.Store.Store>> GetStoresAsync()
        {
            return await _context.Stores
                .ToListAsync();
        }
        public async Task<List<Domain.Store.StoreSimpleReadDTO>> GetSimpleStoreAsync( string? userId)
        {
            ApplicationUser user = null;
            var stores = _context.Stores.AsQueryable();

            if (!string.IsNullOrEmpty(userId))
            {
                user = await _context.Users.Include(x => x.UserRoles).FirstOrDefaultAsync(x => x.Id == userId);
            }

            if (user != null && user.UserRoles.Any(x => x.Name == "superadmin" || x.Name == "admin"))
            {
                return await stores.Select(s => new Domain.Store.StoreSimpleReadDTO()
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description
                })
                .ToListAsync();
            }



            return await stores.Where(x => x.Id == user.StoreId).Select(s => new Domain.Store.StoreSimpleReadDTO()
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description
            })
                .ToListAsync();
        }

        public async Task<Domain.Store.Store> GetStoreByIdAsync(int storeId)
        {
            return await _context.Stores
                .FirstOrDefaultAsync(s => s.Id == storeId);
        }

        public async Task AddStoreAsync(Domain.Store.Store store)
        {
            if (store == null) throw new ArgumentNullException(nameof(store));
            _context.Stores.Add(store);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateStoreAsync(Domain.Store.Store store)
        {
            if (store == null) throw new ArgumentNullException(nameof(store));
            _context.Stores.Update(store);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStoreAsync(int storeId)
        {
            var store = await GetStoreByIdAsync(storeId);
            if (store == null) throw new KeyNotFoundException("Store not found");
            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Domain.Store.Store>> GetAllStoresAsync()
        {
            return await _context.Stores.ToListAsync();
        }
    }
}
