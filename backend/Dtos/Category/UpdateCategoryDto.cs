using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Category
{
    public class UpdateCategoryDto
    {
        [Required]
        [StringLength(50)]
        public string Name {get; set;} = string.Empty;
    }
}
