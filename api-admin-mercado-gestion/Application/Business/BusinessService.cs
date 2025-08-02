using Application.Common;
using Application.Interfaces;
using Domain.Business;
using Domain.Business.DTOs;
using Microsoft.Extensions.Configuration;

namespace Application.Business
{
    public class BusinessService
    {
        private readonly IBusinessManager _businessManager;
        private readonly IStorageService _storageService;
        private readonly IEntityAdapter _entityAdapter;
        private readonly IConfiguration _configuration;
        public BusinessService(IBusinessManager businessManager, IStorageService storageService, IEntityAdapter entityAdapter, IConfiguration configuration)
        {
            _businessManager = businessManager ?? throw new ArgumentNullException(nameof(businessManager));
            _storageService = storageService;
            _entityAdapter = entityAdapter;
            _configuration = configuration;
        }

        public async Task<Domain.Business.DTOs.BusinessRead> GetBusinessByEntity()
        {
            var business = await _businessManager.GetBusinessByIdAsync();
            return business;
        }
        public async Task AddBusinessAsync(Domain.Business.DTOs.BusinessWrite businessModel)
        {
            var businessExists = await _businessManager.AnyBusinessScope();
            if (businessExists)
                throw new ApiErrorException(System.Net.HttpStatusCode.BadRequest, "BUSINESS_ALREADY_EXISTS", "Business already exists. Only one business is allowed.");

            var entityName = await _entityAdapter.GetEntityName();

            var endpoint = _configuration["StorageSettings:Cdn"]?.TrimEnd('/');
            var bucketName = _configuration["StorageSettings:BucketName"];
            var baseUrl = $"{endpoint}/{bucketName}";

            businessModel.IconUrl = await _storageService.ProcessImageUrl(baseUrl, businessModel.IconUrl, entityName.Replace(" ", ""));
            businessModel.LogoUrl = await _storageService.ProcessImageUrl(baseUrl, businessModel.LogoUrl, entityName.Replace(" ", ""));
            businessModel.LegendUrl = await _storageService.ProcessImageUrl(baseUrl, businessModel.LegendUrl, entityName.Replace(" ", ""));

            await _businessManager.AddBusinessAsync(businessModel);
            await _entityAdapter.Update(businessModel.Name.Trim());
            await _businessManager.GenerateDomain();
        }
        public async Task UpdateBusinessAsync(int id, Domain.Business.DTOs.BusinessWrite business)
        {
            var entityName = await _entityAdapter.GetEntityName();

            var businessExists = await _businessManager.ExistBusinessByIdAsync(id);
            if (!businessExists)
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "BUSINESS_NOT_FOUND", "Business not found or does not match the provided ID.");


            var endpoint = _configuration["StorageSettings:Cdn"]?.TrimEnd('/');
            var bucketName = _configuration["StorageSettings:BucketName"];
            var baseUrl = $"{endpoint}/{bucketName}";

            business.IconUrl = await _storageService.ProcessImageUrl(baseUrl, business.IconUrl, entityName.Replace(" ", ""));
            business.LogoUrl = await _storageService.ProcessImageUrl(baseUrl, business.LogoUrl, entityName.Replace(" ", ""));
            business.LegendUrl = await _storageService.ProcessImageUrl(baseUrl, business.LegendUrl, entityName.Replace(" ", ""));

            await _businessManager.UpdateBusinessAsync(id, business);
        }
        public async Task<ValidateRead> ValidateBusinessForActive()
        {
            var result = await _businessManager.ValidateBusinessForActive();
            return new ValidateRead(result.Item1, result.Item2);
        }
    }

}
