using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Vendor
    {
        public int Id {get; set;}
        public string Name {get; set;} = string.Empty;
        public string Description {get; set;} = string.Empty;
        public string Address {get; set;} = string.Empty;
        public string Phone {get; set;} = string.Empty;
        public int CategoryId {get; set;}
        public Category Category {get; set;} = null!;
        public bool IsActive {get; set;}
        

    }
}