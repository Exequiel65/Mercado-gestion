using Domain.Home;

namespace Application.Interfaces
{
    public interface IHomeAdapter
    {
        Task<HomeReadDTO> GetHomeDataAsync();
    }
}
