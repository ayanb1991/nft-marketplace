import { Fragment } from "react";
import { isAuthenticated } from "../utilities/firebase";
import { Navigate } from "react-router-dom";

const AuthenticatedRoutes = (props) => {
  return (
    <Fragment>
      {isAuthenticated() ? props.children : <Navigate to="/login" />}
    </Fragment>
  );
}

export default AuthenticatedRoutes;