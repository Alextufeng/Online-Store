import products from "../../data/products";
import { cartPage } from "../order-cart/cart";

function createPurchaseModal() {
  const purchase = document.createElement('section')
  document.querySelector('.main')?.append(purchase)
  purchase.innerHTML = `
    <form id="form" autocomplete="off">
          <h2 class="form-title">Personal details</h2>
          <div class="form-item">
            <input type="text" name="name" id="name" placeholder="Name" required/>
          </div>
          <div class="form-item">
            <input type="tel" name="phone" id="phone" placeholder="+... Phone number" required
            onkeypress="return ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode === 43) )"/> 
          </div>
          <div class="form-item">
            <input type="text" name="address" id="address" placeholder="Delivery address"required />
          </div>
          <div class="form-item">
            <input type="text" name="email" id="email" placeholder="E-mail" required />
          </div>
          <h2 class="form-title">Credit card details</h2>
          <div class="card-details">
            <div class="card-number">
              <input type="tel" name="card-number" id="card-number" placeholder="0000 0000 0000 0000" maxlength="16" required
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57 && /^\\d{0,}$/.test(this.value))"/>
            </div>
            <div class="card-expiration">
              <input type="tel" name="expiration" id="expiration" placeholder="MM/YY"  maxlength="5" required
              onkeypress="return (event.charCode >= 47 && event.charCode <= 57)"/>         
            </div>
            <div class="card-cvc">
              <input type="tel" name="cvc" id="cvc" placeholder="cvc" maxlength="3" required
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57 && /^\\d{0,}$/.test(this.value))"/>
            </div>
          </div>
          <button class="button" type="submit">Confirm</button>
        </form>
    `;
  purchase.classList.add('purchase');

  const form: HTMLElement | null = document.querySelector('form');
  const name: HTMLInputElement | null = document.querySelector('#name');
  const phone: HTMLInputElement | null = document.querySelector('#phone');
  const address: HTMLInputElement | null = document.querySelector('#address');
  const email: HTMLInputElement | null = document.querySelector('#email');
  const cardNumber: HTMLInputElement | null = document.querySelector('#card-number');
  const expiration: HTMLInputElement | null = document.querySelector('#expiration');
  const cvc: HTMLInputElement | null = document.querySelector('#cvc');
  const orderSum = document.querySelector('.order__sum');

  purchase.onclick = function (e) {
    if (e.target instanceof HTMLElement && !e.target.closest("#form")) {
      purchase.remove()
    };
  };

  const regExpValue = {
    name: /[a-zA-Z]{3,}(\s[a-zA-Z]{3,})+$/,
    phone: /^\+(\d{9,})/,
    address: /[a-zA-Z0-9]{5,}((\s[a-zA-Z0-9]{5,}){2,})+$/,
    email: /^([a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+@[a-z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-z]{2,6}$/,
    cardNumber: /^[0-9]{16}$/,
    expiration: /^([0][1-9]|[1][0-2])\/[0-9]{2}$/,
    cvc: /^[0-9]{3}$/
  }

  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (fieldValidation(name, regExpValue.name) && fieldValidation(phone, regExpValue.phone) &&
      fieldValidation(address, regExpValue.address) && fieldValidation(email, regExpValue.email) &&
      fieldValidation(cardNumber, regExpValue.cardNumber) && fieldValidation(expiration, regExpValue.expiration) &&
      fieldValidation(cvc, regExpValue.cvc)) {
      setTimeout(() => {
        alert('Заказ оформлен');
        purchase.remove();
        localStorage.setItem('cartProducts', '[]');
        if (orderSum) {
          orderSum.innerHTML = '0'
        };
        cartPage(products);
      }, 2000);
    }
  })

  function fieldValidation(inputItem: HTMLInputElement | null, regExp: RegExp) {
    if (inputItem !== null) {
      const inputValue = inputItem.value.trim();
      if (regExp?.test(String(inputValue))) {
        setSuccess(inputItem);
        return true
      } else {
        setError(inputItem);
        return false
      }
    }
  }

  function setError(inputItem: HTMLInputElement) {
    inputItem.classList.add('error');
    inputItem.classList.remove('success');
  }

  function setSuccess(inputItem: HTMLInputElement) {
    inputItem.classList.add('success');
    inputItem.classList.remove('error');

  };
}

export { createPurchaseModal }