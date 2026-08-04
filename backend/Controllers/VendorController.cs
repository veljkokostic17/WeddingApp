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
            var vendors = _context.Vendors.Include(v => v.Category).Include(v => v.Photos).Include(v => v.UnavailableDates).ToList().Select(v => v.ToVendorDto());

            return Ok(vendors);
        }
        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var vendor = _context.Vendors.Include(v => v.Category).Include(v => v.Photos).Include(v => v.UnavailableDates).FirstOrDefault(v => v.Id == id);

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

            var created = _context.Vendors
                .Include(v => v.Category).Include(v => v.Photos).Include(v => v.UnavailableDates)
                .FirstOrDefault(v => v.Id == vendorModel.Id);

            return CreatedAtAction(nameof(GetById), new { id = vendorModel.Id }, created!.ToVendorDto());
        }

        [HttpPut("{id}")]
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
            
            _context.SaveChanges();

             var created = _context.Vendors
                .Include(v => v.Category).Include(v => v.Photos).Include(v => v.UnavailableDates)
                .FirstOrDefault(v => v.Id == vendorModel.Id);

            return Ok (created!.ToVendorDto());
        }
        [HttpDelete("{id}")]
        public IActionResult Delete ([FromRoute] int id)
        {
            var vendorModel = _context.Vendors.FirstOrDefault(u => u.Id == id);

            if (vendorModel == null)
            {
                return NotFound();
            }

            _context.Vendors.Remove(vendorModel);
            _context.SaveChanges();

            return NoContent();
            
        }

        //PHOTO REGULATION 
        [HttpPost("{vendorId}/photos")]

        public IActionResult AddPhoto ([FromRoute] int vendorId, [FromBody] CreateVendorPhotoDto photoDto)
        {
            var photoModel = photoDto.ToVendorPhotoFromCreateDto(vendorId);
            _context.Photos.Add(photoModel);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new {id = vendorId}, photoModel.ToVendorPhotoDto());
        }

        [HttpDelete("{vendorId}/photos/{photoId}")]
        public IActionResult DeletePhoto ([FromRoute] int photoId)
        {
            var photoModel = _context.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photoModel == null)
            {
                return NotFound();
            }
            
            _context.Photos.Remove(photoModel);
            _context.SaveChanges();

            return NoContent();
        }
        // UNAVAILABLE DATES REGULATION\
        [HttpPost("{vendorId}/dates")]
        public IActionResult AddUnavailableDate ([FromRoute] int vendorId, [FromBody] CreateVendorUnavailableDateDto dateDto)
        {
            var dateModel = dateDto.ToVendorUnavailableDateFromCreateDto(vendorId);
            _context.VendorUnavailableDates.Add(dateModel);
            _context.SaveChanges();

            return CreatedAtAction (nameof(GetById), new {id = vendorId}, dateModel.ToVendorUnavailableDateDto());
        }

        [HttpDelete("{vendorId}/dates/{dateId}")]
        public IActionResult DeleteUnavailableDate ([FromRoute] int dateId)
        {
            var dateModel = _context.VendorUnavailableDates.FirstOrDefault(v => v.Id == dateId);

            if (dateModel == null)
            {
                return NotFound();
            }

            _context.VendorUnavailableDates.Remove(dateModel);
            _context.SaveChanges();

            return NoContent();
        }
    } 
}