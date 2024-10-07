import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./screens/login/login";
import Signup from "./screens/signup/signup";
import AssetListing from "./screens/asset-listing/asset-listing";
import MyProfile from "./screens/my-profile/my-profile";
import ManageAsset from "./screens/create-asset/create-asset";
import MyAssets from "./screens/my-assets/my-assets";
import ProtectedRoute from "./components/protected-route";
import Frame from "./components/frame";

import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AuthProvider } from "./context/auth.context";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Frame />}>
            <Route
              path="/asset/listing"
              element={
                <ProtectedRoute>
                  <AssetListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/asset/create"
              element={
                <ProtectedRoute>
                  <ManageAsset />
                </ProtectedRoute>
              }
            />
            <Route
              path="/asset/update/:assetId"
              element={
                <ProtectedRoute>
                  <ManageAsset />
                </ProtectedRoute>
              }
            />
            <Route
              path="/asset/owned"
              element={
                <ProtectedRoute>
                  <MyAssets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
