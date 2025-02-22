import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Enterprise from "@/pages/Enterprise";
import Scenarios from "@/pages/Scenarios";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CallDetailsPage from "@/pages/CallDetails";

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
  return <RouterProvider router={router} />;
}

export default App;
