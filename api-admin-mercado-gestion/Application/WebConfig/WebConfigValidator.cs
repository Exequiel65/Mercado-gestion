using Domain.WebConfig.Config;
using FluentValidation;

namespace Application.WebConfig
{
    public class WebConfigValidator : AbstractValidator<WebConfigWriteDTO>
    {
        public WebConfigValidator()
        {
            RuleFor(x => x.RedirectToWsp).NotNull().WithMessage("RedirectToWsp cannot be null.");
            RuleFor(x => x.HasPaymentMethod).NotNull().WithMessage("HasPaymentMethod cannot be null.");
            RuleFor(x => x.HasApplyCoupon).NotNull().WithMessage("HasApplyCoupon cannot be null.");
            RuleFor(x => x.EnabledShipping).NotNull().WithMessage("EnabledShipping cannot be null.");
            RuleFor(x => x.HasFreeShipping).NotNull().WithMessage("HasFreeShipping cannot be null.");
            RuleFor(x => x.FreeShippingAmount).GreaterThanOrEqualTo(0).WithMessage("FreeShippingAmount must be greater than or equal to 0.");
            RuleFor(x => x.TitleShipping).NotEmpty().WithMessage("TitleShipping cannot be empty.");
            RuleFor(x => x.DescriptionShipping).NotEmpty().WithMessage("DescriptionShipping cannot be empty.");
            RuleFor(x => x.EnabledDevolution).NotNull().WithMessage("EnabledDevolution cannot be null.");
            RuleFor(x => x.DevolutionDays).GreaterThan(0).WithMessage("DevolutionDays must be greater than 0.");
            RuleFor(x => x.TitleDevolution).NotEmpty().WithMessage("TitleDevolution cannot be empty.");
            RuleFor(x => x.DescriptionDevolution).NotEmpty().WithMessage("DescriptionDevolution cannot be empty.");
            RuleFor(x => x.HasSubscription).NotNull().WithMessage("HasSubscription cannot be null.");
            RuleFor(x => x.IsMaintenance).NotNull().WithMessage("IsMaintenance cannot be null.");
            RuleFor(x => x.EnabledWeb).NotNull().WithMessage("EnabledWeb cannot be null.");
        }
    }
    
}
