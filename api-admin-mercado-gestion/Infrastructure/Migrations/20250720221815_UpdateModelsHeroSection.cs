using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelsHeroSection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeroSectionId",
                table: "Section");

            migrationBuilder.RenameColumn(
                name: "HeroSectionId",
                table: "BannerGrid",
                newName: "EntityId");

            migrationBuilder.RenameColumn(
                name: "HeroSectionId",
                table: "Banner",
                newName: "EntityId");

            migrationBuilder.AddColumn<int>(
                name: "EntityId",
                table: "ItemBannerGrid",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntityId",
                table: "ItemBannerGrid");

            migrationBuilder.RenameColumn(
                name: "EntityId",
                table: "BannerGrid",
                newName: "HeroSectionId");

            migrationBuilder.RenameColumn(
                name: "EntityId",
                table: "Banner",
                newName: "HeroSectionId");

            migrationBuilder.AddColumn<int>(
                name: "HeroSectionId",
                table: "Section",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
