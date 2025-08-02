using Domain.Store;
using FluentValidation;

namespace Application.Store
{
    public class StoreWriteValidator : AbstractValidator<StoreWriteDto>
    {
        public StoreWriteValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
            RuleFor(x => x.Description).MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");
            RuleFor(x => x.Address).MaximumLength(200).WithMessage("Address cannot exceed 200 characters.");
            RuleFor(x => x.PhoneNumber).Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone number is not valid.");
            RuleFor(x => x.Email).EmailAddress().WithMessage("Email is not valid.")
                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters.");
        }
    }
}
