namespace Application.Interfaces
{
    public interface IBusinessManager
    {
        Task<Domain.Business.DTOs.BusinessRead?> GetBusinessByIdAsync();
        Task<bool> ExistBusinessByIdAsync(int id);
        Task AddBusinessAsync(Domain.Business.DTOs.BusinessWrite businessModel);
        Task UpdateBusinessAsync(int id, Domain.Business.DTOs.BusinessWrite business);
        Task DeleteBusinessAsync(int id);
        Task<bool> AnyBusinessScope();
        Task GenerateDomain();
        Task<(bool, string)> ValidateBusinessForActive();
    }
}
