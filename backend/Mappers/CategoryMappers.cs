using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Category;
using backend.Models;

namespace backend.Mappers
{
    public static class CategoryMappers
    {
        public static CategoryDto ToCategoryDto (this Category categoryModel)
        {
            return new CategoryDto
            {
                Id = categoryModel.Id,
                Name = categoryModel.Name
            };
        }
        
        public static Category ToCategoryFromCreateDto (this CreateCategoryDto categoryDto)
        {
            return new Category
            {
                Name = categoryDto.Name
            };
        }
    }
}