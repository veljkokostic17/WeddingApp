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
        public IActionResult GetAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var favorties = _context.Favorites
                .Include(f => f.Vendor)
                .Where(f => f.UserId == userId)
                .ToList()
                .Select(f => f.ToFavoriteDto());

            return Ok(favorties);
        }

        [HttpPost("{vendorId}")]
        public IActionResult Add([FromRoute] int vendorId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var alreadyFavorited = _context.Favorites.Any(f => f.UserId == userId && f.VendorId == vendorId);

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
            _context.SaveChanges();

            var created = _context.Favorites.Include(f => f.Vendor).FirstOrDefault(f => f.Id == favoriteModel.Id);

            return CreatedAtAction(nameof(GetAll), created!.ToFavoriteDto());
        }

        [HttpDelete("{vendorId}")]
        public IActionResult Remove([FromRoute] int vendorId)
        {
            var user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var favoriteModel = _context.Favorites.FirstOrDefault(f => f.UserId == user && f.VendorId == vendorId);

            if (favoriteModel == null)
            {
                return NotFound();
            }

            _context.Favorites.Remove(favoriteModel);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPut("{vendorId}/choose")]
        public IActionResult ChosenWeddingVendorSelect([FromRoute] int vendorId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var target = _context.Favorites
                .Include(f => f.Vendor)
                .FirstOrDefault(f => f.UserId == userId && f.VendorId == vendorId);

            var vendorExists = _context.Vendors.Any(v => v.Id == vendorId);
            if (!vendorExists)
            {
                return NotFound("Vendor does not exist."); 
            }

            if (target == null)
            {
                var newFavorite = new Favorite { UserId = userId!, VendorId = vendorId };
                _context.Favorites.Add(newFavorite);
                _context.SaveChanges();

                target = _context.Favorites
                        .Include(f => f.Vendor).
                        FirstOrDefault(f => f.UserId == userId && f.VendorId == vendorId);
            }

            var siblings = _context.Favorites
                .Include(f => f.Vendor)
                .Where(f => f.UserId == userId
                            && f.Vendor.CategoryId == target!.Vendor.CategoryId
                            && f.VendorId != vendorId)
                .ToList();

            foreach (var fav in siblings)
            {
                fav.IsChosen = false;
            }

            target!.IsChosen = true;

            _context.SaveChanges();

            return Ok (target.ToFavoriteDto());
        }
    }
}