using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Vendor;
using backend.Models;

namespace backend.Mappers
{
    public static class VendorMappers
    {
        public static VendorDto ToVendorDto (this Vendor vendorModel)
        {
            return new VendorDto
            {
                Id = vendorModel.Id,
                Name = vendorModel.Name,
                Description = vendorModel.Description,
                Address = vendorModel.Address,
                Phone = vendorModel.Phone,
                Email = vendorModel.Email,
                IsActive = vendorModel.IsActive,
                CategoryName = vendorModel.Category.Name
            };
        }
    }
}