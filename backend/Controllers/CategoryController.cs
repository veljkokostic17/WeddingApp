using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Category;
using backend.Dtos.Vendor;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories.ToListAsync();
            var categoryDtos = categories.Select(c => c.ToCategoryDto());

            return Ok (categoryDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById ([FromRoute] int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(u => u.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok (category.ToCategoryDto());
        }

        [HttpPost]
        public async Task<IActionResult> Create ([FromBody] CreateCategoryDto categoryDto)
        {
            var categoryModel = categoryDto.ToCategoryFromCreateDto();

            _context.Categories.Add(categoryModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new {id = categoryModel.Id}, categoryModel.ToCategoryDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update ([FromRoute] int id, [FromBody] UpdateCategoryDto categoryDto)
        {
            var categoryModel = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (categoryModel == null)
            {
                return NotFound();
            }

            categoryModel.Name = categoryDto.Name;

            await _context.SaveChangesAsync();
            return Ok (categoryModel.ToCategoryDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete ([FromRoute] int id)
        {
            var categoryModel = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (categoryModel == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(categoryModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
         
    }
}