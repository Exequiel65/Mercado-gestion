using Application.Helpers;
using Domain.User;
using FluentValidation;

namespace Application.Users
{
    public class CreateUserValidator : AbstractValidator<CreateUserDTO>
    {
        public CreateUserValidator() 
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Email is not valid.")
                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters.");
            RuleFor(x => x.PhoneNumber).Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone number is not valid.")
                .MaximumLength(15).WithMessage("Phone number cannot exceed 15 characters.");
            RuleFor(x => x.UserName).MaximumLength(50).WithMessage("Username cannot exceed 50 characters.");
            RuleFor(x => x.Picture)
                 .Cascade(CascadeMode.Stop)
                 .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                      .WithMessage("Picture must be a valid URL or a base64 image string starting with 'data:image'.")

                 .Must(x => string.IsNullOrEmpty(x) || (x.StartsWith("data:image") && x.ValidateImageFormat()))
                     .When(x => !string.IsNullOrEmpty(x.Picture) && x.Picture.StartsWith("data:image"))
                     .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");
            RuleFor(x => x.DateOfBirth).LessThan(DateTime.Now).When(x => x.DateOfBirth.HasValue)
                .WithMessage("Date of birth must be in the past.");
        }
    }
    public class UpdateUserValidator : AbstractValidator<UpdateUserDTO>
    {
        public UpdateUserValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("User id is required");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Email is not valid.")
                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters.");
            RuleFor(x => x.PhoneNumber).Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone number is not valid.")
                .MaximumLength(15).WithMessage("Phone number cannot exceed 15 characters.");
            RuleFor(x => x.UserName).MaximumLength(50).WithMessage("Username cannot exceed 50 characters.");
            RuleFor(x => x.Picture)
                 .Cascade(CascadeMode.Stop)
                 .Must(x => string.IsNullOrEmpty(x) || x.IsUrl() || x.StartsWith("data:image"))
                      .WithMessage("Picture must be a valid URL or a base64 image string starting with 'data:image'.")

                 .Must(x => string.IsNullOrEmpty(x) || (x.StartsWith("data:image") && x.ValidateImageFormat()))
                     .When(x => !string.IsNullOrEmpty(x.Picture) && x.Picture.StartsWith("data:image"))
                     .WithMessage("Invalid image format. Allowed formats: jpg, jpeg, png, gif, bmp, ico, webp.");
            RuleFor(x => x.DateOfBirth).LessThan(DateTime.Now).When(x => x.DateOfBirth.HasValue)
                .WithMessage("Date of birth must be in the past.");
            RuleFor(X => X.Roles)
                .NotNull()
                .WithMessage("Roles is required")
                .NotEmpty()
                .WithMessage("Roles is required");
            RuleFor(x => x.IsActive).NotNull().WithMessage("IsActive is required");
            RuleFor(x => x.IsEnabled).NotNull().WithMessage("IsEnabled is required");
            RuleFor(x => x.IsDeleted).NotNull().WithMessage("IsDeleted is required");
        }
    }
}
