using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RestaurantAPI.Controllers {

    [Route("api/[controller]")]
    [ApiController]
    public class FoodItemController : ControllerBase {
        private readonly RestaurantDbContext _context;

        public FoodItemController(RestaurantDbContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodItem>>> Get() {
            return await _context.FoodItems.ToListAsync();
        }

        [HttpGet("{id}")]
        public FoodItem GetById(int id) {
            return _context.FoodItems.FirstOrDefault(fi => fi.FoodItemId == id);
        }
    }
}
