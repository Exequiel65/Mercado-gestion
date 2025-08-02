using Application.Common;
using Application.Interfaces;
using Domain.Entity;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Infrastructure.Persistence.Entity
{
    public class EntityAdapter : IEntityAdapter
    {
        private readonly AppDbContext _dbContext;
        private readonly AppContexUnfiltered _appContexUnfiltered;

        public EntityAdapter(AppDbContext context, AppContexUnfiltered appContexUnfiltered)
        {
            _dbContext = context ?? throw new ArgumentNullException(nameof(context));
            _appContexUnfiltered = appContexUnfiltered ?? throw new ArgumentNullException(nameof(appContexUnfiltered));
        }
        public async Task<EntityDTO> GetEntityByIdAsync()
        {
            var entityId = _dbContext.GetScopedEntityId();
            var entity = await _dbContext.Entity.FirstOrDefaultAsync( x=> x.Id == entityId);
            if (entity is null)
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest,$"ENTITY_NOT_FOUND", $"Entity not found.");
            }
            return new EntityDTO
            {
                Id = entity.Id,
                Name = entity.Name,
                IsActive = true
            };
        }
        public async Task<string> GetEntityName()
        {
            var entityId = _dbContext.GetScopedEntityId();
            var entity = await _dbContext.Entity.FirstOrDefaultAsync(x => x.Id == entityId);
            if (entity is null)
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, $"ENTITY_NOT_FOUND", $"Entity not found.");
            }
            return entity.Name;
        }

        public async Task<EntityDTO> Create()
        {
            var newEntity = new Domain.Entity.Entity()
            {
                Id = 0,
                IsActive = false,
                Name = DateTime.UtcNow.ToString(),
                TenantId = DateTime.UtcNow.ToString()
            };

            _appContexUnfiltered.Entity.Add(newEntity);
            await _appContexUnfiltered.SaveChangesAsync();
            return new EntityDTO()
            {
                Id = newEntity.Id,
                Name = newEntity.Name,
                IsActive = newEntity.IsActive,
            };
        }

        public async Task<bool> Update(string name)
        {
            var entityId = _dbContext.GetScopedEntityId();
            var entity = await _dbContext.Entity.FirstOrDefaultAsync(x => x.Id == entityId);

            if (entity is null)
                throw new ApiErrorException(HttpStatusCode.BadRequest, "ERROR_UPDATE_ENTITY", "Error al actualizar la entidad");
            entity.Name = name;
            return (await _dbContext.SaveChangesAsync()) >0;
            
        }
    }
}
