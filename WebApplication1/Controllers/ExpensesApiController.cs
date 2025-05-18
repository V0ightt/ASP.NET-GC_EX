using ExpenseManager.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ExpensesController : ControllerBase
{
    private readonly ExpensesDbContext _ctx;

    public ExpensesController(ExpensesDbContext ctx) => _ctx = ctx;

    private string? CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier);
    private bool IsAdmin => User.IsInRole("Admin");

    // GET api/v1/expenses
    [HttpGet]
    public ActionResult<IEnumerable<Expense>> GetAll()
    {
        if (CurrentUserId == null) return Unauthorized();

        var list = IsAdmin
            ? _ctx.Expenses.ToList()
            : _ctx.Expenses.Where(e => e.ApplicationUserId == CurrentUserId).ToList();

        return Ok(list);
    }

    // GET api/v1/expenses/5
    [HttpGet("{id:int}")]
    public ActionResult<Expense> Get(int id)
    {
        if (CurrentUserId == null) return Unauthorized();

        var exp = _ctx.Expenses.Find(id);
        if (exp == null) return NotFound();

        if (!IsAdmin && exp.ApplicationUserId != CurrentUserId) return Forbid();

        return Ok(exp);
    }

    // POST api/v1/expenses
    [HttpPost]
    public ActionResult<Expense> Create(ExpenseDto model)
    {
        if (CurrentUserId == null) return Unauthorized();

        var expense = new Expense
        {
            Value = model.Value,
            Property = model.Property,
            ApplicationUserId = CurrentUserId
        };

        _ctx.Expenses.Add(expense);
        _ctx.SaveChanges();

        return CreatedAtAction(nameof(Get), new { id = expense.Id }, expense);
    }

    // PUT api/v1/expenses/5
    [HttpPut("{id:int}")]
    public IActionResult Update(int id, ExpenseDto dto)
    {
        if (CurrentUserId == null) return Unauthorized();

        var exp = _ctx.Expenses.Find(id);
        if (exp == null) return NotFound();

        if (!IsAdmin && exp.ApplicationUserId != CurrentUserId) return Forbid();

        exp.Value = dto.Value;
        exp.Property = dto.Property;

        _ctx.SaveChanges();
        return NoContent();
    }

    // DELETE api/v1/expenses/5
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        if (CurrentUserId == null) return Unauthorized();

        var exp = _ctx.Expenses.Find(id);
        if (exp == null) return NotFound();

        if (!IsAdmin && exp.ApplicationUserId != CurrentUserId) return Forbid();

        _ctx.Expenses.Remove(exp);
        _ctx.SaveChanges();
        return NoContent();
    }
}

// DTO for input to prevent overposting
public class ExpenseDto
{
    public decimal Value { get; set; }
    public string? Property { get; set; }
}

