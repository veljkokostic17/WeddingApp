using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Vendor
{
    public class UpdateVendorDto
    {
        [Required]
        [StringLength(100)]
        public string Name {get; set;} = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Description {get; set;} = string.Empty;

        [StringLength(200)]
        public string? Address {get; set;}

        [Required]
        [Phone]
        [StringLength(30)]
        public string Phone {get; set;} = string.Empty;

        [EmailAddress]
        [StringLength(200)]
        public string? Email {get; set;}

        [Url]
        [StringLength(300)]
        public string? InstagramUrl {get ;set;}

        [Range(1, int.MaxValue)]
        public int CategoryId {get; set;}

        public bool IsActive {get; set;}

        [Range(1, 5000)]
        public int? Capacity {get; set;}

        [StringLength(50)]
        public string? TableSize {get; set;}
    }
}
