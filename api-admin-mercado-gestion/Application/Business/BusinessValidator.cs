using Application.Helpers;
using Domain.Business.DTOs;
using FluentValidation;

namespace Application.Business
{
    public class BusinessValidator :AbstractValidator<BusinessWrite>
    {
        public BusinessValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.")
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");
            RuleFor(x => x.Address).NotEmpty().WithMessage("Address is required.")
                .MaximumLength(200).WithMessage("Address cannot exceed 200 characters.");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");
            RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("Phone number is required.")
                .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Invalid phone number format.");
            RuleFor(x => x.LogoUrl).Cascade(CascadeMode.Stop)
                 .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                      .WithMessage("Picture must be a valid URL or a base64 image string starting with 'data:image'.")

                 .Must(x => string.IsNullOrEmpty(x) || (x.StartsWith("data:image") && x.ValidateImageFormat()))
                     .When(x => !string.IsNullOrEmpty(x.LogoUrl) && x.LogoUrl.StartsWith("data:image"))
                     .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");
            RuleFor(x => x.IconUrl).Cascade(CascadeMode.Stop)
                 .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                      .WithMessage("Picture must be a valid URL or a base64 image string starting with 'data:image'.")

                 .Must(x => string.IsNullOrEmpty(x) || (x.StartsWith("data:image") && x.ValidateImageFormat()))
                     .When(x => !string.IsNullOrEmpty(x.IconUrl) && x.IconUrl.StartsWith("data:image"))
                     .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");
            RuleFor(x => x.LegendUrl).Cascade(CascadeMode.Stop)
                 .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                      .WithMessage("Picture must be a valid URL or a base64 image string starting with 'data:image'.")

                 .Must(x => string.IsNullOrEmpty(x) || (x.StartsWith("data:image") && x.ValidateImageFormat()))
                     .When(x => !string.IsNullOrEmpty(x.LegendUrl) && x.LegendUrl.StartsWith("data:image"))
                     .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");
            RuleFor(x => x.GoogleMapsUrl).Must(url => Uri.IsWellFormedUriString(url, UriKind.Absolute)).When(x => !string.IsNullOrEmpty(x.GoogleMapsUrl));
            RuleFor(x => x.SocialMedia).SetValidator(new SocialMediaWriteValidator()).When(x => x.SocialMedia != null);
        }
    }

    public class SocialMediaWriteValidator : AbstractValidator<SocialMediaWrite>
    {
        public SocialMediaWriteValidator()
        {
            RuleFor(x => x.Facebook).Must(url => Uri.IsWellFormedUriString(url, UriKind.Absolute)).When(x => !string.IsNullOrEmpty(x.Facebook))
                .WithMessage("Facebook URL must be a valid absolute URL.");
            RuleFor(x => x.Twitter).Must(url => Uri.IsWellFormedUriString(url, UriKind.Absolute)).When(x => !string.IsNullOrEmpty(x.Twitter))
                .WithMessage("Twitter URL must be a valid absolute URL.");
            RuleFor(x => x.Instagram).Must(url => Uri.IsWellFormedUriString(url, UriKind.Absolute)).When(x => !string.IsNullOrEmpty(x.Instagram))
                .WithMessage("Instagram URL must be a valid absolute URL.");
        }
    }
}
