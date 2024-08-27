import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import store from './redux/store.tsx';

let widgetDivs = document.querySelectorAll('.performance-widget');

widgetDivs.forEach((div) => {
  createRoot(div!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )
})
