using Application.Helpers;
using Domain.Products.DTO;
using FluentValidation;

namespace Application.Products
{
    public class ProductWriteValidator : AbstractValidator<ProductWriteDTO>
    {
        public ProductWriteValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(100).WithMessage("Product name cannot exceed 100 characters.");
            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Product price must be greater than zero.");
            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Product description cannot exceed 500 characters.");
            RuleFor(x => x.CategoryId)
                .NotNull().WithMessage("Category ID is required.");
            RuleFor(x => x.Stock)
                .GreaterThanOrEqualTo(0).WithMessage("Stock cannot be negative.");

            RuleFor(x => x.Images)
                .Cascade(CascadeMode.Stop);
                When(x => x.Images != null && x.Images.Any(), () =>
                {
                    RuleForEach(x => x.Images!)
                        .SetValidator(new MediaProductWriteValidator());
                });
        }
    }

    public class MediaProductWriteValidator : AbstractValidator<MediaProductWriteDTO>
    {
        public MediaProductWriteValidator()
        {
            RuleFor(x => x.MediaUrl)
                .NotEmpty().WithMessage("Image URL is required.")
                .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                      .WithMessage("Picture must be a valid URL or a base64 image string starting with 'data:image'.")
                .Must(x => string.IsNullOrEmpty(x) || (x.StartsWith("data:image") && x.ValidateImageFormat()))
                     .When(x => !string.IsNullOrEmpty(x.MediaUrl) && x.MediaUrl.StartsWith("data:image"))
                     .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");
        }
    }
}
