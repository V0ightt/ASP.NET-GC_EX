// Data/ExpensesDbContext.cs   (rename if you like)
using ExpenseManager.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ExpensesDbContext
    : IdentityDbContext<ApplicationUser>          // <- change this
{
    public ExpensesDbContext(DbContextOptions<ExpensesDbContext> options)
        : base(options) { }

    public DbSet<Expense> Expenses { get; set; }   // keep your table

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Expense>()
               .HasOne(e => e.User)
               .WithMany()                     // we don’t need navigation the other way yet
               .HasForeignKey(e => e.ApplicationUserId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
