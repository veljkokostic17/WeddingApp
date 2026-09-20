using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Vendor
{
    // Every property is nullable on purpose: null means "leave this field
    // alone", which is what lets a caller send one field instead of all ten.
    //
    // The cost is that PATCH cannot CLEAR a nullable field (null is already
    // spoken for) — use PUT for that. [Required] is therefore absent
    // throughout; the other attributes all pass on null already, so they
    // validate only the fields actually sent.
    public class PatchVendorDto
    {
        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        [Phone]
        [StringLength(30)]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(200)]
        public string? Email { get; set; }

        [Url]
        [StringLength(300)]
        public string? InstagramUrl { get; set; }

        [Range(1, int.MaxValue)]
        public int? CategoryId { get; set; }

        public bool? IsActive { get; set; }

        [Range(1, 5000)]
        public int? Capacity { get; set; }

        [StringLength(50)]
        public string? TableSize { get; set; }

        [StringLength(1000)]
        public string? Offerings { get; set; }
    }
}
