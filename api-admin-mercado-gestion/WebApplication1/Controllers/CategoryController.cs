using Application.Categories;
using Application.Common;
using Domain.Categories;
using Domain.Categories.DTO;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "CanViewCommerce")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;
        private readonly IValidator<CategoryWriteDTO> _categoryWriteValidator;

        public CategoryController(CategoryService categoryService, IValidator<CategoryWriteDTO> validator)
        {
            _categoryService = categoryService;
            _categoryWriteValidator = validator ?? throw new ArgumentNullException(nameof(validator));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetCategoriesAsync();
            return Ok(ApiResponse<List<Category>>.Ok(categories));
        }

        [HttpPost]
        [Authorize(Policy = "CanManageUsers")]
        public async Task<IActionResult> CreateOrUpdateCategory([FromBody] CategoryWriteDTO model)
        {
            ValidationResult result = await _categoryWriteValidator.ValidateAsync(model);
            if (!result.IsValid)
            {
                return BadRequest(ApiResponse<List<ValidationFailure>>.Fail(result.Errors, "Invalid category data."));
            }
            var category = await _categoryService.CreateOrUpdateCategoryAsync(model);
            return Ok(ApiResponse<Category>.Ok(category));
        }
    }
}
