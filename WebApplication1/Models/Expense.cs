using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseManager.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public decimal Value { get; set; }

        public string? Property { get; set; }

        public string ApplicationUserId { get; set; }  // nvarchar(450) matches Identity PK
        [ForeignKey(nameof(ApplicationUserId))]
        public ApplicationUser User { get; set; }

    }
}
