using Domain.Categories.DTO;
using FluentValidation;

namespace Application.Categories
{
    public class CategoryValidator : AbstractValidator<CategoryWriteDTO>
    {
        public CategoryValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
            RuleForEach(x => x.SubCategories).SetValidator(new SubCategoryValidator());
        }
    }

    public class SubCategoryValidator : AbstractValidator<SubCategoryWrite>
    {
        public SubCategoryValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
            RuleForEach(x => x.ChildCategories).SetValidator(new ChildCategoryValidator());
        }
    }

    public class ChildCategoryValidator : AbstractValidator<ChildCategoryWrite>
    {
        public ChildCategoryValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
        }
    }
}
