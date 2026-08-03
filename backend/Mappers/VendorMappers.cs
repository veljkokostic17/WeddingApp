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
                CategoryName = vendorModel.Category.Name,
                InstagramUrl = vendorModel.InstagramUrl,
                Capacity = vendorModel.Capacity,
                TableSize = vendorModel.TableSize,
                CreatedAt = vendorModel.CreatedAt
            };
        }
    }
}