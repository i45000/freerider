import React ,{Component}from 'react';
import {Header} from 'semantic-ui-react'
import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
import './App.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);


class App extends Component{
render(){
  return(
    <div>
    <Header as="h1">Hellow World</Header>
    </div>
    );
}
}
export default withAuthenticator(App);

