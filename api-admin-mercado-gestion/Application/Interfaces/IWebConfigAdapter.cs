using Domain.Home.SectionHome;
using Domain.WebConfig;
using Domain.WebConfig.Config;

namespace Application.Interfaces
{
    public interface IWebConfigAdapter
    {
        Task<TermsReadDTO> GetTerms();
        Task<PolicyReadDTO> GetPolicy();
        Task<FrequentlyQuestionReadDTO> GetFrequentlyQuestion();
        Task<WebConfigReadDTO> GetWebConfig();
        Task<bool> CreateOrUpdateTerms(TermsWriteDTO terms, string UpdateUserById);
        Task<bool> CreateOrUpdatePolicy(PolicyWriteDTO policy, string UpdateUserById);
        Task<bool> CreateOrUpdateFrequentlyQuestion(FrequentlyQuestionWriteDTO frequentlyQuestion, string UpdateUserById);
        Task<bool> CreateOrUpdateWebConfig(WebConfigWriteDTO webConfig, string UpdateUserById);
        Task<BannerGridDTO> GetBannerGridDTO();
        Task<BannerGridDTO> CreateOrUpdateBannerGridAsync(BannerGridDTO model);
        Task<List<BannerDTO>> GetBannersAsync();
        Task<List<SectionDTO>> GetSectionsAsync();
        Task<List<BannerDTO>> CreateOrUpdateBannerAsync(List<BannerDTO> model);
        Task<List<SectionDTO>> CreateOrUpdateSectionsAsync(List<SectionDTO> model);
    }
}
