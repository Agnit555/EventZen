using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Dapper;
using BudgetService.Models;

namespace BudgetService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly IConfiguration _config;

        public BudgetController(IConfiguration config)
        {
            _config = config;
        }

        private NpgsqlConnection GetConnection()
        {
            return new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        }

        // CREATE / SAVE BUDGET (UPSERT)
        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] Expense expense)
        {
            using var conn = GetConnection();

            // AUTO CALCULATION
            expense.TotalExpense = expense.VenueCost + expense.FoodCost + expense.LogisticsCost;
            expense.RemainingBudget = expense.TotalBudget - expense.TotalExpense;

            var query = @"
                INSERT INTO expenses 
                (eventid, eventname, total_budget, venue_cost, food_cost, logistics_cost, total_expense, remaining_budget)
                VALUES
                (@EventId, @EventName, @TotalBudget, @VenueCost, @FoodCost, @LogisticsCost, @TotalExpense, @RemainingBudget)

                ON CONFLICT (eventid)
                DO UPDATE SET
                eventname = EXCLUDED.eventname,
                total_budget = EXCLUDED.total_budget,
                venue_cost = EXCLUDED.venue_cost,
                food_cost = EXCLUDED.food_cost,
                logistics_cost = EXCLUDED.logistics_cost,
                total_expense = EXCLUDED.total_expense,
                remaining_budget = EXCLUDED.remaining_budget;
            ";

            await conn.ExecuteAsync(query, expense);

            return Ok(new { message = "Budget saved successfully" });
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            using var conn = GetConnection();

            var data = await conn.QueryAsync(@"
                SELECT 
                    eventid AS EventId,
                    eventname AS EventName,
                    total_budget AS TotalBudget,
                    venue_cost AS VenueCost,
                    food_cost AS FoodCost,
                    logistics_cost AS LogisticsCost,
                    total_expense AS TotalExpense,
                    remaining_budget AS RemainingBudget
                FROM expenses
            ");

            return Ok(data);
        }

        
        [HttpGet("events")]
        public async Task<IActionResult> GetEvents()
        {
            using var client = new HttpClient();

            var response = await client.GetAsync("http://localhost:8080/events");

            var data = await response.Content.ReadAsStringAsync();

            return Content(data, "application/json");
        }

        // ✅ GET BUDGET BY EVENT ID (FIXED MAPPING 🔥)
        [HttpGet("{eventId}")]
        public async Task<IActionResult> GetByEvent(int eventId)
        {
            using var conn = GetConnection();

            var data = await conn.QueryFirstOrDefaultAsync(@"
                SELECT 
                    eventid AS EventId,
                    eventname AS EventName,
                    total_budget AS TotalBudget,
                    venue_cost AS VenueCost,
                    food_cost AS FoodCost,
                    logistics_cost AS LogisticsCost,
                    total_expense AS TotalExpense,
                    remaining_budget AS RemainingBudget
                FROM expenses 
                WHERE eventid = @eventId
            ", new { eventId });

            if (data == null)
                return NotFound();

            return Ok(data);
        }
    }
}
