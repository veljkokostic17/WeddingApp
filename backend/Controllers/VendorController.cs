using backend.Data;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    }
}