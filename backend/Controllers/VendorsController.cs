using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VendorsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        public VendorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var vendors = new[]
            {
                new { Id = 1, Name = "Adriaticum Events", Category = "Decoration"},
                new { Id = 2, Name = "Romantic Bend", Category = "Band"},
                new { Id = 3, Name = "Ormaj", Category = "Jewerly"}
            };

            return Ok(vendors);
        }
    }
}