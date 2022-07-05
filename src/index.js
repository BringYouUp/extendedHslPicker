import React from 'react';
import ReactDOM from 'react-dom/client';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { rootReducer } from './store/rootReducer'

import './assets/styles/root.sass'

import App from './App';



const store = createStore(rootReducer)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  	<React.StrictMode>
	  	<Provider store={store}>
			<App />
	  	</Provider>
  	</React.StrictMode>
);

const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment && module && module.hot)
	module.hot.accept()
