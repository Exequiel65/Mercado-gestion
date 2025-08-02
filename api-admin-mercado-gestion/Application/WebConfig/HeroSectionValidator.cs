using Application.Helpers;
using Domain.Home.SectionHome;
using FluentValidation;

namespace Application.WebConfig
{
    public class BannerValidator : AbstractValidator<BannerDTO>
    {
        public BannerValidator()
        {
            RuleFor(x => x.sm)
                 .Cascade(CascadeMode.Stop)
                 .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                      .WithMessage("Picture sm must be a valid URL or a base64 image string starting with 'data:image'.")

                 .Must(x => string.IsNullOrEmpty(x) || (x.StartsWith("data:image") && x.ValidateImageFormat()))
                     .When(x => !string.IsNullOrEmpty(x.sm) && x.sm.StartsWith("data:image"))
                     .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");
            RuleFor(x => x.xl)
              .Cascade(CascadeMode.Stop)
              .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                   .WithMessage("Picture xl must be a valid URL or a base64 image string starting with 'data:image'.")

              .Must(x => string.IsNullOrEmpty(x) || (x.StartsWith("data:image") && x.ValidateImageFormat()))
                  .When(x => !string.IsNullOrEmpty(x.xl) && x.xl.StartsWith("data:image"))
                  .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");
            RuleFor(x => x.md)
              .Cascade(CascadeMode.Stop)
              .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                   .WithMessage("Picture md must be a valid URL or a base64 image string starting with 'data:image'.")

              .Must(x => string.IsNullOrEmpty(x) || (x.StartsWith("data:image") && x.ValidateImageFormat()))
                  .When(x => !string.IsNullOrEmpty(x.md) && x.md.StartsWith("data:image"))
                  .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");


        }
    }

    public class BannerGridValidator : AbstractValidator<BannerGridDTO>
    {
        public BannerGridValidator()
        {

            //RuleFor(x => x.Items)
            //    .NotNull()
            //    .WithMessage("Items are required.")
            //    .Must(items => items.Any())
            //    .WithMessage("At least one item is required.");

                When(x => x.Items != null && x.Items.Count > 0, () =>
                {
                    RuleForEach(x => x.Items).SetValidator(new ItemBannerGridValidator());
                });
        }
    }

    public class ItemBannerGridValidator : AbstractValidator<ItemBannerGridDTO>
    {
        public ItemBannerGridValidator()
        {

            RuleFor(x => x.Subtitle)
                .MaximumLength(250)
                .When(x => !string.IsNullOrWhiteSpace(x.Subtitle))
                .WithMessage("Subtitle must be at most 250 characters.");

            RuleFor(x => x.Theme)
                .Must(theme => Enum.IsDefined(typeof(Theme), theme))
                .WithMessage("Theme must be a valid value from the Theme enum.");

            RuleFor(x => x.Priority)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Priority must be greater than or equal to 0.");

            RuleFor(x => x.Image)
                .NotEmpty()
                .WithMessage("Image is required.")
                .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                .WithMessage("Image must be a valid URL or a base64 image string starting with 'data:image'.");

            RuleFor(x => x.Image)
                .Must(x => x.StartsWith("data:image") && x.ValidateImageFormat())
                .When(x => !string.IsNullOrEmpty(x.Image) && x.Image.StartsWith("data:image"))
                .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");

            RuleFor(x => x.Button)
                .SetValidator(new ButtonValidator())
                .When(x => x.Button != null);
        }
    }


    public class ButtonValidator : AbstractValidator<ButtonReadDTO>
    {
        public ButtonValidator()
        {

            //RuleFor(x => x.Path)
            //    .NotEmpty()
            //    .WithMessage("Path must be a valid URL.");

            RuleFor(x => x.Position)
                .IsInEnum()
                .When(x => x.Position.HasValue)
                .WithMessage("Position must be a valid value from the ButtonPosition enum.");
        }
    }

    public class SectionValidator : AbstractValidator<SectionDTO>
    {
        public SectionValidator()
        {
            RuleFor(x => x.Button)
                   .Cascade(CascadeMode.Stop)
                     .SetValidator(new ButtonValidator())
                     .When(x => x.Button != null);

        }

    }
}
