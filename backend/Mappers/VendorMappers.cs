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
        public static Vendor ToVendorFromCreateDTO (this CreateVendorDto vendorDto)
        {
            return new Vendor
            {
              Name = vendorDto.Name,
              Description = vendorDto.Description,
              Address = vendorDto.Address,
              Phone = vendorDto.Phone,
              Email= vendorDto.Email,
              InstagramUrl = vendorDto.InstagramUrl,
              CategoryId = vendorDto.CategoryId,
              IsActive = vendorDto.IsActive,
              Capacity = vendorDto.Capacity,
              TableSize = vendorDto.TableSize
            };
        }
    }
}