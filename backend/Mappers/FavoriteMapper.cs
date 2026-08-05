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
                VendorName = favorite.Vendor.Name
            };
        }
    }
}