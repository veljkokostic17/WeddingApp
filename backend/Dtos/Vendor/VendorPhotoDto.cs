using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Vendor
{
    public class VendorPhotoDto
    {
        public int Id {get; set;}
        public string ImageUrl {get; set;} = string.Empty;
        public int SortOrder {get; set;}
    }
}