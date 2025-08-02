using Application.Common;
using Application.Interfaces;
using Domain.Home;

namespace Application.Home
{
    public class HomeService
    {
        private readonly IHomeAdapter _homeAdapter;

        public HomeService(IHomeAdapter homeAdapter)
        {
            _homeAdapter = homeAdapter;
        }

        public async Task<HomeReadDTO> GetHomeDataAsync()
        {
            var homeData = await _homeAdapter.GetHomeDataAsync();
            if (homeData == null)
            {
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "Home data not found", "Home data not found");
            }
            return homeData;
        }
    }
}
