using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Vendor
{
    public class CreateVendorPhotoDto
    {
        [Required]
        [Url]
        [StringLength(500)]
        public string ImageUrl {get; set;} = string.Empty;

        [Range(0, 100)]
        public int SortOrder {get; set;}
    }
}
