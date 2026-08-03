using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;


namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
            
        }
        public DbSet<Vendor> Vendors {get; set;}
        public DbSet<Category> Categories {get; set;}
        public DbSet<VendorPhoto> Photos {get; set;}
        public DbSet<VendorUnavailableDate> VendorUnavailableDates {get; set;}
    }
}