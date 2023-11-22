using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantAPI.Models {
    public class OrderMaster {
        [Key]
        public long OrderMasterId { get; set; }
        [Column(TypeName = "nvarchar(75)")]
        public string OrderNumber { get; set; }
        public int CustomerId { get; set; }
        // public Customer Customer { get; set; } // navigation prop
        [Column(TypeName = "nvarchar(10)")]
        public string PMethod { get; set; }
        public decimal GTotal { get; set; }

        public List<OrderDetail> OrderDetails { get; set; }
        [NotMapped] // Because take from FE
        public string DeletedOrderItemIds { get; set; }
        [NotMapped]
        public Customer Customer { get; set; }
    }
}
