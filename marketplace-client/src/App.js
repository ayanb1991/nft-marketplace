import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./screens/login/login";
import Signup from "./screens/signup/signup";
import AssetListing from "./screens/asset-listing/asset-listing";
import MyAssets from "./screens/my-assets/my-assets";
import CreateAsset from "./screens/create-asset/create-asset";
import AssetDetails from "./screens/asset-details/asset-details";
import { isAuthenticated } from "./utilities/firebase";
import "./App.css";

const freeRoutes = (
  <Switch>
    <Route exact path="/login">
      <Login />
    </Route>
    <Route exact path="/signup">
      <Signup />
    </Route>
    <Route path="/">
      <Redirect to="/login" />
    </Route>
  </Switch>
);

const authenticatedRoutes = (
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
    <Route path="/asset/owned">
      <MyAssets />
    </Route>
    <Route path="/">
      <Redirect to="/home" />
    </Route>
  </Switch>
);

function App() {
  return (
    <div className="App">
      {isAuthenticated() ? authenticatedRoutes : freeRoutes}
    </div>
  );
}

export default App;
