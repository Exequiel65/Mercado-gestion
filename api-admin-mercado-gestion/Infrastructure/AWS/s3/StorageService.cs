using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Application.Helpers;
using Application.Interfaces;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;

namespace Infrastructure.AWS.s3
{
    public class StorageService : IStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly StorageSettings _settings;

        public StorageService(IAmazonS3 s3Client, IOptions<StorageSettings> settings)
        {
            _s3Client = s3Client ?? throw new ArgumentNullException(nameof(s3Client));
            _settings = settings.Value ?? throw new ArgumentNullException(nameof(settings));
        }

        public async Task UploadFileAsync(string key, Stream fileStream, string contentType)
        {
            if (string.IsNullOrEmpty(key)) throw new ArgumentException("Key cannot be null or empty.", nameof(key));
            if (fileStream == null) throw new ArgumentNullException(nameof(fileStream));
            if (string.IsNullOrEmpty(contentType)) throw new ArgumentException("Content type cannot be null or empty.", nameof(contentType));
            var putRequest = new Amazon.S3.Model.PutObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = key,
                InputStream = fileStream,
                ContentType = contentType
            };
            await _s3Client.PutObjectAsync(putRequest);
        }

        public async Task<string> ProcessImageUrl(string cdnUrl, string imageUrl, string folder)
        {

            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                return null;
            }
            else if (imageUrl.IsUrl())
            {
                return imageUrl;
            }
            else if (imageUrl.ValidateImageFormat())
            {
                string response = await Upload(_settings.BucketName, cdnUrl, imageUrl, folder);
            
                return response;
            }
            return imageUrl;
        }
        private async Task<string> Upload(string bucketName, string url, string data, string folder, CancellationToken token = default, bool returnUrl = true, bool optimize = true)
        {
            string fileName = Guid.NewGuid().ToString() + "." + data.GetFileExtension();
            if (data.IsUrl())
                return data;

            //var bucketCreatedResponse = await CreateBucketIfNeeded(bucketName);

            //if (bucketCreatedResponse.Contains(bucketName))
            //{
                var cleanData = Regex.Replace(data, @"^data:image\/[a-zA-Z]+;base64,", string.Empty);

                var bytes = Convert.FromBase64String(cleanData);
                var fullPath = $"{url}/{folder}/{fileName}";

                using var transferUtility = new TransferUtility(_s3Client);

                await using var ms = new MemoryStream(bytes);

                await transferUtility.UploadAsync(ms, bucketName, $"{folder}/{fileName}", token);
                if (returnUrl)
                    return $"{fullPath}";
                else
                    return fileName;
            //}
            return fileName;
        }

        public async Task<DeleteObjectResponse> DeleteFile(string bucketName, string filename)
        {
            var deleteObjectRequest = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = filename
            };
            var result = await _s3Client.DeleteObjectAsync(deleteObjectRequest);
            return result;
        }

    }
}
