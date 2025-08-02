using Application.Common;
using Domain.Products.DTO;

namespace Application.Interfaces
{
    public interface IProductAdapter
    {
        Task<(int, List<T>)> GetAllProductAsync<T>(ProductFilter filter);
        Task<T?> GetByIdAsync<T>(int id);
        Task<SimpleProductReadDTO> CreateProductAsync(ProductWriteDTO model, string userById);
        Task<SimpleProductReadDTO> UpdateProductAsync(ProductWriteDTO model, string userById);
        Task<bool> DeleteProductAsync(int id, string userById);
        Task<bool> QuickActionAsync(QuickActionWriteDTO action, int id, string byUserId);
    }
}
