using Amazon.S3;
using Application.Interfaces;
using Infrastructure.Authentication;
using Infrastructure.Authentication.Tenant;
using Infrastructure.AWS.s3;
using Infrastructure.Identity;
using Infrastructure.Mapper;
using Infrastructure.Persistence;
using Infrastructure.Persistence.BusinessAdapters;
using Infrastructure.Persistence.CategoryAdapter;
using Infrastructure.Persistence.Home;
using Infrastructure.Persistence.ProductAdapter;
using Infrastructure.Persistence.StoreAdapter;
using Infrastructure.Persistence.UserAdapters;
using Infrastructure.Persistence.WebConfigAdapter;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration _config)
        {
            services.AddDataContextUnfiltered(_config);
            services.AddDataContext(_config);
            services.AddExtensionIndentity();
            services.AddAuthenticationExtension(_config);
            services.AddAWSS3(_config);
            services.AddScoped<IJwtCreator, JWTCreator>();
            services.AddSingleton(
                new JwtConfig(
                    _config.GetValue<string>("Auth:Private"),
                    _config.GetValue<string>("Auth:Audience"),
                    _config.GetValue<string>("Auth:Issuer")));
            services.AddScoped<IAccountManager, AccountManager>();
            services.AddScoped<IUserManagerAdapter, UserManagerAdapter>();
            services.AddHttpContextAccessor();
            services.AddScoped<IEntityContextProvider, EntityContextProvider>();
            services.AddScoped<IBusinessManager, BusinessManagerAdapter>();
            services.AddScoped<IStoreManager, StoreManager>();
            services.AddScoped<IEntityAdapter, Persistence.Entity.EntityAdapter>();
            services.AddScoped<IWebConfigAdapter, WebConfigAdapter>();
            services.AddScoped<ICategoryAdapter, CategoryAdapter>();
            services.AddScoped<IProductAdapter, ProductAdapter>();
            services.AddScoped<IHomeAdapter, HomeAdapter>();

            services.AddAutoMapperExtension();
            return services;
        }
        public static IServiceCollection AddDataContext(this IServiceCollection services, IConfiguration _config)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(_config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }

        public static IServiceCollection AddDataContextUnfiltered(this IServiceCollection services, IConfiguration _config)
        {
            services.AddDbContext<AppContexUnfiltered>(options =>
            {
                options.UseSqlServer(_config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
        public static IServiceCollection AddExtensionIndentity(this IServiceCollection services)
        {
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+|";
            });

            return services;
        }

        public static IServiceCollection AddAutoMapperExtension(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(AutoMap));
            return services;
        }

        public static IServiceCollection AddAuthenticationExtension(this IServiceCollection services, IConfiguration _config)
        {
            services.AddAuthentication(
                options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                }
            )
            .AddJwtBearer(jwt =>
            {
                //jwt.Events = new JwtBearerEvents
                //{
                //    OnMessageReceived = context =>
                //    {
                //        if (context.Request.Headers.ContainsKey("Authorization"))
                //        {
                //            var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                //            context.Token = token;
                //        }
                //        throw new Exception(context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "")); ;
                //    },
                //    OnAuthenticationFailed = context =>
                //    {
                //        Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                //        throw new Exception(context.Exception.Message);
                //    },
                //    OnTokenValidated = context =>
                //    {
                //        Console.WriteLine("Token validated");
                //        throw new Exception("Token validated");
                //    },
                //    OnChallenge = context =>
                //    {
                //        Console.WriteLine("Token challenge triggered");
                //        throw new Exception("Token validated");
                //    }
                //};
                var pubKey = _config.GetValue<string>("Auth:Public");
                var rsa = RSA.Create();
                var pubKeyByteArray = Convert.FromBase64String(pubKey);
                rsa.ImportRSAPublicKey(pubKeyByteArray, out _);
                jwt.SaveToken = true;
                jwt.RequireHttpsMetadata = false;
                jwt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = _config.GetValue<string>("Auth:Audience"),
                    ValidIssuer = _config.GetValue<string>("Auth:Issuer"),
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new RsaSecurityKey(rsa),
                    CryptoProviderFactory = new CryptoProviderFactory
                    {
                        CacheSignatureProviders = false
                    }
                };
            });
            return services;
        }

        public static IServiceCollection AddAWSS3(this IServiceCollection services, IConfiguration _config)
        {
            services.Configure<StorageSettings>(_config.GetSection("StorageSettings"));
            services.AddSingleton<IAmazonS3>(sp =>
            {
                var config = sp.GetRequiredService<IOptions<StorageSettings>>().Value;
                var s3Config = new AmazonS3Config
                {
                    ForcePathStyle = true,
                    ServiceURL = config.Endpoint,
                    UseHttp = !config.UseSsl
                };
                return new AmazonS3Client(config.AccessKey, config.SecretKey, s3Config);
            });

            services.AddScoped<IStorageService, StorageService>();
            return services;

        }
    }
}
