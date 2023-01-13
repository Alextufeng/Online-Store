import { createDetails } from '../pages/product-details/details';
import { create404 } from '../pages/page-404/page-404';
import { mainPage } from '../pages/main-page/main';
import { cartPage } from '../pages/order-cart/cart';
import { products } from '../data/products';

export const locationHandler = () => {
  const routes = {
    404: {
      title: '404',
      render() {
        create404();
      },
    },
    main: {
      title: 'Main',
      render() {
        mainPage(products);
      },
    },
    'product/': {
      title: 'Product details',
      render() {
        const hashId = window.location.hash.slice(9);
        const product = products[Number(hashId) - 1];
        createDetails(product);
      },
    },
    cart: {
      title: 'Order cart',
      render() {
        cartPage(products);
      },
    },
  };

  const location = window.location.hash.slice(1);
  let route;
  if (!Object.prototype.hasOwnProperty.call(routes, location)) {
    if (location.length === 0) {
      route = routes['main'];
    } else if (location.startsWith('product/')) {
      if (products[Number(window.location.hash.slice(9)) - 1] !== undefined) {
        route = routes['product/'];
      }
      else {
        route = routes['404'];
      }
    } else {
      route = routes['404'];
    }
  } else {
    const key = location as keyof typeof routes;
    route = routes[key];
  }
  document.title = route.title;
  route.render();
};
