namespace Application.Interfaces
{
    public interface IStoreManager
    {
        Task<List<Domain.Store.Store>> GetStoresAsync();
        Task<List<Domain.Store.StoreSimpleReadDTO>> GetSimpleStoreAsync(string? userId);
        Task<Domain.Store.Store> GetStoreByIdAsync(int storeId);
        Task AddStoreAsync(Domain.Store.Store store);
        Task UpdateStoreAsync(Domain.Store.Store store);
        Task DeleteStoreAsync(int storeId);
        Task<List<Domain.Store.Store>> GetAllStoresAsync();
    }
}
