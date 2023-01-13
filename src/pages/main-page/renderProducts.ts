import { trackingProducts } from '../../features/features';
import { IProduct } from '../../types/types';

function renderProducts(products: IProduct[]) {
  const productsField: HTMLDivElement | null = document.querySelector('.products');
  const productsTopPanel: HTMLDivElement | null = document.querySelector('.products__top-panel');
  if (productsTopPanel !== null) {
    productsTopPanel.innerHTML = `
  <div class="sort">
    <select>
      <option>Sort by default</option>
      <option>Highest price</option>
      <option>Lowest price</option>
      <option>Highest rating</option>
      <option>Highest discount %</option>
    </select>
  </div>
  <div class="found">Found: ${products.length}</div>
  <div class="search">
    <input type="search" placeholder="Search...">
  </div>
  <div class="display-options">
    <div class="tiles options display-active">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="list options">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>`;
  }

  const displayOptions = document.querySelectorAll('.options');
  displayOptions.forEach((displayValue) => {
    displayValue.addEventListener('click', () => {
      displayOptions[1].classList.toggle('display-active');
      displayOptions[0].classList.toggle('display-active');
      productsField?.classList.toggle('products-inline');
    });
  });
  const select: HTMLSelectElement | null = document.querySelector('select');
  select?.addEventListener('change', function () {

    if (this.value === 'Lowest price') {
      products = products.sort((x, y) => x.price - y.price);
    } else if (this.value === 'Highest price') {
      products = products.sort((x, y) => y.price - x.price);
    } else if (this.value === 'Highest rating') {
      products = products.sort((x, y) => x.rating - y.rating);
    } else if (this.value === 'Highest discount %') {
      products = products.sort((x, y) => x.discountPercentage - y.discountPercentage);
    } else {
      products = products.sort((x, y) => x.id - y.id);
    }
    showProductCards(products);

    switch (this.value) {
      case "Lowest price":
        products = products.sort((x, y) => x.price - y.price);
        break;
      case "Highest price":
        products = products.sort((x, y) => y.price - x.price);
        break;
      case "Highest rating":
        products = products.sort((x, y) => x.rating - y.rating);
        break;
      case "Highest discount %":
        products = products.sort((x, y) => x.discountPercentage - y.discountPercentage);
        break;
      default: products = products.sort((x, y) => x.id - y.id);
        break;
    }

    showProductCards(products)

  });

  const search: HTMLInputElement | null = document.querySelector('.search input');
  search?.addEventListener('input', function () {
    const searchValue = this.value;
    const fieldsComparator = (value: string, searchValue: string) => {
      return value.toLowerCase().includes(searchValue.toLowerCase());
    };
    const result = products.filter((product, index, array) => {
      const { title, description, price, rating, stock, brand, category } = product;
      if (
        fieldsComparator(
          [title, description, price, rating, stock, brand, category].join(''),
          searchValue
        )
      ) {
        return array;
      }
    });
    showProductCards(result);

    const quantity: HTMLDivElement | null = document.querySelector('.found');
    if (quantity !== null && productsField !== null) {
      quantity.innerHTML = `Found: ${result.length}`;
      if (result.length === 0) {
        productsField.innerHTML = 'Not found...';
      }
    }
  });

  const showProductCards = (products: IProduct[]): void => {
    if (productsField !== null) {
      productsField.innerHTML = products
        .map((product: IProduct) => {
          const { id, title, thumbnail, price } = product;
          let buttonValue = 'Add To Cart';
          if (JSON.parse(localStorage.getItem('cartProducts') || '').includes(id)) {
            buttonValue = 'Drop From Cart';
          }
          return `<div class="products__item">
    <div class="products__title">${title}</div>
    <div class="products__photo" style="background-image: url(${thumbnail})"></div>
    <div class="products__price">${price} $</div>
    <div class="products__options">
      <button class="products__details" id="${id}">Details</button>
      <button class="products__cart" id="${id}">${buttonValue}</button>
    </div>
  </div>`;
        })
        .join('');
    }
    const productDetailsBtns: NodeListOf<HTMLElement> =
      document.querySelectorAll('.products__details');
    productDetailsBtns.forEach((el) =>
      el.addEventListener('click', function (e: Event) {
        if (e.target instanceof HTMLButtonElement) {
          document.location.href = `#product/${e.target.id}`;
        }
      })
    );

    const productCartBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.products__cart');
    productCartBtns.forEach((el) =>
      el.addEventListener('click', function (e: Event) {
        if (e.target instanceof HTMLButtonElement) {
          trackingProducts(e.target);
        }
      })
    );
  };
  showProductCards(products);
}

export { renderProducts };

