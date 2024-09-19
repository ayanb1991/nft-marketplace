import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./screens/login/login";
import Signup from "./screens/signup/signup";
import AssetListing from "./screens/asset-listing/asset-listing";
import MyProfile from "./screens/my-profile/my-profile";
import CreateAsset from "./screens/create-asset/create-asset";
import MyAssets from "./screens/my-assets/my-assets";
import AuthenticatedRoutes from "./components/authenticated-routes";
import Frame from "./components/frame";

import "./App.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App() {
  return (
    <div className="App">
      {/* Non authenticated routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {/* Non authenticated routes */}
      <AuthenticatedRoutes>
        <Frame>
          <Routes>
            <Route path="/store" element={<AssetListing />} />
            <Route path="/asset/create" element={<CreateAsset />} />
            <Route path="/asset/owned" element={<MyAssets />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="*" element={<Navigate to="/store" />} />
          </Routes>
        </Frame>
      </AuthenticatedRoutes>
    </div>
  );
}

export default App;
