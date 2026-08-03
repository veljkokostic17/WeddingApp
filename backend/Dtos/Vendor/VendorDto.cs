namespace backend.Dtos.Vendor
{
    public class VendorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? InstagramUrl {get ;set;}
        public string CategoryName { get; set; } = string.Empty;
        public int? Capacity {get; set;}
        public bool IsActive { get; set; }
        public string? TableSize {get; set;}
        public DateTime CreatedAt {get; set; } = DateTime.UtcNow;
    }
}