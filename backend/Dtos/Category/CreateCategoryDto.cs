using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Category
{
    public class CreateCategoryDto
    {
        [Required]
        [StringLength(50)]
        public string Name {get; set;} = string.Empty;
    }
}
