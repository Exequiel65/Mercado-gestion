namespace Domain.WebConfig.Config
{
    public class WebConfigWriteDTO
    {
        public int? Id { get; set; }
        // cart
        public bool HasPaymentMethod { get; set; }
        public bool RedirectToWsp { get; set; }
        public bool HasApplyCoupon { get; set; }

        //shipping
        public bool EnabledShipping { get; set; }
        public bool HasFreeShipping { get; set; }
        public decimal FreeShippingAmount { get; set; }
        public string TitleShipping { get; set; }
        public string DescriptionShipping { get; set; }

        // Devolution
        public bool EnabledDevolution { get; set; }
        public int DevolutionDays { get; set; }
        public string TitleDevolution { get; set; }
        public string DescriptionDevolution { get; set; }

        public bool HasSubscription { get; set; }
        public bool IsMaintenance { get; set; }
        public bool EnabledWeb { get; set; }
    }
}
