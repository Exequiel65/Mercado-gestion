using Application.Interfaces;
using Domain.Business;
using Domain.Business.Config;
using Domain.Categories;
using Domain.Entity;
using Domain.Home.SectionHome;
using Domain.Products;
using Domain.Store;
using Domain.WebConfig;
using Domain.WebConfig.Config;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Reflection;
using ModelEntity = Domain.Entity.Entity;

namespace Infrastructure.Persistence
{
    public class AppDbContext: IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        private int? entityId;
        public AppDbContext(DbContextOptions<AppDbContext> options, IEntityContextProvider entityContextProvider) : base(options)
        {
            entityId = entityContextProvider.GetCurrentEntityId();
        }
        public virtual DbSet<ModelEntity> Entity { get; set;}
        public virtual DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public virtual DbSet<ApplicationRole> ApplicationRole { get; set; }
        public virtual DbSet<AspNetUserRoles> AspNetUserRoles { get; set; }
        public virtual DbSet<Business> Business { get; set; }
        public virtual DbSet<SocialMedia> SocialMedias { get; set; }
        public virtual DbSet<BusinesConfig> BusinessConfigs { get; set; }
        public virtual DbSet<Store> Stores { get; set; }
        public virtual DbSet<Domain.Domains.Domains> Domains { get; set; }
        public virtual DbSet<Terms> Terms { get; set; }
        public virtual DbSet<Policy> Policies { get; set; }
        public virtual DbSet<FrequentlyQuestion> FrequentlyQuestions { get; set; }
        public virtual DbSet<Config> WebConfig { get; set; }

        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<SubCategory> SubCategories { get; set; }
        public virtual DbSet<ChildCategory> ChildCategories { get; set; }

        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<MediaProduct> MediaProducts { get; set; }
        public virtual DbSet<Banner> Banners{ get; set; }
        public virtual DbSet<Section> Sections { get; set; }
        public virtual DbSet<BannerGrid> BannerGrids { get; set; }
        public virtual DbSet<ItemBannerGrid> ItemBannerGrids { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Configure your entities here
            builder.Entity<IdentityUserRole<string>>().ToTable((string)null);
            builder.Entity<ModelEntity>().ToTable(nameof(Entity));
            builder.Entity<ModelEntity>().HasKey(e => e.Id);

            builder.Entity<Business>().ToTable(nameof(Business));
            builder.Entity<Business>().HasKey(b => b.Id);

            builder.Entity<Store>().ToTable(nameof(Store));
            builder.Entity<Store>().HasKey(s => s.Id);

            builder.Entity<BusinesConfig>().ToTable(nameof(BusinesConfig));
            builder.Entity<BusinesConfig>().HasKey(bc => bc.Id);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.HasPaymentMethod).IsRequired().HasDefaultValue(false);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.RedirectToWsp).IsRequired().HasDefaultValue(true);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.HasAppliedCoupon).IsRequired().HasDefaultValue(false);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.HasShippingMethod).IsRequired().HasDefaultValue(false);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.HasFreeShipping).IsRequired().HasDefaultValue(false);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.FreeShippingMinValue).IsRequired().HasDefaultValue(0)
                .HasPrecision(18, 2);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.HasDevolution).IsRequired().HasDefaultValue(false);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.DevolutionDays).IsRequired().HasDefaultValue(7);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.HasNewsletter).IsRequired().HasDefaultValue(false);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.IsMaintenance).IsRequired().HasDefaultValue(false);
            builder.Entity<BusinesConfig>()
                .Property(bc => bc.IsMaintenanceDashboard).IsRequired().HasDefaultValue(false);


            builder.Entity<ApplicationUser>().ToTable(nameof(ApplicationUser));
            builder.Entity<ApplicationUser>().HasMany(u => u.Claims).WithOne().HasForeignKey(c => c.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);


            builder.Entity<Store>()
                .HasOne(s => s.Business)
                .WithMany(b => b.Stores)
                .HasForeignKey(s => s.BusinessId)
                .OnDelete(DeleteBehavior.Cascade);


            builder.Entity<AspNetUserRoles>().ToTable("AspNetUserRoles");
            builder.Entity<AspNetUserRoles>().HasKey(ur => new { ur.UserId, ur.RoleId });

            builder.Entity<ApplicationUser>()
             .HasMany(u => u.UserRoles)
             .WithMany()
             .UsingEntity<AspNetUserRoles>(
                 j => j.HasOne(ur => ur.Role).WithMany(),
                 j => j.HasOne(ur => ur.User).WithMany()
             );

            builder.Entity<ApplicationUser>()
                .HasOne(u => u.Store)
                .WithMany()
                .HasForeignKey(u => u.StoreId)
                .OnDelete(DeleteBehavior.NoAction);


            builder.Entity<ApplicationRole>()
                .HasMany(r => r.Claims).WithOne().HasForeignKey(c => c.RoleId).IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ApplicationRole>()
                .Property(p => p.PrettyName).HasMaxLength(100);


            builder.Entity<SocialMedia>().ToTable(nameof(SocialMedia));
            builder.Entity<SocialMedia>().HasKey(s => s.Id);

            builder.Entity<Business>()
                .HasOne(s => s.SocialMedia)
                .WithOne()
                .HasForeignKey<Business>(b => b.SocialMediaId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<BusinesConfig>()
                .HasOne(bc => bc.Business)
                .WithOne(b => b.Config)
                .HasForeignKey<BusinesConfig>(bc => bc.BusinessId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Domain.Domains.Domains>().ToTable(nameof(Domains));
            builder.Entity<Domain.Domains.Domains>().HasKey(d => d.Id);

            builder.Entity<Terms>().ToTable(nameof(Terms));
            builder.Entity<Terms>().HasKey(t => t.Id);

            builder.Entity<Policy>().ToTable(nameof(Policy));
            builder.Entity<Policy>().HasKey(p => p.Id);

            builder.Entity<FrequentlyQuestion>().ToTable(nameof(FrequentlyQuestion));
            builder.Entity<FrequentlyQuestion>().HasKey(fq => fq.Id);

            builder.Entity<Config>().ToTable("WebConfig");
            builder.Entity<Config>().HasKey(c => c.Id);
            builder.Entity<Config>()
                .Property(c => c.FreeShippingAmount)
                .HasPrecision(10,2);

            builder.Entity<Category>().ToTable(nameof(Category));
            builder.Entity<Category>().HasKey(c => c.Id);

            builder.Entity<SubCategory>().ToTable(nameof(SubCategory));
            builder.Entity<SubCategory>().HasKey(sc => sc.Id);

            builder.Entity<ChildCategory>().ToTable(nameof(ChildCategory));
            builder.Entity<ChildCategory>().HasKey(cc => cc.Id);

            builder.Entity<Category>()
                .HasMany(c => c.SubCategories)
                .WithOne()
                .HasForeignKey(sc => sc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SubCategory>()
                .HasMany(sc => sc.ChildCategories)
                .WithOne()
                .HasForeignKey(cc => cc.SubCategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Product>().ToTable(nameof(Product));
            builder.Entity<Product>().HasKey(p => p.Id);


            builder.Entity<MediaProduct>().ToTable(nameof(MediaProduct));
            builder.Entity<MediaProduct>().HasKey(mp => mp.Id);


            builder.Entity<Product>()
                .HasMany(p => p.Images)
                .WithOne()
                .HasForeignKey(mp => mp.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Product>()
                .HasOne(p => p.SubCategory)
                .WithMany()
                .HasForeignKey(p => p.SubCategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Product>()
                .HasOne(p => p.ChildCategory)
                .WithMany()
                .HasForeignKey(p => p.ChildCategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Banner>().ToTable(nameof(Banner));
            builder.Entity<Banner>().HasKey(b => b.Id);
            
            builder.Entity<Section>().ToTable(nameof(Section));
            builder.Entity<Section>().HasKey(s => s.Id);
            builder.Entity<Section>()
                .Property(s => s.PositionButton)
                .HasConversion<string>();

            builder.Entity<BannerGrid>().ToTable(nameof(BannerGrid));
            builder.Entity<BannerGrid>().HasKey(bg => bg.Id);

            builder.Entity<ItemBannerGrid>().ToTable(nameof(ItemBannerGrid));
            builder.Entity<ItemBannerGrid>().HasKey(ibg => ibg.Id);
            builder.Entity<ItemBannerGrid>()
                .Property(ibg => ibg.Theme)
                .HasConversion<string>();

            builder.Entity<BannerGrid>()
                .HasMany(bg => bg.Items)
                .WithOne()
                .HasForeignKey(ibg => ibg.BannerGridId)
                .OnDelete(DeleteBehavior.Cascade);

            foreach (var entity in builder.Model.GetEntityTypes())
            {
                var entityType = entity.ClrType;

                if (typeof(IEntityScoped).IsAssignableFrom(entityType))
                {

                    //if (entityType.BaseType != typeof(object))
                    //{
                    //    continue;
                    //}



                    var method = typeof(AppDbContext)
                        .GetMethod(nameof(SetEntityFilter),
                        BindingFlags.NonPublic | BindingFlags.Static
                           )?.MakeGenericMethod(entityType);

                    var filter = method?.Invoke(null, new object[] { this })!;
                    entity.SetQueryFilter((LambdaExpression)filter);
                }
            }
        }
        private static LambdaExpression SetEntityFilter<TEntity>(AppDbContext context) where TEntity : class, IEntityScoped
        {
            Expression<Func<TEntity, bool>> filter = x => (context.entityId == x.EntityId);

            return filter;
        }

        public override int SaveChanges()
        {
            SetEntityId();
            return base.SaveChanges();
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SetEntityId();
            return base.SaveChangesAsync(cancellationToken);
        }

        public void SetScopedEntityId(int? entityId)
        {
            this.entityId = entityId;
        }

        public int? GetScopedEntityId()
        {
            return this.entityId;
        }
        private void SetEntityId()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in entries)
            {

                if (entry.Entity is IEntityScoped entityFilterableEntity)
                {
                    if (entityFilterableEntity.EntityId != 0 && entityFilterableEntity.EntityId != this.entityId)
                    {
                        Console.WriteLine($"ENTITY WARNING | EntityId IS CHANGED {entityFilterableEntity.EntityId} TO {this.entityId} | Metadata: {entry.Metadata.ClrType}");

                    }
                    entityFilterableEntity.EntityId = this.entityId.Value == -1 && entityFilterableEntity.EntityId > 0 ? entityFilterableEntity.EntityId : this.entityId.Value;
                }
            }
        }
    }
}

    
