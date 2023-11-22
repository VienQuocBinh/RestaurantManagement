using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase {
        private readonly RestaurantDbContext _context;

        public OrderController(RestaurantDbContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderMaster>>> Get() {
            var orderMasters = await _context.OrderMasters.ToListAsync();
            List<Customer> customers = _context.Customers.ToList();
            orderMasters.ForEach(om => {
                Customer customer = customers.FirstOrDefault(c => c.CustomerId == om.CustomerId);
                om.Customer = new Customer {
                    CustomerId = customer.CustomerId,
                    CustomerName = customer.CustomerName
                };
            });
            return orderMasters;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderMaster>> GetOrderMaster(long id) {

            // get fooditem from order detail
            var orderDetails = await (from master in _context.Set<OrderMaster>()
                                      join detail in _context.Set<OrderDetail>()
                                      on master.OrderMasterId equals detail.OrderMasterId
                                      join foodItem in _context.Set<FoodItem>()
                                      on detail.FoodItemId equals foodItem.FoodItemId
                                      where master.OrderMasterId == id
                                      select new {
                                          master.OrderMasterId,
                                          detail.OrderDetailId,
                                          detail.FoodItemId,
                                          detail.Quantity,
                                          detail.FoodItemPrice,
                                          foodItem.FoodItemName
                                      }).ToListAsync();
            // get order master (getFreshModelObject in FE)
            var orderMaster = await (from master in _context.Set<OrderMaster>()
                                     where master.OrderMasterId == id
                                     select new {
                                         master.OrderMasterId,
                                         master.OrderNumber,
                                         master.CustomerId,
                                         master.PMethod,
                                         master.GTotal,
                                         deletedOrderItemIds = "",
                                         orderDetails = orderDetails
                                     }).FirstOrDefaultAsync();
            if (orderMaster == null) {
                return NotFound();
            }

            return Ok(orderMaster);
            //return FindById(id);
        }

        [HttpPost]
        public async Task<ActionResult<OrderMaster>> PostOrderMaster(OrderMaster orderMaster) {
            _context.OrderMasters.Add(orderMaster);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetOrderMaster", new { id = orderMaster.OrderMasterId }, orderMaster);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(long id, OrderMaster orderMaster) {
            if (id != orderMaster.OrderMasterId) {
                return BadRequest();
            }
            _context.Entry(orderMaster).State = EntityState.Modified;

            // existing food items & newly food items
            foreach (OrderDetail orderDetail in orderMaster.OrderDetails) {
                if (orderDetail.OrderDetailId == 0) {
                    _context.OrderDetails.Add(orderDetail);
                }
                else {
                    _context.Entry(orderDetail).State = EntityState.Modified;
                }
            }

            // deleted items
            foreach (var item in orderMaster.DeletedOrderItemIds.Split(',').Where(x => x != "")) {
                OrderDetail orderDetail = _context.OrderDetails.Find(Convert.ToInt64(item));
                _context.OrderDetails.Remove(orderDetail);
            }

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (_context.OrderMasters.FindAsync(id) == null) {
                    return NotFound();
                }
                else {
                    throw;

                }
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id) {
            var orderMaster = await _context.OrderMasters.FindAsync(id);
            if (orderMaster == null) {
                return NotFound();
            }
            _context.OrderMasters.Remove(orderMaster);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
