import React from 'react';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import  Content from './Component/Content';
import awsconfig from './aws-exports';
import './App.css';
Amplify.configure(awsconfig);



const App = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
          <div class="topright2">Hello, {user.username}</div>
         <div class="topright"> <AmplifySignOut /> </div>
         <Content />
         <h1>Hello</h1>
      </div>
  ) : (
    <AmplifyAuthenticator>
        <AmplifySignUp
          slot="sign-up"
          formFields={[
            { type: "username" },
            { type: "password" },
            { type: "email" }
          ]}
        />
      </AmplifyAuthenticator>
  );
}

export default App;
