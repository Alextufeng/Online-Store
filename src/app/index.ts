import '../styles/styles.css';
import { locationHandler } from './routing';

localStorage.setItem('cartProducts', '[]');
locationHandler();
window.location.hash = "#main";
window.addEventListener('hashchange', locationHandler);
