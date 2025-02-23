
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
import Profile from "@/pages/Profile";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Index /></Layout>,
  },
  {
    path: "/auth",
    element: <Layout><Auth /></Layout>,
  },
  {
    path: "/features",
    element: <Layout><Features /></Layout>,
  },
  {
    path: "/pricing",
    element: <Layout><Pricing /></Layout>,
  },
  {
    path: "/enterprise",
    element: <Layout><Enterprise /></Layout>,
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/scenarios",
    element: (
      <Layout>
        <ProtectedRoute>
          <Scenarios />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/history",
    element: (
      <Layout>
        <ProtectedRoute>
          <CallHistoryPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/calls/:id",
    element: (
      <Layout>
        <ProtectedRoute>
          <CallDetailsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "*",
    element: <Layout><NotFound /></Layout>,
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
