using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Account
{
    // Deliberately no Email and no Password. Email is the UserName column too
    // (Register sets both), so changing it means SetEmailAsync + SetUserNameAsync
    // plus a duplicate check — its own job. Password needs the current one.
    public class UpdateProfileDto
    {
        [Required]
        [StringLength(100)]
        public string? YourName { get; set; }

        [Required]
        [StringLength(100)]
        public string? YourPartnerName { get; set; }

        [Required]
        public DateOnly WeddingDate { get; set; }
    }
}
