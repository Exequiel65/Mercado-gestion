using Application.Business;
using Application.Categories;
using Application.Home;
using Application.Products;
using Application.Store;
using Application.Users;
using Application.WebConfig;
using Domain.Business.DTOs;
using Domain.Categories.DTO;
using Domain.Home.SectionHome;
using Domain.Products.DTO;
using Domain.Store;
using Domain.User;
using Domain.WebConfig;
using Domain.WebConfig.Config;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationExtension(this IServiceCollection services, IConfiguration _config)
        {
            services.AddScoped<AuthUserService>();
            services.AddScoped<StoreService>();
            services.AddScoped<UserService>();
            services.AddScoped<BusinessService>();
            services.AddScoped<WebConfigService>();
            services.AddScoped<CategoryService>();
            services.AddScoped<ProductService>();
            services.AddScoped<HomeService>();
            services.AddScoped<IValidator<StoreWriteDto>, StoreWriteValidator>();
            services.AddScoped<IValidator<CreateUserDTO>, CreateUserValidator>();
            services.AddScoped<IValidator<UpdateUserDTO>, UpdateUserValidator>();
            services.AddScoped<IValidator<PolicyWriteDTO>, PolicyWriteValidator>();
            services.AddScoped<IValidator<TermsWriteDTO>, TermsWriteValidator>();
            services.AddScoped<IValidator<FrequentlyQuestionWriteDTO>, FrequentlyQuestionValidator>();
            services.AddScoped<IValidator<WebConfigWriteDTO>, WebConfigValidator>();
            services.AddScoped<IValidator<CategoryWriteDTO>, CategoryValidator>();
            services.AddScoped<IValidator<ProductWriteDTO>, ProductWriteValidator>();
            services.AddScoped<IValidator<BusinessWrite>, BusinessValidator>();
            services.AddScoped<IValidator<BannerDTO>, BannerValidator>();
            services.AddScoped<IValidator<BannerGridDTO>, BannerGridValidator>();
            services.AddScoped<IValidator<SectionDTO>, SectionValidator>();

            return services;
        }
    }
}
