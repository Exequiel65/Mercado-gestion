using Application.Common;
using Application.WebConfig;
using Domain.Home.SectionHome;
using Domain.WebConfig;
using Domain.WebConfig.Config;
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
    [Authorize(Policy = "SuperAdminOnly")]
    public class WebConfigController : ControllerBase
    {
        private readonly WebConfigService _webConfigService;
        private readonly IValidator<TermsWriteDTO> _termsWriteValidator;
        private readonly IValidator<PolicyWriteDTO> _privacyWriteValidator;
        private readonly IValidator<FrequentlyQuestionWriteDTO> _frequentlyQuestionWriteValidator;
        private readonly IValidator<BannerDTO> _bannerValidator;
        private readonly IValidator<SectionDTO> _sectionValidator;
        private readonly IValidator<BannerGridDTO> _bannerGridValidator;

        public WebConfigController(WebConfigService webConfigService, IValidator<TermsWriteDTO> termsValidator, IValidator<PolicyWriteDTO> policyValidator, IValidator<FrequentlyQuestionWriteDTO> frequentlyQuestionWriteValidator, IValidator<BannerDTO> bannerValidator, IValidator<SectionDTO> sectionValidator, IValidator<BannerGridDTO> bannerGridValidator)
        {
            _webConfigService = webConfigService;
            _termsWriteValidator = termsValidator ?? throw new ArgumentNullException(nameof(termsValidator));
            _privacyWriteValidator = policyValidator ?? throw new ArgumentNullException(nameof(policyValidator));
            _frequentlyQuestionWriteValidator = frequentlyQuestionWriteValidator ?? throw new ArgumentNullException(nameof(frequentlyQuestionWriteValidator));
            _bannerValidator = bannerValidator;
            _sectionValidator = sectionValidator;
            _bannerGridValidator = bannerGridValidator;
        }

        [HttpGet("terms")]
        public async Task<IActionResult> GetTerms()
        {
            var terms = await _webConfigService.GetTermsAsync();
            if (terms == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "NOT_FOUND", "Terms not found");
            }
            return Ok(ApiResponse<TermsReadDTO>.Ok(terms));
        }

        [HttpPost("terms")]
        public async Task<IActionResult> AddTerms([FromBody] TermsWriteDTO termsModel)
        {
            ValidationResult result = await _termsWriteValidator.ValidateAsync(termsModel);
            if (!result.IsValid)
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "TERMS_MODEL_NOT_VALID", "Terms model is not valid.");
            }

            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(HttpStatusCode.Forbidden, "FORBIDDEN", "error");
            }

            var data = await _webConfigService.CreateOrUpdateTermsAsync(termsModel, userId);
            return Ok(ApiResponse<bool>.Ok(data));
        }

        [HttpGet("privacy-policy")]
        public async Task<IActionResult> GetPrivacyPolicy()
        {
            var policy = await _webConfigService.GetPolicyAsync();
            if (policy == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "NOT_FOUND", "Privacy policy not found");
            }
            return Ok(ApiResponse<PolicyReadDTO>.Ok(policy));
        }

        [HttpPost("privacy-policy")]
        public async Task<IActionResult> AddPrivacyPolicy([FromBody] PolicyWriteDTO policyModel)
        {
            ValidationResult result = await _privacyWriteValidator.ValidateAsync(policyModel);
            if (!result.IsValid)
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "PRIVACY_POLICY_MODEL_NOT_VALID", "Privacy policy model is not valid.");
            }
            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(HttpStatusCode.Forbidden, "FORBIDDEN", "error");
            }
            var data = await _webConfigService.CreateOrUpdatePolicyAsync(policyModel, userId);
            return Ok(ApiResponse<bool>.Ok(data));
        }

        [HttpGet("frequently-question")]
        public async Task<IActionResult> GetFrequentlyQuestion()
        {
            var frequentlyQuestion = await _webConfigService.GetFrequentlyQuestionAsync();
            if (frequentlyQuestion == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "NOT_FOUND", "Frequently asked questions not found");
            }
            return Ok(ApiResponse<FrequentlyQuestionReadDTO>.Ok(frequentlyQuestion));
        }
        [HttpPost("frequently-question")]
        public async Task<IActionResult> AddFrequentlyQuestion([FromBody] FrequentlyQuestionWriteDTO frequentlyQuestionModel)
        {
            ValidationResult result = await _frequentlyQuestionWriteValidator.ValidateAsync(frequentlyQuestionModel);
            if (!result.IsValid)
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "FREQUENTLY_QUESTION_MODEL_NOT_VALID", "Frequently question model is not valid.");
            }
            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(HttpStatusCode.Forbidden, "FORBIDDEN", "error");
            }
            var data = await _webConfigService.CreateOrUpdateFrequentlyQuestionAsync(frequentlyQuestionModel, userId);
            return Ok(ApiResponse<bool>.Ok(data));
        }

        [HttpGet()]
        public async Task<IActionResult> GetWebConfig()
        {
            var webConfig = await _webConfigService.GetWebConfigAsync();
            if (webConfig == null)
            {
                return Ok(ApiResponse<WebConfigReadDTO>.Ok(new WebConfigReadDTO()));
            }
            return Ok(ApiResponse<WebConfigReadDTO>.Ok(webConfig));
        }

        [HttpPost()]
        public async Task<IActionResult> AddWebConfig([FromBody] WebConfigWriteDTO webConfigModel)
        {
            if (webConfigModel == null)
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "WEB_CONFIG_MODEL_NOT_VALID", "Web config model is not valid.");
            }
            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(HttpStatusCode.Forbidden, "FORBIDDEN", "error");
            }
            var data = await _webConfigService.CreateOrUpdateWebConfigAsync(webConfigModel, userId);
            return Ok(ApiResponse<bool>.Ok(data));
        }

        [HttpGet("banner-grid")]
        public async Task<IActionResult> GetBannerGridDto()
        {
            var bannerGridDto = await _webConfigService.GetBannerGridAsync();
            if (bannerGridDto == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "NOT_FOUND", "Banner grid DTO not found");
            }
            return Ok(ApiResponse<BannerGridDTO>.Ok(bannerGridDto));
        }

        [HttpPost("banner-grid")]
        public async Task<IActionResult> AddBannerGridDto([FromBody] BannerGridDTO bannerGridModel)
        {
            ValidationResult result = await _bannerGridValidator.ValidateAsync(bannerGridModel);
            if (!result.IsValid)
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "BANNER_GRID_MODEL_NOT_VALID", "Banner grid model is not valid.");
            }
            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(HttpStatusCode.Forbidden, "FORBIDDEN", "error");
            }
            var data = await _webConfigService.CreateOrUpdateBannerGridAsync(bannerGridModel);
            return Ok(ApiResponse<BannerGridDTO>.Ok(data));
        }

        [HttpGet("banner")]
        public async Task<IActionResult> GetBanner()
        {
            var banners = await _webConfigService.GetBannersAsync();
            if (banners == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "NOT_FOUND", "Banner DTO not found");
            }
            return Ok(ApiResponse<List<BannerDTO>>.Ok(banners));
        }

        [HttpPost("banner")]
        public async Task<IActionResult> AddBannerDto([FromBody] List<BannerDTO> model)
        {
            foreach (var banner in model)
            {
                ValidationResult result = await _bannerValidator.ValidateAsync(banner);
                if (!result.IsValid)
                {
                    throw new ApiErrorException(HttpStatusCode.BadRequest, "BANNER_MODEL_NOT_VALID", "Banner model is not valid.");
                }
            }

            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(HttpStatusCode.Forbidden, "FORBIDDEN", "error");
            }

            var data = await _webConfigService.CreateOrUpdateBannerAsync(model);
            return Ok(ApiResponse<List<BannerDTO>>.Ok(data));
        }

        [HttpGet("section")]
        public async Task<IActionResult> GetSection()
        {
            var sections = await _webConfigService.GetSectionAsync();
            if (sections == null)
            {
                throw new ApiErrorException(HttpStatusCode.NotFound, "NOT_FOUND", "Section DTO not found");
            }
            return Ok(ApiResponse<List<SectionDTO>>.Ok(sections));
        }

        [HttpPost("section")]
        public async Task<IActionResult> AddSection([FromBody] List<SectionDTO> model)
        {
            foreach (var section in model)
            {
                ValidationResult result = await _sectionValidator.ValidateAsync(section);
                if (!result.IsValid)
                {
                    throw new ApiErrorException(HttpStatusCode.BadRequest, "SECTION_MODEL_NOT_VALID", "Section model is not valid.");
                }
            }

            var userId = GetValue(ClaimTypes.Sid);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ApiErrorException(HttpStatusCode.Forbidden, "FORBIDDEN", "error");
            }
            var data = await _webConfigService.CreateOrUpdateSectionsAsync(model);
            return Ok(ApiResponse<List<SectionDTO>>.Ok(data));
        }

        private string GetValue(string claim, string defaultValue = "") =>
           User.Claims
               .FirstOrDefault(x => x.Type.Equals(claim, StringComparison.OrdinalIgnoreCase))
               ?.Value ??
           defaultValue;

    }
}
