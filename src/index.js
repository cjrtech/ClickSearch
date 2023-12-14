import React from 'react'
import * as ReactDOMClient from 'react-dom/client';
import App from './views/Popup/App'

ReactDOMClient.createRoot(
  document.getElementById("root"),
)
.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
