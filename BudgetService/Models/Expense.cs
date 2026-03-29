namespace BudgetService.Models
{
    public class Expense
    {
        public int EventId { get; set; }
        public string? EventName { get; set; }

        public decimal TotalBudget { get; set; }
        public decimal VenueCost { get; set; }
        public decimal FoodCost { get; set; }
        public decimal LogisticsCost { get; set; }

        public decimal TotalExpense { get; set; }
        public decimal RemainingBudget { get; set; }
    }
}