using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Data;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.DataProtection.KeyManagement.Internal;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoriteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public FavoriteController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var favorites = await _context.Favorites
                .Include(f => f.Vendor).ThenInclude(v => v.Photos.OrderBy(p => p.SortOrder))
                .Include(f => f.Vendor).ThenInclude(v => v.Category)
                .Where(f => f.UserId == userId)
                .AsNoTracking()
                .ToListAsync();

            var favoriteDtos = favorites.Select(f => f.ToFavoriteDto());

            return Ok(favoriteDtos);
        }

        [HttpPost("{vendorId}")]
        public async Task<IActionResult> Add([FromRoute] int vendorId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var alreadyFavorited = await _context.Favorites.AnyAsync(f => f.UserId == userId && f.VendorId == vendorId);

            if (alreadyFavorited)
            {
                return BadRequest("Vendor is already in favorites");
            }

            var favoriteModel = new Favorite
            {
                UserId = userId!,
                VendorId = vendorId,
            };

            _context.Favorites.Add(favoriteModel);
            await _context.SaveChangesAsync();

            var created = await _context.Favorites
                .Include(f => f.Vendor).ThenInclude(v => v.Photos.OrderBy(p => p.SortOrder))
                .Include(f => f.Vendor).ThenInclude(v => v.Category)
                .FirstOrDefaultAsync(f => f.Id == favoriteModel.Id);

            return CreatedAtAction(nameof(GetAll), created!.ToFavoriteDto());
        }

        [HttpDelete("{vendorId}")]
        public async Task<IActionResult> Remove([FromRoute] int vendorId)
        {
            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var favoriteModel = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == user && f.VendorId == vendorId);

            if (favoriteModel == null)
            {
                return NotFound();
            }

            _context.Favorites.Remove(favoriteModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{vendorId}/choose")]
        public async Task<IActionResult> ChosenWeddingVendorSelect([FromRoute] int vendorId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Photos/Category are loaded here purely so relationship fixup gives
            // ToFavoriteDto() what it needs at the end — see the DTO's fields.
            var vendor = await _context.Vendors
                .Include(v => v.Photos.OrderBy(p => p.SortOrder))
                .Include(v => v.Category)
                .FirstOrDefaultAsync(v => v.Id == vendorId);
           
            if (vendor == null)
            {
                return NotFound("Vendor does not exist");
            }

             var target = await _context.Favorites
                        .FirstOrDefaultAsync(f => f.UserId == userId && f.VendorId == vendorId); 
        
            if (target == null)
            {
                target = new Favorite { UserId = userId!, VendorId = vendorId };
                    _context.Favorites.Add(target);
            }



            var siblings = await _context.Favorites
                .Where(f => f.UserId == userId
                            && f.Vendor.CategoryId == vendor.CategoryId
                            && f.VendorId != vendorId)
                .ToListAsync();


            foreach (var fav in siblings)
            {
                fav.IsChosen = false;
            }

            target.IsChosen = true;

            await _context.SaveChangesAsync();

            return Ok(target.ToFavoriteDto());
        }
    }
 }
