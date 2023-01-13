import { IProduct } from '../../types/types';
import { trackingProducts } from '../../features/features';
import { createPurchaseModal } from '../purchase-page/purchase';

function cartPage(products: IProduct[]) {
  const main: HTMLDivElement | null = document.querySelector('.main');
  if (main !== null) {
    main.innerHTML = ``;
  }
  const cartProducts: number[] = JSON.parse(localStorage.getItem('cartProducts') || '');
  let position = 0;
  const cartAmount: HTMLDivElement | null = document.querySelector('.order__amount');
  const totalPrice: HTMLDivElement | null = document.querySelector('.order__sum');

  const productSection = document.createElement('section');
  const summarySection = document.createElement('section');
  productSection.className = 'main__ordered ordered';
  summarySection.className = 'summary';
  main?.append(productSection);
  main?.append(orderedSectionSummary());
  productSection.append(orderedSectionHead());

  showOrderedItems();

  function orderedSectionHead() {
    const orderedHeader = document.createElement('div');
    orderedHeader.className = 'ordered__header';
    orderedHeader.innerHTML = `<h2>Products in cart</h2>
<div>Items: <input type="text" id="numberOfItems" value="${cartAmount?.textContent}"></div>
<div class="ordered__pages">
  <div>Page: 
    <button> &lt; </button>
    <span>1</span>
    <button> &gt; </button>
  </div>
</div>`;
    return orderedHeader;
  }

  function orderedSectionSummary() {
    summarySection.innerHTML = `<div class="summary__header">
    <h2>Summary</h2>
  </div>
  <div class="summary__products">
    Products: <span>${cartAmount?.textContent}</span>
  </div>
  <div class="summary__total">Total: $<span>${totalPrice?.textContent}</span></div>
  <div class="summary__new-total"></div>
  <div class="summary__promo"><input type="text" id="promo" placeholder="Enter code" /></div>
  <div class="promo-description"></div>
  <p class="about-promo">promo for test 'RS', 'JS'</p>
  <button class="buy-now">Buy Now</button>`;
    return summarySection;
  }

  function showOrderedItems() {
    return products.map((product) => {
      const { id } = product;
      if (cartProducts.includes(id)) productSection.append(orderedItem(product));
    });
  }

  function orderedItem(product: IProduct) {
    position++;
    const { id, title, description, price, discountPercentage, rating, stock, thumbnail } = product;

    const amount = cartProducts.filter((el) => {
      if (el == id) {
        return true;
      } else return false;
    }).length;

    const orderedProduct = document.createElement('div');
    orderedProduct.className = 'ordered__product';
    orderedProduct.id = `item${id}`;
    orderedProduct.innerHTML = `<div class="ordered__number">${position}</div>
  <div class="ordered__item item">
    <img class="item__img" src="${thumbnail}">
      <div class="item__info">
        <div class="item__title">${title}</div>
        <div class="item__description">${description}</div>
        <div class="item__additionally">
          <div class="item__rating">Rating: ${rating}</div>
          <div class="item__discount">Discount: ${discountPercentage}%</div>
        </div>
      </div>
  </div>
  <div class="ordered__manage" id="${id}">
    <div class="ordered__stock">Stock: <span>${stock}</span></div>
    <div class="ordered__how-many" >
      <button class="ordered__how-many_drop">-</button>
      <span class="ordered__how-many_amount">${amount}</span>
            <button class="ordered__how-many_drop">+</button>
    </div>
    <div class="ordered__item-price">$ <span id="price${id}">${price}</span></div>
  </div>`;

    return orderedProduct;
  }

  function isEmpty() {
    if (cartProducts.length == 0) {
      document.querySelector('.main__ordered')?.remove();
      document.querySelector('.summary')?.remove();
      const cartTitle = document.createElement('h2');
      main?.append(cartTitle);
      cartTitle.innerHTML = 'Your cart is empty';
      cartTitle.style.setProperty('color', '#EEC353');
      if (cartAmount !== null) {
        cartAmount.innerHTML = '0';
      }
    }
  }

  isEmpty();

  const dropThisItem = document.querySelectorAll('.ordered__how-many_drop');
  dropThisItem.forEach((button) => {
    button.addEventListener('click', function (e) {
      if (e.target instanceof HTMLButtonElement) {
        trackingProducts(e.target);
      }
    });
  });

  const buyButton = document.querySelector('.buy-now');
  if (buyButton !== null) {
    buyButton.addEventListener('click', () => {
      createPurchaseModal();
    });
  }
  const summaryProducts = document?.querySelector('.summary__products span');
  const summaryTotal = document?.querySelector('.summary__total');
  const summaryTotalValue = document?.querySelector('.summary__total span');
  const inputCode: HTMLInputElement | null = document.querySelector('#promo');
  const total = document.querySelector('.order__sum');
  const newTotal = document.querySelector('.summary__new-total');

  if (summaryProducts !== null && summaryTotalValue !== null) {
    summaryProducts.textContent = String(document.querySelector('.order__amount')?.textContent);
    summaryTotalValue.textContent = String(total?.textContent);
    inputCode?.addEventListener('input', function () {
      const promoCodeValue: string = this.value.toUpperCase();

      switch (promoCodeValue.toUpperCase()) {
        case 'RS':
          return promoAdding(10, promoCodeValue);
        case 'JS':
          return promoAdding(20, promoCodeValue);
        default:
          return;
      }
    });
  }

  function promoAdding(discount: number, promo: string) {
    const promoDescription = document.querySelector('.promo-description');
    if (promoDescription !== null) {
      const promoItem = document.createElement('div');
      promoItem.innerHTML = `Promo "${promo}" -${discount}%
        <button>add</button>
        `;
      promoDescription.append(promoItem);
    }
    const buttons = promoDescription?.querySelectorAll('button');
    buttons?.forEach((button => {

      button.addEventListener('click', (e) => {
        const summaryPrice = Number(total?.textContent);
        const newTotalSum = Math.round(summaryPrice * (1 - discount * 0.01));
        if (e.target instanceof HTMLButtonElement && newTotal !== null) {
          if (e.target.textContent === 'add') {
            summaryTotal?.classList.add('through');
            newTotal.innerHTML = `Total: $<span>${newTotalSum}</span>`;
            e.target.textContent = 'drop';
          } else {
            e.target.textContent = 'add';
            summaryTotal?.classList.remove('through');
            newTotal.innerHTML = ''
          }
        }
      });
    }))
  }
}

export { cartPage };
