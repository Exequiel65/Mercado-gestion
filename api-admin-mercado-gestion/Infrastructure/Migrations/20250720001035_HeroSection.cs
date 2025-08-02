using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class HeroSection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "Banner",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    link = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sm = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    md = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    xl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroSectionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Banner", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Banner_HeroSection_HeroSectionId",
                        column: x => x.HeroSectionId,
                        principalTable: "HeroSection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BannerGrid",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroSectionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BannerGrid", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BannerGrid_HeroSection_HeroSectionId",
                        column: x => x.HeroSectionId,
                        principalTable: "HeroSection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Section",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SectionItem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TextButton = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LinkButton = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PositionButton = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShowButtonSlider = table.Column<bool>(type: "bit", nullable: false),
                    SecondLine = table.Column<bool>(type: "bit", nullable: false),
                    HeroSectionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Section", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Section_HeroSection_HeroSectionId",
                        column: x => x.HeroSectionId,
                        principalTable: "HeroSection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemBannerGrid",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TextButton = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LinkButton = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Theme = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    BannerGridId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemBannerGrid", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemBannerGrid_BannerGrid_BannerGridId",
                        column: x => x.BannerGridId,
                        principalTable: "BannerGrid",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Banner_HeroSectionId",
                table: "Banner",
                column: "HeroSectionId");

            migrationBuilder.CreateIndex(
                name: "IX_BannerGrid_HeroSectionId",
                table: "BannerGrid",
                column: "HeroSectionId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemBannerGrid_BannerGridId",
                table: "ItemBannerGrid",
                column: "BannerGridId");

            migrationBuilder.CreateIndex(
                name: "IX_Section_HeroSectionId",
                table: "Section",
                column: "HeroSectionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Banner");

            migrationBuilder.DropTable(
                name: "ItemBannerGrid");

            migrationBuilder.DropTable(
                name: "Section");

            migrationBuilder.DropTable(
                name: "BannerGrid");

            migrationBuilder.DropTable(
                name: "HeroSection");
        }
    }
}
