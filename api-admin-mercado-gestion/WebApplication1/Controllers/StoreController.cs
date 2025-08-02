using Application.Common;
using Domain.Store;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "CanViewCommerce")]
    public class StoreController : ControllerBase
    {
        private readonly Application.Store.StoreService _storeService;
        private readonly IValidator<StoreWriteDto> _storeWriteValidator;
        public StoreController(Application.Store.StoreService storeService, IValidator<StoreWriteDto> validator)
        {
            _storeService = storeService ?? throw new ArgumentNullException(nameof(storeService));
            _storeWriteValidator = validator ?? throw new ArgumentNullException(nameof(validator));
        }

        [HttpGet()]
        public async Task<IActionResult> GetStores()
        {
            var userId = this.GetValue(ClaimTypes.Sid);
            var stores = await _storeService.GetSimpleStoresAsync(userId);
            return Ok(stores);

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStoreById(int id)
        {
            try
            {
                var store = await _storeService.GetStoreByIdAsync(id);
                if (store == null)
                {
                    return NotFound($"Store with ID {id} not found.");
                }
                return Ok(store);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Authorize(Policy = "SuperAdminOnly")]
        public async Task<IActionResult> AddStore([FromBody] StoreWriteDto storeModel)
        {

            ValidationResult result = await _storeWriteValidator.ValidateAsync(storeModel);
            if (!result.IsValid)
            {
                throw new ApiErrorException(((int)HttpStatusCode.NotFound), "STORE_MODEL_NOT_NULL", "Store model cannot be null.");
            }
            await _storeService.AddStoreAsync(storeModel);
            return Ok(ApiResponse<bool>.Ok(true));

        }

        [HttpPut("{id}")]
        [Authorize(Policy = "SuperAdminOnly")]
        public async Task<IActionResult> UpdateStore(int id, [FromBody] Domain.Store.Store storeModel)
        {
            try
            {
                if (storeModel == null || storeModel.Id != id)
                {
                    return BadRequest("Store model is invalid.");
                }
                await _storeService.UpdateStoreAsync(storeModel);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "SuperAdminOnly")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            try
            {
                await _storeService.DeleteStoreAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound($"Store with ID {id} not found.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        private string GetValue(string claim, string defaultValue = "") =>
           User.Claims
               .FirstOrDefault(x => x.Type.Equals(claim, StringComparison.OrdinalIgnoreCase))
               ?.Value ??
           defaultValue;
    }
}
