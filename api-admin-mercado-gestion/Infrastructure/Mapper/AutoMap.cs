using Domain.User;
using AutoMapper;
using Infrastructure.Identity;
using Domain.Store;
using Microsoft.IdentityModel.Tokens;
using Domain.Business.DTOs;
using Domain.Business;
using Domain.WebConfig;
using Domain.WebConfig.Config;
using Domain.Categories;
using Domain.Categories.DTO;
using Domain.Products;
using Domain.Products.DTO;
using Domain.Home.SectionHome;

namespace Infrastructure.Mapper
{
    public class AutoMap : Profile
    {
        public AutoMap()
        {
            CreateMap<ApplicationUser, ApplicationUserDTO>()
                .ForMember(x => x.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(ur => new ApplicationRoleDTO
                {
                    Id = ur.Id,
                    Name = ur.Name,
                    Description = ur.Description,
                    CreatedBy = ur.CreatedBy,
                    UpdatedBy = ur.UpdatedBy,
                    PrettyName = ur.PrettyName,
                    Hierarchy = ur.Hierarchy,
                    CreatedDate = ur.CreatedDate,
                    UpdatedDate = ur.UpdatedDate,
                    NormalizedName = ur.NormalizedName
                })))
                .ForMember(dest => dest.Claims, opt => opt.MapFrom(src => src.Claims.Select(c => new UserClaimDTO
                {
                    ClaimType = c.ClaimType,
                    ClaimValue = c.ClaimValue
                })));
            CreateMap<ApplicationUserDTO, ApplicationUser>()
                .ForMember(dest => dest.UserRoles, opt => opt.Ignore())
                .ForMember(dest => dest.Claims, opt => opt.Ignore());
            CreateMap<ApplicationUser, SimpleApplicationUserDTO>()
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(ur => ur.Name)));

            CreateMap<UpdateUserDTO, ApplicationUserDTO>()
                .ForMember(dest => dest.Roles, opt => opt.Ignore());
            CreateMap<ApplicationRole, ApplicationRoleDTO>();

            CreateMap<Store, StoreReadDto>().ReverseMap();
            CreateMap<Store, StoreWriteDto>().ReverseMap();
            CreateMap<ApplicationRole, SimpleRoleReadDTO>();
            CreateMap<BusinessRead, Business>().ReverseMap();
            CreateMap<SocialMediaRead, SocialMedia>().ReverseMap();
            CreateMap<BusinessWrite, Business>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ReverseMap();
            CreateMap<SocialMediaWrite, SocialMedia>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ReverseMap();

            CreateMap<Terms, TermsReadDTO>().ReverseMap();
            CreateMap<Terms, TermsWriteDTO>().ReverseMap();
            CreateMap<Policy, PolicyReadDTO>().ReverseMap();
            CreateMap<Policy, PolicyWriteDTO>().ReverseMap();

            CreateMap<FrequentlyQuestion, FrequentlyQuestionReadDTO>().ReverseMap();
            CreateMap<FrequentlyQuestion, FrequentlyQuestionWriteDTO>().ReverseMap();

            CreateMap<Config, WebConfigReadDTO>()
                .ForMember(dest => dest.Cart, opt => opt.MapFrom(src => new CartReadDTO()
                {
                    HasApplyCoupon = src.HasApplyCoupon,
                    HasPaymentMethod = src.HasPaymentMethod,
                    RedirectToWsp = src.RedirectToWsp,
                }))
                .ForMember(dest => dest.Devolution, opt => opt.MapFrom(src => new DevolutionReadDTO()
                {
                    EnabledDevolution = src.EnabledDevolution,
                    DevolutionDays = src.DevolutionDays,
                    TitleDevolution = src.TitleDevolution,
                    DescriptionDevolution = src.DescriptionDevolution
                }))
                .ForMember(dest => dest.Shipping, opt => opt.MapFrom(src => new ShippingReadDTO()
                {
                    EnabledShipping = src.EnabledShipping,
                    HasFreeShipping = src.HasFreeShipping,
                    FreeShippingAmount = src.FreeShippingAmount,
                    TitleShipping = src.TitleShipping,
                    DescriptionShipping = src.DescriptionShipping
                }))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt))
                .ForMember(dest => dest.UpdateBy, opt => opt.MapFrom(src => src.UpdateBy))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.HasSubscription, opt => opt.MapFrom(src => src.HasSubscription))
                .ForMember(dest => dest.IsMaintenance, opt => opt.MapFrom(src => src.IsMaintenance))
                .ForMember(dest => dest.EnabledWeb, opt => opt.MapFrom(src => src.EnabledWeb))
                .ReverseMap();
            CreateMap<Config, WebConfigWriteDTO>().ReverseMap();

            CreateMap<Category, CategoryWriteDTO>().ReverseMap();
            CreateMap<SubCategory, SubCategoryWrite>().ReverseMap();
            CreateMap<ChildCategory, ChildCategoryWrite>().ReverseMap();

            CreateMap<Product, SimpleProductReadDTO>().ReverseMap();
            CreateMap<Product, ProductReadDTO>().ReverseMap();
            CreateMap<Product, ProductWriteDTO>().ReverseMap();

            CreateMap<MediaProduct, MediaProductReadDTO>().ReverseMap();
            CreateMap<MediaProduct, MediaProductWriteDTO>().ReverseMap();

            CreateMap<BannerGrid, BannerGridDTO>().ReverseMap();
            CreateMap<ItemBannerGrid, ItemBannerGridDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Subtitle, opt => opt.MapFrom(src => src.Subtitle))
                .ForMember(dest => dest.Theme, opt => opt.MapFrom(src => src.Theme))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority))
                .ForMember(dest => dest.BannerGridId, opt => opt.MapFrom(src => src.BannerGridId))
                .ForMember(dest => dest.Button, opt => opt.MapFrom(src => new ButtonReadDTO
                {
                    Text = src.TextButton,
                    Path = src.LinkButton
                }))
                .ReverseMap()
                .ForMember(dest => dest.TextButton, opt => opt.MapFrom(src => src.Button != null ? src.Button.Text : null))
                .ForMember(dest => dest.LinkButton, opt => opt.MapFrom(src => src.Button != null ? src.Button.Path : null));
            CreateMap<Section, SectionDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate))
                .ForMember(dest => dest.ShowButtonSlider, opt => opt.MapFrom(src => src.ShowButtonSlider))
                .ForMember(dest => dest.SecondLine, opt => opt.MapFrom(src => src.SecondLine))
                .ForMember(dest => dest.Button, opt => opt.MapFrom(src => new ButtonReadDTO
                {
                    Text = src.TextButton,
                    Path = src.LinkButton,
                    Position = src.PositionButton

                }))
                .ReverseMap()
                .ForMember(dest => dest.TextButton, opt => opt.MapFrom(src => src.Button != null ? src.Button.Text : null))
                .ForMember(dest => dest.PositionButton, opt => opt.MapFrom(src => src.Button != null ? src.Button.Position : null))
                .ForMember(dest => dest.LinkButton, opt => opt.MapFrom(src => src.Button != null ? src.Button.Path : null));

            CreateMap<Banner, BannerDTO>().ReverseMap();
        }
    }
}
