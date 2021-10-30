import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactRouter  from './Router/router';

ReactDOM.render(
    <Router>
        <App>
            <ReactRouter />
        </App>
    </Router>,
     document.getElementById('root'));

