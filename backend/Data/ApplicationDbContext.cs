using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
            
        }
        public DbSet<Vendor> Vendors {get; set;}
        public DbSet<Category> Categories {get; set;}
        public DbSet<VendorPhoto> Photos {get; set;}
        public DbSet<VendorUnavailableDate> VendorUnavailableDates {get; set;}
        public DbSet<Favorite> Favorites {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Favorite>()
                .HasIndex(f => new { f.UserId, f.VendorId})
                .IsUnique();
        }
    }
}