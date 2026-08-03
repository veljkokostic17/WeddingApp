using backend.Data;
using backend.Dtos.Vendor;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client.Extensions.Msal;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VendorController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        public VendorController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var vendors = _context.Vendors.Include(v => v.Category).ToList().Select(v => v.ToVendorDto());

            return Ok(vendors);
        }
        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var vendor = _context.Vendors.Include(v => v.Category).FirstOrDefault(v => v.Id == id);

            if (vendor == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(vendor.ToVendorDto());
            }
        }
        [HttpPost]
        public IActionResult Create([FromBody] CreateVendorDto vendorDto)
        {
            var vendorModel = vendorDto.ToVendorFromCreateDTO();
            _context.Vendors.Add(vendorModel);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new {id = vendorModel.Id}, vendorModel.ToVendorDto());
        }

        [HttpPut]
        public IActionResult Update([FromRoute] int id, [FromBody] UpdateVendorDto updateDto)
        {
            var vendorModel = _context.Vendors.FirstOrDefault(u => u.Id == id);

            if (vendorModel == null)
            {
                return NotFound();
            }
            
            vendorModel.Name = updateDto.Name;
            vendorModel.Description = updateDto.Description;
            vendorModel.Address = updateDto.Address;
            vendorModel.Phone = updateDto.Phone;      
            vendorModel.Email = updateDto.Email;
            vendorModel.InstagramUrl = updateDto.InstagramUrl;   
            vendorModel.CategoryId = updateDto.CategoryId;
            vendorModel.IsActive = updateDto.IsActive;   
            vendorModel.Capacity = updateDto.Capacity;
            vendorModel.TableSize = updateDto.TableSize;   

            return Ok (vendorModel.ToVendorDto());
        }
    }
}