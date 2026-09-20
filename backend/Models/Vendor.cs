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
        public string? Address {get; set;}
        public string Phone {get; set;} = string.Empty;
        public string? Email {get; set;}
        public string? InstagramUrl {get ;set;}
        public int CategoryId {get; set;}
        public Category Category {get; set;} = null!;
        public bool IsActive {get; set;}
        public int? Capacity {get; set;}
        public string? TableSize {get; set;}
        // Newline-delimited bullet list for the "Šta nudimo" section. A loose
        // column rather than a VendorOffering entity: the lines carry no fields
        // of their own, line order is display order, and editing is one PATCH
        // instead of POST-and-DELETE per row.
        public string? Offerings {get; set;}
        public DateTime CreatedAt {get; set; } = DateTime.UtcNow;
        public List<VendorPhoto> Photos {get; set;} = new();
        public List<VendorUnavailableDate> UnavailableDates {get; set;} = new();
        

    }
}