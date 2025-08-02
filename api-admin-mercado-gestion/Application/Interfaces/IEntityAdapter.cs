using Domain.Entity;

namespace Application.Interfaces
{
    public interface IEntityAdapter
    {
        Task<EntityDTO> GetEntityByIdAsync();
        Task<string> GetEntityName();
        Task<EntityDTO> Create();
        Task<bool> Update(string name);
    }
}
