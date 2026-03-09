import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "./utils/axios";
import { setUser } from "./store/authSlice";

import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import RoleGuard from "./components/RoleGuard";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerRestaurant from "./pages/OwnerRestaurant";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDetails from "./pages/RestaurantDetails";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contectus";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminOwners from "./pages/AdminOwners";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminProfile from "./pages/AdminProfile";
import OwnerOrders from "./pages/OwnerOrders";
import OwnerProfile from "./pages/OwnerProfile";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/users/profile", { withCredentials: true });
        const user = res.data.data;

        dispatch(
          setUser({
            user: user,
            role: user.role,
          }),
        );
      } catch (err) {
        console.log(err?.message + "Not authenticated");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Orders />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["user"]}>
                <UserDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["user"]}>
                <Cart />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["user"]}>
                <RestaurantDetails />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["restaurantOwner"]}>
                <OwnerDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/restaurant"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["restaurantOwner"]}>
                <OwnerRestaurant />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/orders"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["restaurantOwner"]}>
                <OwnerOrders />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/profile"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["restaurantOwner"]}>
                <OwnerProfile />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/restaurants"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <AdminRestaurants />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/owners"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <AdminOwners />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <AdminOrders />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <AdminUsers />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <AdminProfile />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
