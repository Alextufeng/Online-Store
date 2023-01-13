import { IProduct, DetailsCategory } from "../../types/types";
import { trackingProducts } from "../../features/features"
import { createPurchaseModal } from "../purchase-page/purchase";

function createDetails(product: IProduct) {
  const main: HTMLDivElement | null = document.querySelector('.main');
  if (main !== null) {
    main.innerHTML = '';
    main.innerHTML = `
  <section class="main__details details">
    <h2 class="details__title">${product.title}</h2>
    <div class="details__breadcrumbs">
      <div>STORE</div>
      <div>${'>>'}</div>
      <div>${product.category.toUpperCase()}</div>
      <div>${'>>'}</div>
      <div>${product.brand.toUpperCase()}</div>
      <div>${'>>'}</div>
      <div>${product.title.toUpperCase()}</div>
    </div> 
    <div class="details__info">
      <div class="info__miniature"></div>
      <div class="info__thumbnail"></div>
      <div class="info__description-items"></div>
    </div>
    <div class="details__price">
      <button class="buttons">Buy Now</button>
      <div class="price">0$</div>
      <button class="buttons" id=${product.id} >Add To Cart</button>
    </div>
  </section>`;
  }

  const miniaturesDiv: HTMLDivElement | null = document.querySelector('.info__miniature');
  const thumbnailDiv: HTMLDivElement | null = document.querySelector('.info__thumbnail');
  const descrItems: HTMLDivElement | null = document.querySelector('.info__description-items');
  const price: HTMLDivElement | null = document.querySelector('.price');
  const addButton: Element | null = document.querySelectorAll('.buttons')[1];
  const buyButton: Element | null = document.querySelectorAll('.buttons')[0];
  const itemsCategories: DetailsCategory[] = [
    'description',
    'discountPercentage',
    'rating',
    'stock',
    'brand',
    'category',
  ];

  const cartProductsArr: number[] = JSON.parse(localStorage.getItem('cartProducts') || '');
  if (cartProductsArr.includes(product.id)) {
    addButton.innerHTML = 'Drop From Cart';
  }

  product.images.forEach((img, i) => {
    if (i < product.images.length - 1) {
      const miniatureImg = document.createElement('img');
      miniatureImg.src = img;
      miniatureImg.alt = 'img';
      if (miniaturesDiv !== null) {
        miniaturesDiv.append(miniatureImg);
      }
      miniatureImg.addEventListener('click', (e: Event) => {
        const miniatureImgEl: HTMLImageElement | null =
          document.querySelector('.info__thumbnail img');
        if (miniatureImgEl !== null && e.target instanceof HTMLImageElement) {
          miniatureImgEl.src = e.target.src;
        }
      });
    }
  });

  const thumbnailImg = document.createElement('img');
  thumbnailImg.src = product.thumbnail;
  if (thumbnailDiv !== null) {
    thumbnailDiv.append(thumbnailImg);
  }

  itemsCategories.forEach((itemsCategoriesElement) => {
    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add('description-item', `${itemsCategoriesElement}`);
    const descriptionName = document.createElement('div');
    descriptionName.classList.add('item-title');
    descriptionName.textContent = `${itemsCategoriesElement}:`;
    if (itemsCategoriesElement == 'discountPercentage') {
      descriptionName.textContent = `discount:`;
    }
    const descriptionValue = document.createElement('div');
    descriptionValue.classList.add('item-prop');
    const key = itemsCategoriesElement as keyof typeof product;
    descriptionValue.innerHTML = `${product[key]}`;
    if (descrItems !== null) {
      descrItems.append(descriptionElement);
    }
    descriptionElement.append(descriptionName, descriptionValue);
  });
  if (price !== null) {
    price.textContent = `${product.price}$`;
  }

  addButton.addEventListener('click', (e) => {
    if (e.target instanceof HTMLButtonElement) {
      trackingProducts(e.target);
    }
  });

  buyButton.addEventListener('click', () => {
    createPurchaseModal();
  });
}

export { createDetails };
