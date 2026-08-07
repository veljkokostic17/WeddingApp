using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Favorite
{
    public class FavoriteDto
    {
        public int Id {get; set;}
        public int VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public bool IsChosen {get; set;} 
    }
}