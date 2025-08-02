using Application.Interfaces;
using Domain.Home.SectionHome;
using Domain.WebConfig;
using Domain.WebConfig.Config;
using Microsoft.Extensions.Configuration;
using System.Reflection;

namespace Application.WebConfig
{
    public class WebConfigService
    {
        private readonly IWebConfigAdapter _webConfigAdapter;
        private readonly IConfiguration _configuration;
        private readonly IEntityAdapter _entityAdapter;
        private readonly IStorageService _storageService;
        private readonly ICategoryAdapter _categoryAdapter;
        public WebConfigService(IWebConfigAdapter webConfigAdapter, IConfiguration configuration, IEntityAdapter entityAdapter, IStorageService storageService, ICategoryAdapter categoryAdapter)
        {
            _webConfigAdapter = webConfigAdapter ?? throw new ArgumentNullException(nameof(webConfigAdapter));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _entityAdapter = entityAdapter ?? throw new ArgumentNullException(nameof(entityAdapter));
            _categoryAdapter = categoryAdapter ?? throw new ArgumentNullException(nameof(categoryAdapter));
            _storageService = storageService;
        }

        public async Task<TermsReadDTO> GetTermsAsync()
        {
            return await _webConfigAdapter.GetTerms();
        }
        public async Task<PolicyReadDTO> GetPolicyAsync()
        {
            return await _webConfigAdapter.GetPolicy();
        }

        public async Task<FrequentlyQuestionReadDTO> GetFrequentlyQuestionAsync()
        {
            return await _webConfigAdapter.GetFrequentlyQuestion();
        }

        public async Task<bool> CreateOrUpdateFrequentlyQuestionAsync(FrequentlyQuestionWriteDTO frequentlyQuestion, string UpdateUserById)
        {
            if (frequentlyQuestion == null) throw new ArgumentNullException(nameof(frequentlyQuestion));
            return await _webConfigAdapter.CreateOrUpdateFrequentlyQuestion(frequentlyQuestion, UpdateUserById);
        }
        public async Task<bool> CreateOrUpdateTermsAsync(TermsWriteDTO terms, string UpdateUserById)
        {
            if (terms == null) throw new ArgumentNullException(nameof(terms));
            return await _webConfigAdapter.CreateOrUpdateTerms(terms, UpdateUserById);
        }
        public async Task<bool> CreateOrUpdatePolicyAsync(PolicyWriteDTO policy, string UpdateUserById)
        {
            if (policy == null) throw new ArgumentNullException(nameof(policy));
            return await _webConfigAdapter.CreateOrUpdatePolicy(policy, UpdateUserById);
        }

        public async Task<WebConfigReadDTO> GetWebConfigAsync()
        {
            return await _webConfigAdapter.GetWebConfig();
        }

        public async Task<bool> CreateOrUpdateWebConfigAsync(WebConfigWriteDTO webConfig, string UpdateUserById)
        {
            if (webConfig == null) throw new ArgumentNullException(nameof(webConfig));
            return await _webConfigAdapter.CreateOrUpdateWebConfig(webConfig, UpdateUserById);
        }

        public async Task<BannerGridDTO> GetBannerGridAsync()
        {
            return await _webConfigAdapter.GetBannerGridDTO();
        }
        public async Task<BannerGridDTO> CreateOrUpdateBannerGridAsync(BannerGridDTO model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model), "Model cannot be null or empty");

            var entityName = await _entityAdapter.GetEntityName();
            var endpoint = _configuration["StorageSettings:Cdn"]?.TrimEnd('/');
            var bucketName = _configuration["StorageSettings:BucketName"];
            var baseUrl = $"{endpoint}/{bucketName}";


            foreach (var item in model.Items)
            {
                item.Image = await _storageService.ProcessImageUrl(baseUrl, item.Image, entityName.Replace(" ", ""));
            }

            return await _webConfigAdapter.CreateOrUpdateBannerGridAsync(model);
        }

        public async Task<List<BannerDTO>> GetBannersAsync()
        {
            var banners = await _webConfigAdapter.GetBannersAsync();
            return banners;
        }
        public async Task<List<BannerDTO>> CreateOrUpdateBannerAsync(List<BannerDTO> banners)
        {

            var entityName = await _entityAdapter.GetEntityName();
            var endpoint = _configuration["StorageSettings:Cdn"]?.TrimEnd('/');
            var bucketName = _configuration["StorageSettings:BucketName"];
            var baseUrl = $"{endpoint}/{bucketName}";
            foreach (var item in banners)
            {
                item.sm = await _storageService.ProcessImageUrl(baseUrl, item.sm, entityName.Replace(" ", ""));
                item.xl = await _storageService.ProcessImageUrl(baseUrl, item.xl, entityName.Replace(" ", ""));
                item.md = await _storageService.ProcessImageUrl(baseUrl, item.md, entityName.Replace(" ", ""));
            }

            var result = await _webConfigAdapter.CreateOrUpdateBannerAsync(banners);
            return result;
        }

        public async Task<List<SectionDTO>> GetSectionAsync()
        {
            var sections = await _webConfigAdapter.GetSectionsAsync();
            return sections;
        }

        public async Task<List<SectionDTO>> CreateOrUpdateSectionsAsync(List<SectionDTO> sections)
        {
            var categories = await _categoryAdapter.GetCategories();
            sections.ForEach(async x =>
            {
                if (x.OptionSection != null)
                {
                    x.Button.Path = await this.CreatePathStringAsync(x.OptionSection, categories);
                }
            });
            var result = await _webConfigAdapter.CreateOrUpdateSectionsAsync(sections);
            return result;
        }

        internal async Task<string> CreatePathStringAsync(OptionSectionDTO option, List<Domain.Categories.Category> categories = null)
        {
            var queryParams = new List<string>();

            if (categories != null)
            {
                if (option.CategoryId.HasValue)
                {
                    var category = categories.FirstOrDefault(x => x.Id == option.CategoryId);
                    if (category != null)
                        queryParams.Add($"category={Uri.EscapeDataString(category.Name)}");
                }

                if (option.SubCategoryId.HasValue)
                {
                    var category = categories.FirstOrDefault(x => x.Id == option.CategoryId);
                    var subCategory = category?.SubCategories.FirstOrDefault(x => x.Id == option.SubCategoryId);
                    if (subCategory != null)
                        queryParams.Add($"sub={Uri.EscapeDataString(subCategory.Name)}");
                }

                if (option.ChildCategoryId.HasValue)
                {
                    var category = categories.FirstOrDefault(x => x.Id == option.CategoryId);
                    var subCategory = category?.SubCategories.FirstOrDefault(x => x.Id == option.SubCategoryId);
                    var childCategory = subCategory?.ChildCategories.FirstOrDefault(x => x.Id == option.ChildCategoryId);
                    if (childCategory != null)
                        queryParams.Add($"child={Uri.EscapeDataString(childCategory.Name)}");
                }
            }

            if (option.HasDiscount.HasValue)
                queryParams.Add($"hasDiscount={option.HasDiscount.Value.ToString().ToLower()}");

            if (option.toDiscount.HasValue)
                queryParams.Add($"discount={option.toDiscount}");

            if (option.IsFeatured.HasValue)
                queryParams.Add($"onlyFeatured={option.IsFeatured.Value.ToString().ToLower()}");

            var queryString = string.Join("&", queryParams);
            return $"/products?{queryString}";
        }
    }
}
