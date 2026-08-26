using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Helpers
{
    public static class VendorQueries
    {
        public static IQueryable<Vendor> WithDetails (this IQueryable<Vendor> query) =>
            query
                .Include(v => v.Category)
                .Include(v => v.Photos.OrderBy(p => p.SortOrder))
                .Include(v => v.UnavailableDates);
    }
}