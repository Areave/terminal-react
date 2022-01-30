import React from 'react';
import {render as renderApp} from 'react-dom';
import {Provider} from 'react-redux';
import store from './utils/store'
import ErrorBoundary from "./utils/errorBoundary/errorBoundary";
import App from './comps/app/app';
import './style/normalize.scss';
import './style/root.scss';


renderApp(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <App/>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('app'));

