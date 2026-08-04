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
        public IActionResult GetAll()
        {
            var categories = _context.Categories.ToList().Select(c => c.ToCategoryDto());

            return Ok (categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetById ([FromRoute] int id)
        {
            var category = _context.Categories.FirstOrDefault(u => u.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok (category.ToCategoryDto());
        }

        [HttpPost]
        public IActionResult Create ([FromBody] CreateCategoryDto categoryDto)
        {
            var categoryModel = categoryDto.ToCategoryFromCreateDto();

            _context.Categories.Add(categoryModel);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new {id = categoryModel.Id}, categoryModel.ToCategoryDto());
        }

        [HttpPut("{id}")]
        public IActionResult Update ([FromRoute] int id, [FromBody] UpdateCategoryDto categoryDto)
        {
            var categoryModel = _context.Categories.FirstOrDefault(c => c.Id == id);

            if (categoryModel == null)
            {
                return NotFound();
            }

            categoryModel.Name = categoryDto.Name;

            _context.SaveChanges();
            return Ok (categoryModel.ToCategoryDto());
        }

        [HttpDelete("{id}")]
        public IActionResult Delete ([FromRoute] int id)
        {
            var categoryModel = _context.Categories.FirstOrDefault(c => c.Id == id);

            if (categoryModel == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(categoryModel);
            _context.SaveChanges();

            return NoContent();
        }
         
    }
}