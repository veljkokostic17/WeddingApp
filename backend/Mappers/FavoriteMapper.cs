using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Favorite;
using backend.Models;

namespace backend.Mappers
{
    public static class FavoriteMapper
    {
        public static FavoriteDto ToFavoriteDto (this Favorite favorite)
        {
            return new FavoriteDto
            {
                Id = favorite.Id,
                VendorId = favorite.VendorId,
                VendorName = favorite.Vendor.Name,
                Address = favorite.Vendor.Address,
                // Relies on the caller having included Photos ordered by SortOrder.
                CoverPhotoUrl = favorite.Vendor.Photos.FirstOrDefault()?.ImageUrl,
                CategoryId = favorite.Vendor.CategoryId,
                CategoryName = favorite.Vendor.Category.Name,
                IsChosen = favorite.IsChosen
            };
        }
    }
}