import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { Route } from "./+types/root";
import "./app.css";
import Header from "./components/headers/Header";
import Footer from "./components/footer/footer";
import { useLoadConfig } from "./hooks/useLoadConfig";
import { useConfigStore } from "./store/ConfigData";
import { AppLoading } from "./components/AppLoading";
import { AppError } from "./components/AppError";
import { MaintenancePage } from "./components/MaintenancePage";
import NotFound from "./components/NotFound";
import { useLoadCategories } from "./hooks/useLoadCategories";
import { useCategoryStore } from "./store/categoryStore";
import ErrorPage from "./routes/ErrorPage";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: 'icon',
    type: 'image/ico',
    href: "/shopping-cart-304843_640.ico"
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </>);
}

function Main() {
  const { isLoading, isError, error, refetch } = useLoadConfig();
  const catQuery = useLoadCategories();

  const config = useConfigStore((state) => state.config);
  const category = useCategoryStore((state) => state.categories);
  if (isLoading ) return <AppLoading />;
  if (isError || config === null ) return <AppError message={error?.message} onRetry={refetch} />;
  if (catQuery.isError || category === null) return <AppError message={catQuery.error?.message} onRetry={catQuery.refetch} />;
  if (config?.isMaintenance) {
    return <MaintenancePage />;
  }
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-284px)] flex flex-col items-center justify-center text-center p-8">
        {message === "404" ? (
          <NotFound />
        ) : (
          // <>
          //   <h1 className="text-4xl font-bold text-red-600 mb-4">{message}</h1>
          //   <p className="text-lg mb-4">{details} </p>
          //   {stack && (
          //     <pre className="bg-gray-100 text-sm p-4 text-left max-w-2xl overflow-auto rounded">
          //       {stack}
          //     </pre>
          //   )}
          // </>
          <ErrorPage />
        )}

      </main>
      <Footer />
    </>

  );
}
