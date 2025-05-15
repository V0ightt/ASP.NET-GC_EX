using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ExpensesDBContext _context;



    public HomeController(ILogger<HomeController> logger, ExpensesDBContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Expenses()
    {
        var allExpenses = _context.Expenses.ToList();

        var totalExpenses = allExpenses.Sum(e => e.Value);

        ViewBag.TotalExpenses = totalExpenses;
        return View(allExpenses);
    }
    public IActionResult AddEditExpenses(int? id)
    {
        if (id != null)
        {
           var expenseID = _context.Expenses.Find(id);
            return View(expenseID);
        }
        return View();
    }
    public IActionResult DeleteExpense(int id)
    {
        var expense = _context.Expenses.Find(id);
        if (expense == null)
        {
            return NotFound();
        }
        _context.Expenses.Remove(expense);
        _context.SaveChanges();
        return RedirectToAction("Expenses");
    }

    public IActionResult AddEditExpensesForm(Expense model) {
        if (model.Id == 0)
        {
            _context.Expenses.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Expenses");
        }
        else
        {
            _context.Expenses.Update(model);
            _context.SaveChanges();
        }
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
