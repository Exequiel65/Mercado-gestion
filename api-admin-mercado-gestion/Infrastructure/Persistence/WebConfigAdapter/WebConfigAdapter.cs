using Application.Common;
using Application.Interfaces;
using AutoMapper;
using Domain.Home.SectionHome;
using Domain.WebConfig;
using Domain.WebConfig.Config;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace Infrastructure.Persistence.WebConfigAdapter
{
    public class WebConfigAdapter : IWebConfigAdapter
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        public WebConfigAdapter(AppDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<TermsReadDTO> GetTerms()
        {
            var terms = await _context.Terms.FirstOrDefaultAsync();
            return _mapper.Map<TermsReadDTO>(terms);
        }

        public async Task<PolicyReadDTO> GetPolicy()
        {
            var policy = await _context.Policies.FirstOrDefaultAsync();
            return _mapper.Map<PolicyReadDTO>(policy);
        }

        public async Task<FrequentlyQuestionReadDTO> GetFrequentlyQuestion()
        {
            var frequentlyQuestions = await _context.FrequentlyQuestions.FirstOrDefaultAsync();
            return _mapper.Map<FrequentlyQuestionReadDTO>(frequentlyQuestions);
        }

        public async Task<WebConfigReadDTO> GetWebConfig()
        {
            var webConfig = await _context.WebConfig.FirstOrDefaultAsync();
            return _mapper.Map<WebConfigReadDTO>(webConfig);
        }

        public async Task<bool> CreateOrUpdateWebConfig(WebConfigWriteDTO webConfig, string UpdateUserById)
        {
            if (webConfig == null) throw new ArgumentNullException(nameof(webConfig));
            var existingWebConfig = await _context.WebConfig.FirstOrDefaultAsync();
            if (existingWebConfig != null)
            {
                _mapper.Map(webConfig, existingWebConfig);
                existingWebConfig.UpdatedAt = DateTime.UtcNow;
                existingWebConfig.UpdateBy = UpdateUserById;
                _context.WebConfig.Update(existingWebConfig);
                await ToogleActiveWeb(existingWebConfig.EnabledWeb);
            }
            else
            {
                var newWebConfig = _mapper.Map<Config>(webConfig);
                newWebConfig.CreatedAt = DateTime.UtcNow;
                newWebConfig.UpdatedAt = DateTime.UtcNow;
                newWebConfig.UpdateBy = UpdateUserById;
                await _context.WebConfig.AddAsync(newWebConfig);
                await CreateDomainForWebAsync();
            }
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CreateOrUpdateTerms(TermsWriteDTO terms, string UpdateUserById)
        {
            if (terms == null) throw new ArgumentNullException(nameof(terms));
            var existingTerms = await _context.Terms.FirstOrDefaultAsync();
            if (existingTerms != null)
            {
                existingTerms.Description = terms.Description;
                existingTerms.UpdatedAt = DateTime.UtcNow;
                existingTerms.UpdateBy = UpdateUserById;
                _context.Terms.Update(existingTerms);
            }
            else
            {
                var newTerms = _mapper.Map<Terms>(terms);
                newTerms.CreatedAt = DateTime.UtcNow;
                newTerms.UpdatedAt = DateTime.UtcNow;
                newTerms.UpdateBy = UpdateUserById;
                await _context.Terms.AddAsync(newTerms);
            }
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CreateOrUpdatePolicy(PolicyWriteDTO policy, string UpdateUserById)
        {
            if (policy == null) throw new ArgumentNullException(nameof(policy));
            var existingPolicy = await _context.Policies.FirstOrDefaultAsync();
            if (existingPolicy != null)
            {
                existingPolicy.Description = policy.Description;
                existingPolicy.UpdatedAt = DateTime.UtcNow;
                existingPolicy.UpdateBy = UpdateUserById;
                _context.Policies.Update(existingPolicy);
            }
            else
            {
                var newPolicy = _mapper.Map<Policy>(policy);
                newPolicy.CreatedAt = DateTime.UtcNow;
                newPolicy.UpdatedAt = DateTime.UtcNow;
                newPolicy.UpdateBy = UpdateUserById;
                await _context.Policies.AddAsync(newPolicy);
            }
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CreateOrUpdateFrequentlyQuestion(FrequentlyQuestionWriteDTO frequentlyQuestion, string UpdateUserById)
        {
            if (frequentlyQuestion == null) throw new ArgumentNullException(nameof(frequentlyQuestion));
            var existingFrequentlyQuestion = await _context.FrequentlyQuestions.FirstOrDefaultAsync(fq => fq.Id == frequentlyQuestion.Id);
            if (existingFrequentlyQuestion != null)
            {
                existingFrequentlyQuestion.Description = frequentlyQuestion.Description;
                existingFrequentlyQuestion.UpdatedAt = DateTime.UtcNow;
                existingFrequentlyQuestion.UpdateBy = UpdateUserById;
                _context.FrequentlyQuestions.Update(existingFrequentlyQuestion);
            }
            else
            {
                var newFrequentlyQuestion = _mapper.Map<FrequentlyQuestion>(frequentlyQuestion);
                newFrequentlyQuestion.CreatedAt = DateTime.UtcNow;
                newFrequentlyQuestion.UpdatedAt = DateTime.UtcNow;
                newFrequentlyQuestion.UpdateBy = UpdateUserById;
                await _context.FrequentlyQuestions.AddAsync(newFrequentlyQuestion);
            }
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<BannerGridDTO> GetBannerGridDTO()
        {
            var banners = await _context.BannerGrids
                .AsNoTracking()
                .Include(b => b.Items)
                .FirstOrDefaultAsync();

            return _mapper.Map<BannerGridDTO>(banners);
        }

        public async Task<BannerGridDTO> CreateOrUpdateBannerGridAsync(BannerGridDTO model)
        {
            if (model == null)
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "MODEL_NOT_FOUND", "Model cannot be null or empty");
            }
            var existingBanner = await _context.BannerGrids
                .AsNoTracking()
                .Include(b => b.Items)
                .FirstOrDefaultAsync(x => x.Id == model.Id);

            if (existingBanner != null)
            {
                var removeItem = existingBanner.Items.Where(x => !model.Items.Select(x => x.Id).ToList().Contains(x.Id)).ToList();
                _mapper.Map(model, existingBanner);
                _context.BannerGrids.Update(existingBanner);
                _context.ItemBannerGrids.RemoveRange(removeItem);
            }
            else
            {
                _context.BannerGrids.Add(_mapper.Map<BannerGrid>(model));
            }

            await _context.SaveChangesAsync();
            return model;

        }

        public async Task<List<BannerDTO>> GetBannersAsync()
        {
            var banners = await _context.Banners
                .AsNoTracking()
                .ToListAsync();
            return _mapper.Map<List<BannerDTO>>(banners);
        }
        public async Task<List<BannerDTO>> CreateOrUpdateBannerAsync(List<BannerDTO> model)
        {
            if (model == null || !model.Any())
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "MODEL_NOT_FOUND", "Model cannot be null or empty");
            }
            var existingBanners = await _context.Banners
                .AsNoTracking()
                .ToListAsync();
            var removeExistingBanners = existingBanners.Where(x => !model.Select(x => x.Id).ToList().Contains(x.Id)).ToList();
            foreach (var banner in model)
            {
                var existingBanner = existingBanners.FirstOrDefault(b => b.Id == banner.Id);
                if (existingBanner != null)
                {
                    _mapper.Map(banner, existingBanner);
                    _context.Banners.Update(existingBanner);
                }
                else
                {
                    _context.Banners.Add(_mapper.Map<Banner>(banner));
                }
            }
            _context.Banners.RemoveRange(removeExistingBanners);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<List<SectionDTO>> GetSectionsAsync()
        {
            var sections = await _context.Sections
                .AsNoTracking()
                .ToListAsync();
            return _mapper.Map<List<SectionDTO>>(sections);
        }

        public async Task<List<SectionDTO>> CreateOrUpdateSectionsAsync(List<SectionDTO> model)
        {
            if (model == null || !model.Any())
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "MODEL_NOT_FOUND", "Model cannot be null or empty");
            }
            var existingSections = await _context.Sections
                .AsNoTracking()
                .ToListAsync();
            var removeExistingSections = existingSections.Where(x => !model.Select(x => x.Id).ToList().Contains(x.Id)).ToList();
            foreach (var section in model)
            {
                var existingSection = existingSections.FirstOrDefault(s => s.Id == section.Id);
                if (existingSection != null)
                {
                    _mapper.Map(section, existingSection);
                    _context.Sections.Update(existingSection);
                }
                else
                {
                    _context.Sections.Add(_mapper.Map<Section>(section));
                }
            }
            _context.Sections.RemoveRange(removeExistingSections);
            await _context.SaveChangesAsync();
            return model;
        }

        private async Task CreateDomainForWebAsync()
        {
            var business = await _context.Business.FirstOrDefaultAsync();
            if (business is null)
                throw new ApiErrorException(HttpStatusCode.BadRequest, "Business not found", "Business not found");
            var domainName = business.Name.ToLower().Replace(" ", "-") + "." + _configuration["domain"];
            await _context.Domains.AddAsync(new Domain.Domains.Domains()
            {
                Domain = domainName,
                IsActive = true,
                Name = "Web"
            });
            await _context.SaveChangesAsync();
        }

        private async Task ToogleActiveWeb(bool status)
        {
            var domain = await _context.Domains.FirstAsync(x => x.Name == "Web");
            domain.IsActive = status;
            await _context.SaveChangesAsync();
        }
    }
}
