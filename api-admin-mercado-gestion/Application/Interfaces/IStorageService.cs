namespace Application.Interfaces
{
    public interface IStorageService
    {
        Task UploadFileAsync(string key, Stream fileStream, string contentType);
        Task<string> ProcessImageUrl(string cdnUrl, string imageUrl, string folder);
    }
}
