using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBusinessConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BusinesConfig",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BusinessId = table.Column<int>(type: "int", nullable: false),
                    HasPaymentMethod = table.Column<bool>(type: "bit", nullable: false),
                    RedirectToWsp = table.Column<bool>(type: "bit", nullable: false),
                    HasAppliedCoupon = table.Column<bool>(type: "bit", nullable: false),
                    HasShippingMethod = table.Column<bool>(type: "bit", nullable: false),
                    HasFreeShipping = table.Column<bool>(type: "bit", nullable: false),
                    FreeShippingMinValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HasDevolution = table.Column<bool>(type: "bit", nullable: false),
                    DevolutionDays = table.Column<int>(type: "int", nullable: false),
                    HasNewsletter = table.Column<bool>(type: "bit", nullable: false),
                    IsMaintenance = table.Column<bool>(type: "bit", nullable: false),
                    IsMaintenanceDashboard = table.Column<bool>(type: "bit", nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinesConfig", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusinesConfig_Business_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Business",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BusinesConfig_BusinessId",
                table: "BusinesConfig",
                column: "BusinessId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BusinesConfig");
        }
    }
}
