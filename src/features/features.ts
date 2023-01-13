import products from '../data/products';
import { cartPage } from '../pages/order-cart/cart';

function trackingProducts(target: HTMLButtonElement) {
  const cartProductsArr: number[] = JSON.parse(localStorage.getItem('cartProducts') || '');
  const cartAmount: HTMLElement | null = document.querySelector('.order__amount');
  const orderSum: HTMLElement | null = document.querySelector('.order__sum');
  let orderSumValue = Number(orderSum?.textContent);
  const summaryProducts = document?.querySelector('.summary__products span')
  const summaryTotal = document?.querySelector('.summary__total span')

  if (target.textContent === '+' || target.textContent === '-') {
    const orderManage = target.closest('.ordered__manage');
    const itemsQuantity = orderManage?.querySelector('.ordered__how-many span');
    const quantityValue = Number(itemsQuantity?.textContent);
    const orderStock = orderManage?.querySelector('.ordered__stock span');
    const orderStockValue = Number(orderStock?.textContent);
    const itemPrice = orderManage?.querySelector('.ordered__item-price span');
    
    if (target.textContent === '+') {
      if (orderStockValue !== 0) {
        cartProductsArr.push(Number(orderManage?.id) - 1);
        orderSumValue += products[Number(orderManage?.id) - 1].price;
        if (orderStock !== null && orderStock !== undefined) {
          orderStock.textContent = String(orderStockValue - 1);
        }
        if (itemsQuantity !== null && itemsQuantity !== undefined) {
          itemsQuantity.textContent = String(quantityValue + 1);
        }
      }
    } else {
      cartProductsArr.splice(cartProductsArr.indexOf(Number(orderManage?.id)), 1);
      orderSumValue -= products[Number(orderManage?.id) - 1].price;
      if (itemsQuantity !== null && itemsQuantity !== undefined) {
        itemsQuantity.textContent = String(quantityValue - 1);
        if (itemsQuantity.textContent == '0') {
          localStorage.setItem('cartProducts', JSON.stringify(cartProductsArr));
          cartPage(products);
        }
      }
      if (orderStock !== null && orderStock !== undefined) {
        orderStock.textContent = String(orderStockValue + 1);
      }
    }
    if (itemPrice !== null && itemPrice !== undefined) {
      itemPrice.textContent = String(
        products[Number(orderManage?.id) - 1].price * Number(itemsQuantity?.textContent)
      );
    }
    if (summaryProducts !== null && summaryTotal !== null){
      summaryProducts.textContent = String(cartProductsArr.length);
      summaryTotal.textContent = String(orderSumValue);
    }
  } else if (target.textContent === 'Add To Cart') {
    cartProductsArr.push(Number(target.id));
    orderSumValue += products[Number(target.id) - 1].price;
    target.textContent = 'Drop From Cart';
  } else {
    cartProductsArr.splice(cartProductsArr.indexOf(Number(target.id) - 1), 1);
    if (cartProductsArr.indexOf(Number(target.id) - 1) == -1) {
      target.textContent = 'Add To Cart';
    }
    orderSumValue -= products[Number(target.id) - 1].price;
  }
  if (cartAmount !== null && orderSum !== null) {
    cartAmount.textContent = String(cartProductsArr.length);
    orderSum.textContent = String(orderSumValue);
  }

  localStorage.setItem('cartProducts', JSON.stringify(cartProductsArr));
}

export { trackingProducts };
