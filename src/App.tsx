
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Enterprise from "@/pages/Enterprise";
import Scenarios from "@/pages/Scenarios";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CallDetailsPage from "@/pages/CallDetails";
import CallHistoryPage from "@/pages/CallHistory";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/enterprise",
    element: <Enterprise />,
  },
  {
    path: "/scenarios",
    element: (
      <ProtectedRoute>
        <Scenarios />
      </ProtectedRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <CallHistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/calls/:id",
    element: (
      <ProtectedRoute>
        <CallDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
