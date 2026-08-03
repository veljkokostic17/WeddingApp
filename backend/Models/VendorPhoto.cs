using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class VendorPhoto
    {
        public int Id {get; set;}
        public int VendorId {get; set;}
        public Vendor Vendor {get; set; } = null!;
        public string ImageUrl {get; set;} = string.Empty;
        public int SortOrder {get; set;}
    }
}