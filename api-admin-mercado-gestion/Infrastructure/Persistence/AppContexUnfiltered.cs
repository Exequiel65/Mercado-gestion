using ModelEntity = Domain.Entity.Entity;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Identity;

namespace Infrastructure.Persistence
{
    public class AppContexUnfiltered : DbContext
    {
        public AppContexUnfiltered(DbContextOptions<AppContexUnfiltered> options) : base(options)
        {
        }
        public virtual DbSet<ModelEntity> Entity { get; set; }
        public virtual DbSet<Domain.Domains.Domains> Domains { get; set; }
        public virtual DbSet<ApplicationRole> ApplicationRole { get; set; }
        public virtual DbSet<AspNetUserRoles> AspNetUserRoles { get; set; }
        public virtual DbSet<ApplicationUser> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ModelEntity>().ToTable(nameof(Entity));
            builder.Entity<ModelEntity>().HasKey(e => e.Id);
            builder.Entity<Domain.Domains.Domains>().ToTable(nameof(Domains));
            builder.Entity<Domain.Domains.Domains>().HasKey(d => d.Id);

            builder.Entity<ApplicationUser>().ToTable(nameof(ApplicationUser));
            builder.Entity<ApplicationUser>().HasKey(e => e.Id);

            builder.Entity<AspNetUserRoles>().ToTable("AspNetUserRoles");
            builder.Entity<AspNetUserRoles>().HasKey(ur => new { ur.UserId, ur.RoleId });

            builder.Entity<ApplicationUser>()
             .HasMany(u => u.UserRoles)
             .WithMany()
             .UsingEntity<AspNetUserRoles>(
                 j => j.HasOne(ur => ur.Role).WithMany(),
                 j => j.HasOne(ur => ur.User).WithMany()
             );

            builder.Entity<ApplicationRole>().ToTable("AspNetRoles");
            builder.Entity<ApplicationRole>()
                .HasKey(r => r.Id);
            builder.Entity<ApplicationRole>()
                .HasMany(r => r.Claims).WithOne().HasForeignKey(c => c.RoleId).IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ApplicationRole>()
                .Property(p => p.PrettyName).HasMaxLength(100);
        }
        // Define DbSets for your entities here
        // public DbSet<YourEntity> YourEntities { get; set; }
    }
}
