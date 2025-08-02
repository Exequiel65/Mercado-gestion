using Application.Business;
using Application.Common;
using Domain.Business.DTOs;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "SuperAdminOnly")]
    public class BusinessController : ControllerBase
    {
        private readonly BusinessService _businessService;
        private readonly IValidator<Domain.Business.DTOs.BusinessWrite> _businessValidator;

        public BusinessController(BusinessService businessService, IValidator<BusinessWrite> validator)
        {
            _businessService = businessService ?? throw new ArgumentNullException(nameof(businessService));
            _businessValidator = validator ?? throw new ArgumentNullException(nameof(validator));
        }


        [HttpGet()]
        public async Task<IActionResult> GetBusinessByEntity()
        {

            var business = await _businessService.GetBusinessByEntity();
            if (business == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "BUSINESS_NOT_FOUND", "Business not found");
            }
            return Ok(ApiResponse<BusinessRead>.Ok(business));

        }

        [HttpPost]
        public async Task<IActionResult> AddBusiness([FromBody] Domain.Business.DTOs.BusinessWrite businessModel)
        {

            ValidationResult result = await _businessValidator.ValidateAsync(businessModel);
            if (!result.IsValid)
            {
                return BadRequest(ApiResponse<List<ValidationFailure>>.Fail(result.Errors, "Invalid business data."));
            }
            await _businessService.AddBusinessAsync(businessModel);
            return Ok(ApiResponse<bool>.Ok(true));


        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBusiness(int id, [FromBody] Domain.Business.DTOs.BusinessWrite business)
        {
            try
            {
                if (business == null)
                {
                    return BadRequest("Business model is invalid.");
                }
                await _businessService.UpdateBusinessAsync(id, business);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("validate")]
        public async Task<IActionResult> ValidateBusinessForActive()
        {

            var result = await _businessService.ValidateBusinessForActive();
            return Ok(ApiResponse<ValidateRead>.Ok(result));

        }
    }
}
