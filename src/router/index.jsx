import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load all page components
const Layout = lazy(() => import("@/components/organisms/Layout"));
const AllFiles = lazy(() => import("@/components/pages/AllFiles"));
const RecentFiles = lazy(() => import("@/components/pages/RecentFiles"));
const StarredFiles = lazy(() => import("@/components/pages/StarredFiles"));
const Trash = lazy(() => import("@/components/pages/Trash"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Loading Storify</h3>
        <p className="text-gray-500">Preparing your cloud storage...</p>
      </div>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AllFiles />
      </Suspense>
    )
  },
  {
    path: "recent",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RecentFiles />
      </Suspense>
    )
  },
  {
    path: "starred",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <StarredFiles />
      </Suspense>
    )
  },
  {
    path: "trash",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Trash />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Layout />
      </Suspense>
    ),
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);