using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Account
{
    public class CurrentUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string YourName { get; set; } = string.Empty;
        public string YourPartnerName { get; set; } = string.Empty;
        public DateOnly WeddingDate { get; set; }
    }
}