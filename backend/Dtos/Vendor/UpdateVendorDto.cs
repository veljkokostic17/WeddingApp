using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Vendor
{
    public class UpdateVendorDto
    {
        public string Name {get; set;} = string.Empty;
        public string Description {get; set;} = string.Empty;
        public string? Address {get; set;}
        public string Phone {get; set;} = string.Empty;
        public string? Email {get; set;}
        public string? InstagramUrl {get ;set;}
        public int CategoryId {get; set;}
        public bool IsActive {get; set;}
        public int? Capacity {get; set;}
        public string? TableSize {get; set;}
    }
}