using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class VendorUnavailableDate
    {
        public int Id {get ;set;}
        public int VendorId {get;set;}
        public Vendor Vendor {get; set;} = null!;
        public DateOnly Date {get; set;}
    }
}