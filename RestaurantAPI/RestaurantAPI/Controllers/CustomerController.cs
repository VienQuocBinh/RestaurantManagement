using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase {
        private readonly RestaurantDbContext _context;

        public CustomerController(RestaurantDbContext context) {
            _context = context;
        }

        // GET: Customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> Index() {
            return await _context.Customers.ToListAsync();
        }
        private bool CustomerExists(int id) {
            return (_context.Customers?.Any(e => e.CustomerId == id)).GetValueOrDefault();
        }
    }
}
