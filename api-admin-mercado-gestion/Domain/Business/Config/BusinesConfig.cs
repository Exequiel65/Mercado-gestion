using Domain.Entity;


namespace Domain.Business.Config
{
    public class BusinesConfig: IEntityScoped
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        // Cart
        public bool HasPaymentMethod { get; set; }
        public bool RedirectToWsp { get; set; }
        public bool HasAppliedCoupon { get; set; }
        // Shipping
        public bool HasShippingMethod { get; set; }
        public bool HasFreeShipping { get; set; }
        public decimal FreeShippingMinValue { get; set; }
        //Devolution
        public bool HasDevolution { get; set; }
        public int DevolutionDays { get; set; }
        //Newletter
        public bool HasNewsletter { get; set; }
        //Maintenance
        public bool IsMaintenance { get; set; }
        public bool IsMaintenanceDashboard { get; set; }

        public int EntityId { get; set; }
        public virtual Business Business { get; set; }
    }
}
