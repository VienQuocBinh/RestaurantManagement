using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.Models {
    public class OrderDetail {

        [Key]
        public long OrderDetailId { get; set; }
        public long OrderMasterId { get; set; }
        //public OrderMaster OrderMaster { get; set; } // navigation prop
        public int FoodItemId { get; set; }
        //public FoodItem FoodItem { get; set; } // navigation prop
        public decimal FoodItemPrice { get; set; }
        public int Quantity { get; set; }
    }
}
