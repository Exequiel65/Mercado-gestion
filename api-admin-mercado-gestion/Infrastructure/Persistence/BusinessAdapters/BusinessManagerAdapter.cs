using Application.Interfaces;
using Application.Common;
using AutoMapper;
using Domain.Business;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Persistence.BusinessAdapters
{
    public class BusinessManagerAdapter : IBusinessManager
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        public BusinessManagerAdapter(AppDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<Domain.Business.DTOs.BusinessRead?> GetBusinessByIdAsync()
        {
            var result = await _context.Business
                .Include(x => x.SocialMedia)
                .FirstAsync();
            return _mapper.Map<Domain.Business.DTOs.BusinessRead>(result);
        }

        public async Task<bool> ExistBusinessByIdAsync(int id)
        {
            return await _context.Business.AnyAsync(x => x.Id == id);
        }

        public async Task<bool> AnyBusinessScope()
        {
            return await _context.Business.AnyAsync();
        }

        public async Task AddBusinessAsync(Domain.Business.DTOs.BusinessWrite businessModel)
        {
            var map = _mapper.Map<Business>(businessModel);
            _context.Business.Add(map);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBusinessAsync(int id, Domain.Business.DTOs.BusinessWrite business)
        {
            var businessExists = await _context.Business.Include(x => x.SocialMedia).FirstAsync(x => x.Id == id);
            var map = _mapper.Map(business, businessExists);
            _context.Business.Update(map);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBusinessAsync(int id)
        {
            var business = await GetBusinessByIdAsync();
            //if (business != null)
            //{
            //    _context.Business.Remove(business);
            //    await _context.SaveChangesAsync();
            //}
        }

        public async Task GenerateDomain()
        {
            var result = await _context.Business
                .Include(x => x.SocialMedia)
                .FirstOrDefaultAsync();
            var newDomain = new Domain.Domains.Domains()
            {
                IsActive = false,
                Name = "Admin",
                Domain = "admin-" + result.Name.ToLower().Replace(" ", "-") + "." + _configuration["domain"]
            };
            _context.Domains.Add(newDomain);
            await _context.SaveChangesAsync();
        }

        public async Task<(bool, string)> ValidateBusinessForActive()
        {
            var business = await _context.Business
                .AsNoTracking()
                .FirstOrDefaultAsync();
            if (business == null)
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "BUSINESS_NOT_FOUND", "Business not found or does not match the provided ID.");

            var domain = await _context.Domains
                .FirstOrDefaultAsync();
            if (domain == null)
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "DOMAIN_NOT_FOUND", "Domain not found or does not match the provided ID.");
            var store = await _context.Stores
                .AsNoTracking()
                .FirstOrDefaultAsync();
            if (store == null)
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "STORE_NOT_FOUND", "Store not found or does not match the provided ID.");
            var entityId = _context.GetScopedEntityId();
            var entity = await _context.Entity
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == entityId);

            if (entity == null)
                throw new ApiErrorException(System.Net.HttpStatusCode.NotFound, "ENTITY_NOT_FOUND", "Entity not found or does not match the provided ID.");

            domain.IsActive = true;
            entity.IsActive = true;
            _context.Domains.Update(domain);
            _context.Entity.Update(entity);
            return ((await _context.SaveChangesAsync()) > 0, domain.Domain);
        }


    }
}
