using Domain.User;

namespace Application.Interfaces
{
    public interface IJwtCreator
    {
        Task<string> GetTokenAndId(string username, int entityId, int expireMinutes);
        Task<string> GetTokenAndId(ApplicationUserDTO username);
    }
}
