using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class removeHeroSection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Banner_HeroSection_HeroSectionId",
                table: "Banner");

            migrationBuilder.DropForeignKey(
                name: "FK_BannerGrid_HeroSection_HeroSectionId",
                table: "BannerGrid");

            migrationBuilder.DropForeignKey(
                name: "FK_Section_HeroSection_HeroSectionId",
                table: "Section");

            migrationBuilder.DropTable(
                name: "HeroSection");

            migrationBuilder.DropIndex(
                name: "IX_Section_HeroSectionId",
                table: "Section");

            migrationBuilder.DropIndex(
                name: "IX_BannerGrid_HeroSectionId",
                table: "BannerGrid");

            migrationBuilder.DropIndex(
                name: "IX_Banner_HeroSectionId",
                table: "Banner");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HeroSection",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeroSection", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Section_HeroSectionId",
                table: "Section",
                column: "HeroSectionId");

            migrationBuilder.CreateIndex(
                name: "IX_BannerGrid_HeroSectionId",
                table: "BannerGrid",
                column: "HeroSectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Banner_HeroSectionId",
                table: "Banner",
                column: "HeroSectionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Banner_HeroSection_HeroSectionId",
                table: "Banner",
                column: "HeroSectionId",
                principalTable: "HeroSection",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BannerGrid_HeroSection_HeroSectionId",
                table: "BannerGrid",
                column: "HeroSectionId",
                principalTable: "HeroSection",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Section_HeroSection_HeroSectionId",
                table: "Section",
                column: "HeroSectionId",
                principalTable: "HeroSection",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
