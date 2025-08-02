using Application.Common;
using Application.Interfaces;
using AutoMapper;
using Domain.Products;
using Domain.Products.DTO;
using Infrastructure.Helpers.Queries;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Infrastructure.Persistence.ProductAdapter
{
    
    public class ProductAdapter : IProductAdapter
    {

        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private const string Colacion = "SQL_Latin1_General_CP1_CI_AI";

        public ProductAdapter(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<(int, List<T>)> GetAllProductAsync<T>(ProductFilter filter)
        {
            var query = _context.Products
                .AsNoTracking()
                .Include(x => x.Images)
                .AsQueryable();
            var total = 0;
            if (filter == null)
            {
                total = await query.CountAsync();     
                var products = await query
                    .ToListAsync();
                return (total, _mapper.Map<List<T>>(products));
            }

            if (!string.IsNullOrEmpty(filter.Name))
            {
                query = query.Where(x => (
                    (x.Name != null && EF.Functions.Collate(x.Name, Colacion).Contains(filter.Name)) ||
                    (x.Description != null && EF.Functions.Collate(x.Description, Colacion).Contains(filter.Name))));
            }

            if (filter.IsActive.HasValue)
            {
                query = query.Where(x => x.IsActive == filter.IsActive.Value);
            }

            if (filter.IsDeleted.HasValue)
            {
                query = query.Where(x => x.IsDeleted == filter.IsDeleted.Value);
            }

            if (filter.CategoryId != null && filter.CategoryId.Count() > 0)
            {
                query = query.Where(x => x.CategoryId != null && filter.CategoryId.Contains(x.CategoryId ?? 0));
            }
            if (filter.SubCategoryId != null && filter.SubCategoryId.Count() > 0)
            {
                query = query.Where(x => x.SubCategoryId != null && filter.SubCategoryId.Contains(x.SubCategoryId ?? 0));
            }

            if (filter.ChildCategoryId != null && filter.ChildCategoryId.Count() > 0)
            {
                query = query.Where(x => x.ChildCategoryId != null && filter.ChildCategoryId.Contains(x.ChildCategoryId ?? 0));
            }

            if (filter.IsFeatured.HasValue)
            {
                query = query.Where(x => x.IsFeatured == filter.IsFeatured.Value);
            }

            if (filter.IsSoldOut.HasValue)
            {
                query = query.Where(x => x.IsSoldOut == filter.IsSoldOut.Value);
            }

            if (filter.HasDiscount.HasValue)
            {
                query = query.Where(x => x.HasDiscount == filter.HasDiscount.Value);
            }

            if (filter.AmountDiscount.HasValue)
            {
                query = query.Where(x => x.AmountDiscount == filter.AmountDiscount.Value);
            }

            total = await query.CountAsync();
            
            query = query.ApplyFilter(filter).ApplyPagination(filter);

            var filteredProducts = await query.Select(x => _mapper.Map<T>(x)).ToListAsync();
            return (total, filteredProducts);
        }

        public async Task<T?> GetByIdAsync<T>(int id)
        {
            var produt =  await _context.Products
                .Where(x => x.Id == id)
                .AsNoTracking()
                .Include(x => x.Images)
                .FirstOrDefaultAsync();

            if (produt == null)
                return default;

             return _mapper.Map<T>(produt);
        }

        public async Task<SimpleProductReadDTO> CreateProductAsync(ProductWriteDTO model, string userById)
        {
            var product = _mapper.Map<Product>(model);
            product.CreatedDate = DateTime.UtcNow;
            product.UpdatedDate = DateTime.UtcNow;
            product.CreatedBy = userById;
            product.IsActive = true;
            product.IsDeleted = false;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return _mapper.Map<SimpleProductReadDTO>(product);
        }

        public async Task<SimpleProductReadDTO> UpdateProductAsync(ProductWriteDTO model, string userById)
        {

            var existingProduct = await _context.Products
                .Where(x => x.Id == model.Id)
                .Include(x => x.Images)
                .FirstOrDefaultAsync();
            if (existingProduct == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound,"PRODUCT_NOT_FOUND", "Product not found.");
            }
            //if (existingProduct.IsDeleted)
            //{
            //    throw new ApiErrorException(HttpStatusCode.NotFound, "PRODUCT_DELETED", "Product has been deleted.");
            //}

            _mapper.Map(model, existingProduct);

            existingProduct.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return _mapper.Map<SimpleProductReadDTO>(existingProduct);
        }

        public async Task<bool> DeleteProductAsync(int id, string userById)
        {
            var product = await _context.Products
                .Where(x => !x.IsDeleted && x.Id == id)
                .FirstOrDefaultAsync();
            if (product == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "PRODUCT_NOT_FOUND", "Product not found.");
            }
            if (product.IsDeleted)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "PRODUCT_DELETED", "Product has been deleted.");
            }
            product.IsDeleted = true;
            product.DeletedDate = DateTime.UtcNow;
            product.DeletedBy = userById;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> QuickActionAsync(QuickActionWriteDTO action, int id, string byUserId)
        {
            var product = await _context.Products
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
            if (product == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "PRODUCT_NOT_FOUND", "Product not found.");
            }

            switch (action.Action)
            {
                case QuickActionType.FEATURED:
                    product.IsFeatured = true;
                    break;
                case QuickActionType.SOLDOUT:
                    product.IsSoldOut = true;
                    break;
                case QuickActionType.NOT_DISCOUNT:
                    product.HasDiscount = false;
                    break;
                case QuickActionType.ACTIVE:
                    product.IsActive = true;
                    break;
                case QuickActionType.DISABLED:
                    product.IsActive = false;
                    break;
                default:
                    throw new ApiErrorException(HttpStatusCode.BadRequest, "INVALID_ACTION", "Invalid quick action.");
            }

            product.UpdatedDate = DateTime.UtcNow;
            product.UpdatedBy = byUserId;
            _context.Products.Update(product);
            var result = await _context.SaveChangesAsync();
            if (result <= 0)
            {
                throw new ApiErrorException(HttpStatusCode.InternalServerError, "UPDATE_FAILED", "Failed to update product quick action.");
            }
            return true;

        }

    }
}
