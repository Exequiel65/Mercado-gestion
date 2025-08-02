using Application.Interfaces;

namespace Application.Store
{
    public class StoreService
    {
        private readonly IBusinessManager _businessManager;
        private readonly IStoreManager _storeManager;

        public StoreService(IStoreManager storeManager, IBusinessManager businessManager)
        {
            _storeManager = storeManager ?? throw new ArgumentNullException(nameof(storeManager));
            _businessManager = businessManager ?? throw new ArgumentNullException(nameof(businessManager));
        }
        public async Task<List<Domain.Store.Store>> GetStoresAsync()
        {
            return await _storeManager.GetStoresAsync();
        }
        public async Task<List<Domain.Store.StoreSimpleReadDTO>> GetSimpleStoresAsync(string? userId)
        {
            return await _storeManager.GetSimpleStoreAsync(userId);
        }
        public async Task<Domain.Store.Store> GetStoreByIdAsync(int storeId)
        {
            return await _storeManager.GetStoreByIdAsync(storeId);
        }
        public async Task AddStoreAsync(Domain.Store.StoreWriteDto store)
        {
            var newStore = new Domain.Store.Store
            {
                Name = store.Name,
                Description = store.Description,
                Address = store.Address,
                PhoneNumber = store.PhoneNumber,
                Email = store.Email
            };
            var firstBusiness = (await _businessManager.GetBusinessByIdAsync());
            if (firstBusiness == null)
            {
                throw new InvalidOperationException("No businesses found to assign to the store.");
            }
            newStore.BusinessId = firstBusiness.Id;
            
            if (newStore == null) throw new ArgumentNullException(nameof(newStore));
            await _storeManager.AddStoreAsync(newStore);
        }
        public async Task UpdateStoreAsync(Domain.Store.Store store)
        {
            if (store == null) throw new ArgumentNullException(nameof(store));
            await _storeManager.UpdateStoreAsync(store);
        }

        public async Task DeleteStoreAsync(int storeId)
        {
            await _storeManager.DeleteStoreAsync(storeId);
        }
    }
}
