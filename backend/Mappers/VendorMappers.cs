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
                CreatedAt = vendorModel.CreatedAt,
                Photos = vendorModel.Photos.Select(p => p.ToVendorPhotoDto()).ToList(),
                UnavailableDates = vendorModel.UnavailableDates.Select(p => p.ToVendorUnavailableDateDto()).ToList()
            };
        }

         public static VendorListItemDto ToVendorListItemDto (this Vendor vendorModel)
        {
            return new VendorListItemDto
            {
                Id = vendorModel.Id,
                Name = vendorModel.Name,               
                Address = vendorModel.Address,
                Capacity = vendorModel.Capacity,
                CoverPhotoUrl = vendorModel.Photos.FirstOrDefault()?.ImageUrl
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
        public static VendorPhotoDto ToVendorPhotoDto (this VendorPhoto photoModel)
        {
            return new VendorPhotoDto
            {
                Id = photoModel.Id,
                ImageUrl = photoModel.ImageUrl,
                SortOrder = photoModel.SortOrder
            };
        }

        public static VendorPhoto ToVendorPhotoFromCreateDto (this CreateVendorPhotoDto photoDto, int vendorId)
        {
            return new VendorPhoto
            {
                ImageUrl = photoDto.ImageUrl,
                SortOrder = photoDto.SortOrder,
                VendorId = vendorId
            };
        }
        public static VendorUnavailableDateDto ToVendorUnavailableDateDto (this VendorUnavailableDate dateModel)
        {
            return new VendorUnavailableDateDto
            {
                Id = dateModel.Id,
                Date = dateModel.Date
            };
        }

        public static VendorUnavailableDate ToVendorUnavailableDateFromCreateDto (this CreateVendorUnavailableDateDto dateDto, int vendorId)
        {
            return new VendorUnavailableDate
            {
                Date = dateDto.Date,
                VendorId = vendorId
            };
        }



    }
}