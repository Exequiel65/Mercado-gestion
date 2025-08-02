using Domain.WebConfig;
using FluentValidation;

namespace Application.WebConfig
{
    public class TermsWriteValidator: AbstractValidator<TermsWriteDTO>
    {
        public TermsWriteValidator()
        {
            RuleFor(x => x.Description)
               .NotEmpty().WithMessage("Description is required.")
               .MaximumLength(5000).WithMessage("Description cannot exceed 5000 characters.");
        }

    }
}
