namespace Domain.WebConfig.Config
{
    public class WebConfigReadDTO
    {
        public int Id { get; set; }

        public CartReadDTO Cart { get; set; }
        public ShippingReadDTO Shipping { get; set; }
        public DevolutionReadDTO Devolution { get; set; }
        public bool HasSubscription { get; set; }
        public bool IsMaintenance { get; set; }
        public bool EnabledWeb { get; set; }
        public string UpdateBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public WebConfigReadDTO()
        {
            this.Id = 0;
            this.Cart = new CartReadDTO();
            this.Shipping = new ShippingReadDTO();
            this.Devolution = new DevolutionReadDTO();
            this.HasSubscription = false;
            this.IsMaintenance = false;
            this.EnabledWeb = false;
            this.UpdateBy = string.Empty;
            this.CreatedAt = null;
            this.UpdatedAt = null;
        }
        public WebConfigReadDTO(Config webConfig)
        {
            Id = webConfig.Id;
            Cart = new CartReadDTO
            {
                HasPaymentMethod = webConfig.HasPaymentMethod,
                RedirectToWsp = webConfig.RedirectToWsp,
                HasApplyCoupon = webConfig.HasApplyCoupon
            };
            Shipping = new ShippingReadDTO
            {
                EnabledShipping = webConfig.EnabledShipping,
                HasFreeShipping = webConfig.HasFreeShipping,
                FreeShippingAmount = webConfig.FreeShippingAmount,
                TitleShipping = webConfig.TitleShipping,
                DescriptionShipping = webConfig.DescriptionShipping
            };
            Devolution = new DevolutionReadDTO
            {
                EnabledDevolution = webConfig.EnabledDevolution,
                DevolutionDays = webConfig.DevolutionDays,
                TitleDevolution = webConfig.TitleDevolution,
                DescriptionDevolution = webConfig.DescriptionDevolution
            };
            HasSubscription = webConfig.HasSubscription;
            IsMaintenance = webConfig.IsMaintenance;
            EnabledWeb = webConfig.EnabledWeb;
            UpdateBy = webConfig.UpdateBy;
            CreatedAt = webConfig.CreatedAt;
            UpdatedAt = webConfig.UpdatedAt;
        }
    }


    public class CartReadDTO
    {
        public bool HasPaymentMethod { get; set; } = false;
        public bool RedirectToWsp { get; set; } = false;
        public bool HasApplyCoupon { get; set; } = false;
    }
    public class ShippingReadDTO
    {
        public bool EnabledShipping { get; set; } = false;
        public bool HasFreeShipping { get; set; } = false;
        public decimal FreeShippingAmount { get; set; } = 0.0m;
        public string TitleShipping { get; set; } = string.Empty;
        public string DescriptionShipping { get; set; } = string.Empty;
    }

    public class DevolutionReadDTO
    {
        public bool EnabledDevolution { get; set; } = false;
        public int DevolutionDays { get; set; } = 0;
        public string TitleDevolution { get; set; } = string.Empty;
        public string DescriptionDevolution { get; set; } = string.Empty;
    }
}
