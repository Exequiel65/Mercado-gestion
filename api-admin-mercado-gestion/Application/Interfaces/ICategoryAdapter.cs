using Domain.Categories;
using Domain.Categories.DTO;

namespace Application.Interfaces
{
    public interface ICategoryAdapter
    {
        Task<List<Category>> GetCategories();
        Task<Category> CreateOrUpdate(CategoryWriteDTO model);
    }
}
