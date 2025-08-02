using Application.Common;
using System.Net;

namespace Application.Helpers
{
    public static class MediaHelper
    {
        public static bool ValidateVideoFormat(this string data)
        {
            List<string> VideoFormat = new List<string>() { "mp4" };
            var VideoFormatToUpload = data.Split('/')[1];
            VideoFormatToUpload = VideoFormatToUpload.Split(";")[0];
            if (!VideoFormat.Contains(VideoFormatToUpload))
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "INVALID_VIDEO_FORMAT", "Invalid video format");
            }
            return true;
        }

        public static string GetFileExtension(this string data)
        {
            var fileFormatToUpload = data.Split('/')[1];
            fileFormatToUpload = fileFormatToUpload.Split(";")[0];
            return fileFormatToUpload;
        }

        public static bool IsUrl(this string data)
        {
            return Uri.TryCreate(data, UriKind.Absolute, out var uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }
        public static bool ValidateImageFormat(this string data)
        {
            List<string> ImageFormat = new List<string>() { "jpg", "jpeg", "png", "gif", "bmp", "ico", "webp", "x-icon" };
            var imageFormatToUpload = data.Split('/')[1];
            imageFormatToUpload = imageFormatToUpload.Split(";")[0];
            if (!ImageFormat.Contains(imageFormatToUpload))
            {
                throw new ApiErrorException(HttpStatusCode.BadRequest, "INVALID_IMAGE_FORMAT", "Invalid image format");
            }
            return true;
        }
    }
}
