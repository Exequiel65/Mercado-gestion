import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";


export default [
    layout("./routes/Welcome/_layoutWelcome.tsx", [
        index("./routes/Welcome/WelcomeCreatOrPage.tsx"),
        route("register", "./routes/Welcome/RegisterPage.tsx"),
        route("create-organization", "./routes/Welcome/CreateOrganizationPage.tsx"),
        route("create-store", "./routes/Welcome/CreateStorePage.tsx"),
        route("validate", "./routes/Welcome/OrganizationValidationPage.tsx"),
    ]),

    layout("./routes/_layoutMain.tsx", [
        ...prefix("admin", [
            layout("./routes/Auth/layoutAuth.tsx", [
                route("login", "./routes/Auth/login.tsx")
            ]),
            layout("./routes/_layoutPrivates.tsx", [
                index("routes/home.tsx"),

                ...prefix("user", [
                    index("./routes/Users/Users.tsx"),
                    route(":id", "./routes/Users/detail.tsx")
                ]),

                ...prefix("business", [
                    layout("./routes/Business/_layoutBusiness.tsx", [
                        index("./routes/Business/Business.tsx")
                    ])
                ]),
                ...prefix("webconfig", [
                    layout("./routes/WebConfig/_layoutBusiness.tsx", [
                        index("./routes/WebConfig/Config.tsx"),
                        route("design", "./routes/WebConfig/Design.tsx"),
                        route("terms", "./routes/WebConfig/Terms.tsx"),
                        route("policy", "./routes/WebConfig/Policy.tsx"),
                        route("frequently-question", "./routes/WebConfig/FrequentlyQuestions.tsx")
                    ])
                ]),

                route("category", "./routes/Categories/Categories.tsx"),

                ...prefix("products", [
                    index("./routes/Products/Products.tsx"),
                    route("add", "./routes/Products/AddProduct.tsx"),
                    route(":id/edit", "./routes/Products/EditProduct.tsx")
                ]),
            ])
        ])
    ])
] satisfies RouteConfig;
