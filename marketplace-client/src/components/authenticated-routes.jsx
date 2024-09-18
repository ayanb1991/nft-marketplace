import { Fragment } from "react";
import { isAuthenticated } from "../utilities/firebase";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const AuthenticatedRoutes = (props) => {
  return (
    <Fragment>
      {isAuthenticated() ? props.children : <Redirect to="/login" />}
    </Fragment>
  );
}

export default AuthenticatedRoutes;