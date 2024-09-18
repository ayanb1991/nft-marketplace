import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./screens/login/login";
import Signup from "./screens/signup/signup";
import AssetListing from "./screens/asset-listing/asset-listing";
import MyProfile from "./screens/my-profile/my-profile";
import CreateAsset from "./screens/create-asset/create-asset";
import AssetDetails from "./screens/asset-details/asset-details";
import AuthenticatedRoutes from "./components/authenticated-routes";
import "./App.css";
import Frame from "./components/frame";

function App() {
  return (
    <div className="App">
      {/* Non authenticated routes */}
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
      </Switch>
      {/* Non authenticated routes */}
      <AuthenticatedRoutes>
        <Frame>
          <Switch>
            <Route exact path="/home">
              <AssetListing />
            </Route>
            <Route exact path="/asset/create">
              <CreateAsset />
            </Route>
            <Route exact path="/asset/:assetId">
              <AssetDetails />
            </Route>
            <Route path="/profile">
              <MyProfile />
            </Route>
            <Route path="/">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </Frame>
      </AuthenticatedRoutes>
    </div>
  );
}

export default App;
