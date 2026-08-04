using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class AppUser : IdentityUser
    {
        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
        public string YourName { get; set; } = string.Empty;
        public string YourPartnerName {get; set;} = string.Empty;
        public DateOnly WeddingDate {get;set; }

    }
}