using Application.Interfaces;
using Domain.Categories;
using Domain.Categories.DTO;

namespace Application.Categories
{
    public class CategoryService
    {
        private readonly ICategoryAdapter _categoryAdapter;
        public CategoryService(ICategoryAdapter categoryAdapter)
        {
            _categoryAdapter = categoryAdapter;
        }
        public async Task<List<Category>> GetCategoriesAsync()
        {
            return await _categoryAdapter.GetCategories();
        }

        public async Task<Category> CreateOrUpdateCategoryAsync(CategoryWriteDTO model)
        {
            return await _categoryAdapter.CreateOrUpdate(model);
        }

    }
}
