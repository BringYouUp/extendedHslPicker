import React from 'react';
import ReactDOM from 'react-dom/client';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk'

import { rootReducer } from './store/rootReducer'

import '@styles/root.sass'

import App from './App';

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// const store = createStore(rootReducer, applyMiddleware(thunk))

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  	<React.StrictMode>
	  	<Provider store={store}>
			<App />
	  	</Provider>
  	</React.StrictMode>
);


const isDevelopment = process.env.NODE_ENV === 'development'

// if (isDevelopment && module && module.hot)
// 	module.hot.accept()
