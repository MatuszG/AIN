import React from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';

import HomePage from './components/homePage/HomePage'


const App = () =>{
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact>
                    <HomePage/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
} 


export default App;