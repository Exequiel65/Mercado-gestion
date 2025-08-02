using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSocialMediaBusiness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GoogleMapsUrl",
                table: "Business",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IconUrl",
                table: "Business",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LegendUrl",
                table: "Business",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Business",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SocialMediaId",
                table: "Business",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SocialMedia",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Instagram = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Facebook = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Twitter = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialMedia", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Business_SocialMediaId",
                table: "Business",
                column: "SocialMediaId",
                unique: true,
                filter: "[SocialMediaId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Business_SocialMedia_SocialMediaId",
                table: "Business",
                column: "SocialMediaId",
                principalTable: "SocialMedia",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Business_SocialMedia_SocialMediaId",
                table: "Business");

            migrationBuilder.DropTable(
                name: "SocialMedia");

            migrationBuilder.DropIndex(
                name: "IX_Business_SocialMediaId",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "GoogleMapsUrl",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "IconUrl",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "LegendUrl",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "SocialMediaId",
                table: "Business");
        }
    }
}
