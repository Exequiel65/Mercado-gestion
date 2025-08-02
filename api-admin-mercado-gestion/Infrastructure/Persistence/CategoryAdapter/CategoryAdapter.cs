using Application.Common;
using Application.Interfaces;
using AutoMapper;
using Domain.Categories;
using Domain.Categories.DTO;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.CategoryAdapter
{
    public class CategoryAdapter : ICategoryAdapter
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public CategoryAdapter(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<Category>> GetCategories()
        {
            var categories = await _context.Categories.AsNoTracking()
                .Include(x => x.SubCategories)
                .ThenInclude(x => x.ChildCategories)
                .ToListAsync();

            return categories;
        }

        public async Task<Category> CreateOrUpdate(CategoryWriteDTO model)
        {
            if (model.Id.HasValue && model.Id.Value > 0)
            {
                return await UpdateCategory(model);
            }
            else
            {
                return await CreateCategory(model);
            }
        }

        internal async Task<Category> CreateCategory(CategoryWriteDTO model)
        {
            var category = _mapper.Map<Category>(model);

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        internal async Task<Category> UpdateCategory(CategoryWriteDTO model)
        {
            var category = await _context.Categories
                .Include(x => x.SubCategories)
                .ThenInclude(x => x.ChildCategories)
                .FirstOrDefaultAsync(x => x.Id == model.Id.Value);

            if (category is null)
            {
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "Category not found", "Category not found");
            }

            _mapper.Map(model, category);
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }

    }
}
