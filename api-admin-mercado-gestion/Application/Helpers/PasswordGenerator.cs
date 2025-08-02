using System.Security.Cryptography;

namespace Application.Helpers
{
    public static class PasswordGenerator
    {
        public static string GenerateRandomPassword(int length = 12)
        {
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@$?_-";
            var bytes = RandomNumberGenerator.GetBytes(length);
            return new string(bytes.Select(b => validChars[b % validChars.Length]).ToArray());
        }
    }
}
