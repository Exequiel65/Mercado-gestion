using Domain.WebConfig;
using FluentValidation;

namespace Application.WebConfig
{
    public class PolicyWriteValidator: AbstractValidator<PolicyWriteDTO>
    {
        public PolicyWriteValidator()
        {
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(5000).WithMessage("Description cannot exceed 5000 characters.");
        }
    }
}
