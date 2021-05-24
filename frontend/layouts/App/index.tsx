import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect} from 'react-router-dom';
//import DirectMessage from '@pages/DirectMessage';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(()=> import('@layouts/Workspace'));
// const Channel = loadable(() => import('@pages/Channel'));
// const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const App = () => {
    return (
        <Switch>
            <Redirect exact path="/" to="login" />
            <Route path="/login" component={LogIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/workspace" component={Workspace}/>
            {/* <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} /> */}
        </Switch>
    );
};

export default App;