import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App piecesCountVertical="1" piecesCountHorizontal="1"/>, document.getElementById('appMount'));
registerServiceWorker();
