using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class WebConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WebConfig",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HasPaymentMethod = table.Column<bool>(type: "bit", nullable: false),
                    RedirectToWsp = table.Column<bool>(type: "bit", nullable: false),
                    HasApplyCoupon = table.Column<bool>(type: "bit", nullable: false),
                    EnabledShipping = table.Column<bool>(type: "bit", nullable: false),
                    HasFreeShipping = table.Column<bool>(type: "bit", nullable: false),
                    FreeShippingAmount = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    TitleShipping = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DescriptionShipping = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EnabledDevolution = table.Column<bool>(type: "bit", nullable: false),
                    DevolutionDays = table.Column<int>(type: "int", nullable: false),
                    TitleDevolution = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DescriptionDevolution = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HasSubscription = table.Column<bool>(type: "bit", nullable: false),
                    IsMaintenance = table.Column<bool>(type: "bit", nullable: false),
                    EnabledWeb = table.Column<bool>(type: "bit", nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebConfig", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WebConfig");
        }
    }
}
