using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Account
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? YourName { get; set; }
        [Required]    
        public string? YourPartnerName { get; set; } 
        [Required]
        public DateOnly WeddingDate {get; set;} 
    }
}