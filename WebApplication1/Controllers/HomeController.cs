using ExpenseManager.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Security.Claims;
namespace ExpenseManager.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ExpensesDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public HomeController(ILogger<HomeController> logger, ExpensesDbContext context, UserManager<ApplicationUser> userManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
    }

    public IActionResult Index()
    {
        return View();
    }
    [Authorize]
    public IActionResult Expenses()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var expenses = User.IsInRole("Admin")
            ? _context.Expenses.ToList()                 // Admin sees all
            : _context.Expenses
                     .Where(e => e.ApplicationUserId == userId)
                     .ToList();

        ViewBag.TotalExpenses = expenses.Sum(e => e.Value);
        return View(expenses);
    }

    [Authorize]
    public IActionResult AddEditExpenses(int? id)
    {
        if (id == null) return View();                 // create

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var expense = _context.Expenses.Find(id);

        if (expense == null) return NotFound();
        if (!User.IsInRole("Admin") && expense.ApplicationUserId != userId)
            return Forbid();

        return View(expense);
    }
    public IActionResult DeleteExpense(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var exp = _context.Expenses.Find(id);

        if (exp == null) return NotFound();
        if (!User.IsInRole("Admin") && exp.ApplicationUserId != userId)
            return Forbid();

        _context.Expenses.Remove(exp);
        _context.SaveChanges();
        return RedirectToAction("Expenses");
    }

    public IActionResult AddEditExpensesForm(Expense model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (model.Id == 0)                    // NEW expense
        {
            model.ApplicationUserId = userId; // bind owner
            _context.Expenses.Add(model);
        }
        else
        {
            // SECURITY: make sure the current user owns it unless they're Admin
            var existing = _context.Expenses.Find(model.Id);
            if (existing == null) return NotFound();

            if (!User.IsInRole("Admin") && existing.ApplicationUserId != userId)
                return Forbid();

            existing.Value = model.Value;
            existing.Property = model.Property;
        }

        _context.SaveChanges();
        return RedirectToAction("Expenses");
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
