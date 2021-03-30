import DashBoard from "./pages/Dashboard";
import Login from "./pages/Login";
import Error from "./pages/Error";
import PrivateRoute from "./pages/PrivateRoute";
import Authwrapper from "./pages/Authwrapper";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Authwrapper>
      <Router>
        <Switch>
          <PrivateRoute path="/" exact={true}>
            <DashBoard></DashBoard>
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </Router>
    </Authwrapper>
  );
}

export default App;
