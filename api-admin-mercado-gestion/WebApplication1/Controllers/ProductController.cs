using Application.Common;
using Application.Products;
using Domain.Products.DTO;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "CanViewCommerce")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;
        private readonly IValidator<ProductWriteDTO> _productWriteValidator;
        public ProductController(ProductService productService, IValidator<ProductWriteDTO> validator)
        {
            _productService = productService ?? throw new ArgumentNullException(nameof(productService));
            _productWriteValidator = validator ?? throw new ArgumentNullException(nameof(validator));
        }

        [HttpPost("all")]
        public async Task<IActionResult> GetAllProducts([FromBody] ProductFilter? filter)
        {
            var products = await _productService.GetAllProductsAsync(filter);
            return Ok(ApiResponse<PaginationDTO<SimpleProductReadDTO>>.Ok(products));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
                return NotFound(ApiResponse<ProductReadDTO?>.Fail("product not found"));

            return Ok(ApiResponse<ProductReadDTO>.Ok(product));
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductWriteDTO model)
        {
            ValidationResult result = await _productWriteValidator.ValidateAsync(model);
            if (!result.IsValid)
            {
                return BadRequest(ApiResponse<List<ValidationFailure>>.Fail(result.Errors, "Invalid product data."));
            }

            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(System.Net.HttpStatusCode.Forbidden, "INVALID_USER", "Invalid user");
            }
            var createdProduct = await _productService.CreateProductAsync(model, userId);

            // Fix: Replace 'CreatedResult' with 'Created' method from ControllerBase
            return Created(string.Empty, ApiResponse<SimpleProductReadDTO>.Ok(createdProduct));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductWriteDTO model)
        {
            ValidationResult result = await _productWriteValidator.ValidateAsync(model);
            if (!result.IsValid)
            {
                return BadRequest(ApiResponse<List<ValidationFailure>>.Fail(result.Errors, "Invalid product data."));
            }


            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(System.Net.HttpStatusCode.Forbidden, "INVALID_USER", "Invalid user");
            }
            var updatedProduct = await _productService.UpdateProductAsync(model, userId);
            return Ok(ApiResponse<SimpleProductReadDTO>.Ok(updatedProduct));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(System.Net.HttpStatusCode.Forbidden, "INVALID_USER", "Invalid user");
            }
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
                return NotFound(ApiResponse<SimpleProductReadDTO?>.Fail("Product not found"));
            var result = await _productService.DeleteProductAsync(id, userId);
            if (!result)
                return BadRequest(ApiResponse<bool>.Fail("Failed to delete product"));
            return Ok(ApiResponse<bool>.Ok(result));
        }

        [HttpPost("quick-action/{id}")]
        public async Task<IActionResult> QuickAction(int id, [FromBody] QuickActionWriteDTO action)
        {
            if (action == null)
            {
                return BadRequest(ApiResponse<QuickActionWriteDTO>.Fail("Invalid action data."));
            }
            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(System.Net.HttpStatusCode.Forbidden, "INVALID_USER", "Invalid user");
            }
            var result = await _productService.QuickActionAsync(action, id, userId);
            return Ok(ApiResponse<bool>.Ok(result));
        }

        private string GetValue(string claim, string defaultValue = "") =>
           User.Claims
               .FirstOrDefault(x => x.Type.Equals(claim, StringComparison.OrdinalIgnoreCase))
               ?.Value ??
           defaultValue;
    }
}
