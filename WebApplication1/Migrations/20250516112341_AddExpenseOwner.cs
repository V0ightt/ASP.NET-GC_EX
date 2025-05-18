using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseManager.Migrations
{
    /// <inheritdoc />
    public partial class AddExpenseOwner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Expenses",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.Sql(@"
            DECLARE @ownerId NVARCHAR(450) = 'PUT-ADMIN-ID-HERE';
            UPDATE Expenses SET ApplicationUserId = @ownerId
            WHERE ApplicationUserId IS NULL;
        ");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_ApplicationUserId",
                table: "Expenses",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_AspNetUsers_ApplicationUserId",
                table: "Expenses",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_AspNetUsers_ApplicationUserId",
                table: "Expenses");

            migrationBuilder.DropIndex(
                name: "IX_Expenses_ApplicationUserId",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Expenses");
        }
    }
}
