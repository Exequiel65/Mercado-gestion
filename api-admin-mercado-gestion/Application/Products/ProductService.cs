using Application.Common;
using Application.Interfaces;
using Domain.Products.DTO;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Net;

namespace Application.Products
{
    public class ProductService
    {
        private readonly IProductAdapter _productAdapter;
        private readonly IStorageService _storageService;
        private readonly IEntityAdapter _entityAdapter;
        private readonly IConfiguration _configuration;

        public ProductService(IProductAdapter productAdapter, IStorageService storageService, IEntityAdapter entityAdapter, IConfiguration configuration)
        {
            _productAdapter = productAdapter ?? throw new ArgumentNullException(nameof(productAdapter));
            _storageService = storageService ?? throw new ArgumentNullException(nameof(storageService));
            _entityAdapter = entityAdapter ?? throw new ArgumentNullException(nameof(entityAdapter));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(_configuration));
        }

        public async Task<PaginationDTO<SimpleProductReadDTO>> GetAllProductsAsync(ProductFilter filter)
        {
            var products = await _productAdapter.GetAllProductAsync<SimpleProductReadDTO>(filter);

            var result = new PaginationDTO<SimpleProductReadDTO>
            {
                TotalCount = products.Item1,
                PageNumber = filter != null ? filter.GetPageNumber() : 1,
                PageSize = filter != null && filter.Limit.HasValue ? filter.Limit.Value : products.Item1,
                Items = products.Item2 ?? new List<SimpleProductReadDTO>()
            };

            return result;
        }

        public async Task<ProductReadDTO?> GetProductByIdAsync(int id)
        {
            return await _productAdapter.GetByIdAsync<ProductReadDTO>(id);
        }

        public async Task<SimpleProductReadDTO> CreateProductAsync(ProductWriteDTO model, string userById)
        {
            if (model == null) throw new ApiErrorException(HttpStatusCode.BadRequest, "INVALID_MODEL", "Invalid product");
            if (string.IsNullOrEmpty(userById)) throw new ApiErrorException(HttpStatusCode.Forbidden, "INVALID_USER", "Invalid user");

            var images = model.Images?.Where(x => x != null).ToList();
            var entityName = await _entityAdapter.GetEntityName();
            images = await ProcessImages(images, entityName.Replace(" " , ""));

            return await _productAdapter.CreateProductAsync(model, userById);
        }

        public async Task<SimpleProductReadDTO> UpdateProductAsync(ProductWriteDTO model, string userById)
        {
            if (model == null) throw new ApiErrorException(HttpStatusCode.BadRequest, "INVALID_MODEL", "Invalid product");
            if (string.IsNullOrEmpty(userById)) throw new ApiErrorException(HttpStatusCode.Forbidden, "INVALID_USER", "Invalid user");
            var images = model.Images?.Where(x => x != null).ToList();
            var entityName = await _entityAdapter.GetEntityName();
            images = await ProcessImages(images, entityName.Replace(" ", ""));

            if (model.Stock <= 0 && !model.IsSoldOut)
            {
                model.IsSoldOut = true;
            }
            return await _productAdapter.UpdateProductAsync(model, userById);
        }

        public async Task<bool> DeleteProductAsync(int id, string userById)
        {
            if (string.IsNullOrEmpty(userById)) throw new ApiErrorException(HttpStatusCode.Forbidden, "INVALID_USER", "Invalid user");
            return await _productAdapter.DeleteProductAsync(id, userById);

        }

        public async Task<bool> QuickActionAsync(QuickActionWriteDTO action, int id, string byUserId)
        {
            if (string.IsNullOrEmpty(byUserId)) throw new ApiErrorException(HttpStatusCode.Forbidden, "INVALID_USER", "Invalid user");
            return await _productAdapter.QuickActionAsync(action, id, byUserId);
        }

        internal async Task<List<MediaProductWriteDTO>> ProcessImages(List<MediaProductWriteDTO> imageUrls, string folder)
        {
            if (imageUrls == null || imageUrls.Count == 0) return new List<MediaProductWriteDTO>();
            var endpoint = _configuration["StorageSettings:Cdn"]?.TrimEnd('/');
            var bucketName = _configuration["StorageSettings:BucketName"];
            var baseUrl = $"{endpoint}/{bucketName}";
            foreach (var imageUrl in imageUrls)
            {
                imageUrl.MediaUrl = await _storageService.ProcessImageUrl(baseUrl, imageUrl.MediaUrl, folder);
            }
            return imageUrls;
        }
    }
}
