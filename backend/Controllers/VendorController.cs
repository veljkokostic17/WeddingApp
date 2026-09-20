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
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == vendorDto.CategoryId);

            if (!categoryExists)
            {
                return BadRequest("Category does not exist.");
            }

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

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == updateDto.CategoryId);

            if (!categoryExists)
            {
                return BadRequest("Category does not exist.");
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
            vendorModel.Offerings = updateDto.Offerings;
            
            await _context.SaveChangesAsync();

             var created = await _context.Vendors
                .WithDetails()
                .FirstOrDefaultAsync(v => v.Id == vendorModel.Id);

            return Ok (created!.ToVendorDto());
        }
        // Partial update: send only the fields you want changed. PUT replaces
        // everything, which makes editing one field mean retyping all ten.
        [HttpPatch("{id}")]
        public async Task<IActionResult> Patch([FromRoute] int id, [FromBody] PatchVendorDto patchDto)
        {
            var vendorModel = await _context.Vendors.FirstOrDefaultAsync(u => u.Id == id);

            if (vendorModel == null)
            {
                return NotFound();
            }

            // Only checked when CategoryId was actually sent — otherwise a
            // bogus id FK-violates into a raw 500, same as Create/Update.
            if (patchDto.CategoryId != null)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == patchDto.CategoryId.Value);

                if (!categoryExists)
                {
                    return BadRequest("Category does not exist.");
                }

                vendorModel.CategoryId = patchDto.CategoryId.Value;
            }

            if (patchDto.Name != null) vendorModel.Name = patchDto.Name;
            if (patchDto.Description != null) vendorModel.Description = patchDto.Description;
            if (patchDto.Address != null) vendorModel.Address = patchDto.Address;
            if (patchDto.Phone != null) vendorModel.Phone = patchDto.Phone;
            if (patchDto.Email != null) vendorModel.Email = patchDto.Email;
            if (patchDto.InstagramUrl != null) vendorModel.InstagramUrl = patchDto.InstagramUrl;
            if (patchDto.IsActive != null) vendorModel.IsActive = patchDto.IsActive.Value;
            if (patchDto.Capacity != null) vendorModel.Capacity = patchDto.Capacity.Value;
            if (patchDto.TableSize != null) vendorModel.TableSize = patchDto.TableSize;
            if (patchDto.Offerings != null) vendorModel.Offerings = patchDto.Offerings;

            await _context.SaveChangesAsync();

            var updated = await _context.Vendors
                .WithDetails()
                .FirstOrDefaultAsync(v => v.Id == vendorModel.Id);

            return Ok(updated!.ToVendorDto());
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
            var vendor = await _context.Vendors.AnyAsync(u => u.Id == vendorId);
            if (!vendor)
            {
                return NotFound("Vendor does not exist");
            }

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

            var vendor = await _context.Vendors.AnyAsync(u => u.Id == vendorId);
            if (!vendor)
            {
                return NotFound("Vendor does not exist");
            }

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