using System.Text.Json.Serialization;

namespace Domain.Products.DTO
{
    public class QuickActionWriteDTO
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public QuickActionType Action { get; set; }
    }

    public enum QuickActionType
    {
        DISABLED,
        ACTIVE,
        SOLDOUT,
        FEATURED,
        NOT_DISCOUNT
    }
}
