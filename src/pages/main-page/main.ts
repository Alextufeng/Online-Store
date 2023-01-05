import { IProduct } from '../../types/types';
import { trackingProducts } from '../../features/features';

const mainPage = (products: IProduct[]): void => {
  const mainContent = document.querySelector('main') as HTMLElement;
  mainContent.innerHTML = `<section class="main__filters filters"></section>
<section class="main__products products"></section>`;

  const productsField = document.querySelector('.products') as HTMLElement;

  const showProductCards = (): HTMLElement => {
    productsField.innerHTML = products
      .map((product: IProduct) => {
        const { id, title, thumbnail, price } = product;
        let buttonValue = 'Add To Cart';
        if (JSON.parse(localStorage.getItem('cartProducts') || '').includes(id)) {
          buttonValue = 'Drop From Cart';
        }
        return `<div class="products__item">
  <div class="products__title">${title}</div>
  <div class="products__photo">
    <img class="products__img" src=${thumbnail}>
  </div>
  <div class="products__price">${price} $</div>
  <div class="products__options">
    <button class="products__details" id="${id}">Details</button>
    <button class="products__cart" id="${id}">${buttonValue}</button>
  </div>
</div>`;
      })
      .join('');
    return productsField;
  };

  mainContent.append(showProductCards());

  //adding data to filters
  const filters = document.querySelector('.filters') as HTMLElement;

  const showTopButtons = (): HTMLDivElement => {
    const topButtons = document.createElement('div') as HTMLDivElement;
    topButtons.className = 'filters__buttons';
    topButtons.innerHTML = `<button class="filters__buttons-reset filters__btn">Reset</button>
        <button class="filters__buttons-copy filters__btn">CopyLink</button>`;
    return topButtons;
  };

  filters.append(showTopButtons());

  //filter-blocks
  const category = document.createElement('div') as HTMLDivElement;
  const categoryTitle = document.createElement('h3') as HTMLElement;
  const categoryList = document.createElement('div') as HTMLDivElement;

  category.className = 'filters__category category';
  categoryTitle.className = 'filters__title category__title';
  categoryList.className = 'category__list';
  categoryTitle.innerHTML = 'Category';

  filters.append(category);
  category.append(categoryTitle);
  category.append(categoryList);

  category.append(filterMaker(categoryList, getProductsCategories()));

  function getProductsCategories() {
    return products
      .map((productCategory) => productCategory.category)
      .reduce(
        (arr: string[], item: string): string[] => (arr.includes(item) ? arr : [...arr, item]),
        []
      );
  }

  function getProductsBrands(): string[] {
    return products
      .map(({ brand }) => brand)
      .reduce((arr: string[], item: string) => (arr.includes(item) ? arr : [...arr, item]), []);
  }

  function filterMaker(filterList: HTMLElement, filterFunction: string[]): HTMLElement {
    filterList.innerHTML = filterFunction
      .map((filterItem) => {
        return `<div class="checkbox-line item-active">
    <input id="${filterItem}" type="checkbox">
    <label for="${filterItem}">${filterItem}</label>
    <span></span>
  </div>`;
      })
      .join('');
    return filterList;
  }

  const brand = document.createElement('div') as HTMLDivElement;
  const brandTitle = document.createElement('h3') as HTMLHeadingElement;
  const brandList = document.createElement('div') as HTMLDivElement;

  brand.className = 'filters__brand brand';
  brandTitle.className = 'filters__title brand__title';
  brandList.className = 'brand__list';
  brandTitle.innerHTML = 'Brand';

  filters.append(brand);
  brand.append(brandTitle);
  brand.append(brandList);

  brand.append(filterMaker(brandList, getProductsBrands()));

  // double-pointing bars
  const showRangeBar = (whatTheRange: string, divider: string): HTMLDivElement => {
    const rangeFilter = document.createElement('div') as HTMLDivElement;
    rangeFilter.className = `filters__${whatTheRange} ${whatTheRange}`;
    rangeFilter.innerHTML = `
  <h3 class="filters__title ${whatTheRange}__title">${whatTheRange}</h3>
  <div class="${whatTheRange}__list">
    <div class="${whatTheRange}__min">
      <input class="${whatTheRange}__min-input" type="number" value="0" />
    </div>
    <div class="${whatTheRange}__divider">${divider}</div>
    <div class="${whatTheRange}__max">
      <input class="${whatTheRange}__max-input" type="number" value="3000" />
    </div>
  </div>
  <div class="${whatTheRange}__slider">
    <div class="${whatTheRange}__progress"></div>
  </div>
  <div class="${whatTheRange}__range-input">
    <input class="${whatTheRange}__range-min" type="range" min="0" max="3000" value="0" step="10" />
    <input
      class="${whatTheRange}__range-max"
      type="range"
      min="0"
      max="2000"
      value="2000"
      step="10"
    />
  </div>
`;
    return rangeFilter;
  };

  filters.append(showRangeBar('price', '$'));
  filters.append(showRangeBar('stock', '-'));

  //price progress-bar
  const rangeInput = document.querySelectorAll('.price__range-input input');
  const priceInput = document.querySelectorAll('.price__list input');
  const priceProgress = document.querySelector('.price__slider .price__progress') as HTMLElement;
  const priceGap = 10 as number;
  const priceSelector = 'price__range-min' as string;

  //stock progress-bar
  const stockRangeInput = document.querySelectorAll('.stock__range-input input');
  const stockInput = document.querySelectorAll('.stock__list input');
  const stockProgress = document.querySelector('.stock__slider .stock__progress') as HTMLElement;
  const stockGap = 10 as number;
  const stockSelector = 'stock__range-min' as string;

  function progressBarControls(
    numberInput: NodeListOf<HTMLInputElement>,
    progressBarInput: NodeListOf<HTMLInputElement>,
    progressBar: HTMLElement,
    gap: number,
    rangeSelector: string
  ): void {
    numberInput.forEach((input): void => {
      input.addEventListener('input', (el): void => {
        const minValue = parseInt(numberInput[0].value);
        const maxValue = parseInt(numberInput[1].value);

        if (maxValue - minValue < gap) {
          if ((el.target as HTMLElement).className == rangeSelector) {
            numberInput[0].value = String(maxValue - gap);
          } else {
            numberInput[1].value = String(minValue + gap);
          }
        } else {
          progressBarInput[0].value = String(minValue);
          progressBarInput[1].value = String(maxValue);
          progressBar.style.left = (minValue / +numberInput[0].max) * 100 + '%';
          progressBar.style.right = 100 - (maxValue / +numberInput[1].max) * 100 + '%';
        }
      });
    });
  }

  progressBarControls(
    rangeInput as NodeListOf<HTMLInputElement>,
    priceInput as NodeListOf<HTMLInputElement>,
    priceProgress,
    priceGap,
    priceSelector
  );
  progressBarControls(
    stockRangeInput as NodeListOf<HTMLInputElement>,
    stockInput as NodeListOf<HTMLInputElement>,
    stockProgress,
    stockGap,
    stockSelector
  );

  stockInput.forEach((input) => {
    input.addEventListener('input', (el) => {
      const minValue = parseInt((stockInput[0] as HTMLInputElement).value);
      const maxValue = parseInt((stockInput[1] as HTMLInputElement).value);

      if (maxValue - minValue >= stockGap && maxValue <= 1000) {
        if ((el.target as HTMLElement).className == 'stock__min-input') {
          (stockRangeInput[0] as HTMLInputElement).value = minValue + '';
          stockProgress.style.left =
            (minValue / +(stockRangeInput[0] as HTMLInputElement).max) * 100 + '%';
        } else {
          (stockRangeInput[1] as HTMLInputElement).value = maxValue + '';
          stockProgress.style.right =
            100 - (maxValue / +(stockRangeInput[0] as HTMLInputElement).max) * 100 + '%';
        }
      }
    });
  });

  //details
  const productDetailsBtns: NodeListOf<HTMLElement> =
    document.querySelectorAll('.products__details');
  productDetailsBtns.forEach((el) =>
    el.addEventListener('click', function (e: Event) {
      const target = e.target as HTMLButtonElement;
      localStorage.setItem('currentId', target.id);
      document.location.href = '#details';
    })
  );

  const productCartBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.products__cart');
  productCartBtns.forEach((el) =>
    el.addEventListener('click', function (e: Event) {
      const target = e.target as HTMLButtonElement;
      trackingProducts(target);
    })
  );
};

export { mainPage };
