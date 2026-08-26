using backend.Data;
using backend.Dtos.Vendor;
using backend.Helpers;
using backend.Mappers;
using backend.Models;
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
        public async Task<IActionResult> GetAll([FromQuery] int? categoryId)
        {

            var query = _context.Vendors.AsNoTracking().WithDetails().Where(v => v.IsActive);

            if (categoryId.HasValue)
                query = query.Where(v => v.CategoryId == categoryId.Value);

            var vendors = await query.ToListAsync();

            return Ok(vendors.Select(v => v.ToVendorDto()));
        }

        // Slim payload for the mobile category-list screen — name/address/capacity/cover photo only.
        [HttpGet("list")]
        public async Task<IActionResult> GetList([FromQuery] int? categoryId)
        {
            var query = _context.Vendors
                .AsNoTracking()
                .Include(v => v.Photos.OrderBy(p => p.SortOrder))
                .Where(v => v.IsActive);

            if (categoryId.HasValue)
                query = query.Where(v => v.CategoryId == categoryId.Value);

            var vendors = await query.ToListAsync();

            return Ok(vendors.Select(v => v.ToVendorListItemDto()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var vendor = await _context.Vendors.AsNoTracking().WithDetails().Where(v => v.IsActive).FirstOrDefaultAsync(v => v.Id == id);

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
        public async Task<IActionResult> Create([FromBody] CreateVendorDto vendorDto)
        {
            var vendorModel = vendorDto.ToVendorFromCreateDTO();
            _context.Vendors.Add(vendorModel);
            await _context.SaveChangesAsync();

            var created = await _context.Vendors
                .WithDetails()
                .FirstOrDefaultAsync(v => v.Id == vendorModel.Id);

            return CreatedAtAction(nameof(GetById), new { id = vendorModel.Id }, created!.ToVendorDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateVendorDto updateDto)
        {
            var vendorModel = await _context.Vendors.FirstOrDefaultAsync(u => u.Id == id);

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
            
            await _context.SaveChangesAsync();

             var created = await _context.Vendors
                .WithDetails()
                .FirstOrDefaultAsync(v => v.Id == vendorModel.Id);

            return Ok (created!.ToVendorDto());
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete ([FromRoute] int id)
        {
            var vendorModel = await _context.Vendors.FirstOrDefaultAsync(u => u.Id == id);

            if (vendorModel == null)
            {
                return NotFound();
            }

            _context.Vendors.Remove(vendorModel);
            await _context.SaveChangesAsync();

            return NoContent();
            
        }

        //PHOTO REGULATION 
        [HttpPost("{vendorId}/photos")]

        public async Task<IActionResult> AddPhoto ([FromRoute] int vendorId, [FromBody] CreateVendorPhotoDto photoDto)
        {
            var photoModel = photoDto.ToVendorPhotoFromCreateDto(vendorId);
            _context.Photos.Add(photoModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new {id = vendorId}, photoModel.ToVendorPhotoDto());
        }

        [HttpDelete("{vendorId}/photos/{photoId}")]
        public async Task<IActionResult> DeletePhoto ([FromRoute] int photoId)
        {
            var photoModel = await _context.Photos.FirstOrDefaultAsync(p => p.Id == photoId);

            if (photoModel == null)
            {
                return NotFound();
            }
            
            _context.Photos.Remove(photoModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // UNAVAILABLE DATES REGULATION\
        [HttpPost("{vendorId}/dates")]
        public async Task<IActionResult> AddUnavailableDate ([FromRoute] int vendorId, [FromBody] CreateVendorUnavailableDateDto dateDto)
        {
            var dateModel = dateDto.ToVendorUnavailableDateFromCreateDto(vendorId);
            _context.VendorUnavailableDates.Add(dateModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction (nameof(GetById), new {id = vendorId}, dateModel.ToVendorUnavailableDateDto());
        }

        [HttpDelete("{vendorId}/dates/{dateId}")]
        public async Task<IActionResult> DeleteUnavailableDate ([FromRoute] int dateId)
        {
            var dateModel = await _context.VendorUnavailableDates.FirstOrDefaultAsync(v => v.Id == dateId);

            if (dateModel == null)
            {
                return NotFound();
            }

            _context.VendorUnavailableDates.Remove(dateModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    } 
}