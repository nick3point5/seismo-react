import { Switch, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import PostDetails from '../pages/PostDetails/PostDetails';
import UserPage from '../pages/UserPage/UserPage';

const routes = (
  <Switch>
    <Route path='/post/:id' component={PostDetails} />
    <Route path='/user/:id' component={UserPage} />
    <Route path='/' component={HomePage} />
  </Switch>
)

export default routes;