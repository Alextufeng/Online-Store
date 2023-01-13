import { IProduct } from '../../types/types';
import { mainFilters } from './mainFilters';
import { renderProducts } from './renderProducts';

const mainPage = (products: IProduct[]): void => {
  const mainContent: HTMLDivElement | null = document.querySelector('.main');
  if (mainContent !== null) {
    mainContent.innerHTML = `
  <section class="main__filters filters"></section>
  <section class="main__products">
    <div class="products__top-panel"></div>
    <div class="products">
    Товаров не нашлось</div>
  </section>`;
  }
  renderProducts(products);
  const showTopButtons = (): HTMLDivElement => {
    const topButtons = document.createElement('div');
    topButtons.className = 'filters__buttons';
    topButtons.innerHTML = `<button class="filters__buttons-reset filters__btn">Reset</button>
        <button class="filters__buttons-copy filters__btn">CopyLink</button>`;
    return topButtons;
  };
  const filters: HTMLElement | null = document.querySelector('.filters');
  if (filters !== null) {
    filters.append(showTopButtons());
  }

  //filter-blocks
  const category = document.createElement('div');
  const categoryTitle = document.createElement('h3');
  const categoryList = document.createElement('div');

  category.className = 'filters__category category';
  categoryTitle.className = 'filters__title category__title';
  categoryList.className = 'category__list';
  categoryTitle.innerHTML = 'Category';

  if (filters !== null) {
    filters.append(category);
  }
  category.append(categoryTitle);
  category.append(categoryList);
  category.append(filterMaker(categoryList, getProductsCategories()));

  function getProductsCategories() {
    return products
      .map(({ category }) => category)
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

  const brand: HTMLDivElement = document.createElement('div');
  const brandTitle: HTMLHeadingElement = document.createElement('h3');
  const brandList: HTMLDivElement = document.createElement('div');

  brand.className = 'filters__brand brand';
  brandTitle.className = 'filters__title brand__title';
  brandList.className = 'brand__list';
  brandTitle.innerHTML = 'Brand';

  if (filters !== null) {
    filters.append(brand);
  }
  brand.append(brandTitle);
  brand.append(brandList);
  brand.append(filterMaker(brandList, getProductsBrands()));

  // double-pointing bars
  const showRangeBar = (whatTheRange: string, divider: string): HTMLDivElement => {
    const rangeFilter: HTMLDivElement = document.createElement('div');
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

  if (filters !== null) {
    filters.append(showRangeBar('price', '$'));
    filters.append(showRangeBar('stock', '-'));
  }

  //price progress-bar
  const rangeInput: NodeListOf<HTMLInputElement> = document.querySelectorAll(
    '.price__range-input input'
  );

  const priceInput: NodeListOf<HTMLInputElement> = document.querySelectorAll('.price__list input');
  const priceProgress: HTMLElement | null = document.querySelector(
    '.price__slider .price__progress'
  );
  const priceGap = 10;
  const priceSelector = 'price__range-min';

  //stock progress-bar
  const stockRangeInput: NodeListOf<HTMLInputElement> = document.querySelectorAll(
    '.stock__range-input input'
  );
  const stockInput: NodeListOf<HTMLInputElement> = document.querySelectorAll('.stock__list input');

  const stockProgress: HTMLElement | null = document.querySelector(
    '.stock__slider .stock__progress'
  );
  const stockGap = 10;
  const stockSelector = 'stock__range-min';

  function progressBarControls(
    numberInput: NodeListOf<HTMLInputElement>,
    progressBarInput: NodeListOf<HTMLInputElement>,
    progressBar: HTMLElement,
    gap: number,
    rangeSelector: string
  ): void {
    numberInput.forEach((input): void => {
      input.addEventListener('input', (e): void => {
        const minValue: number = parseInt(numberInput[0].value);
        const maxValue: number = parseInt(numberInput[1].value);
        if (maxValue - minValue < gap) {
          if ((e.target as HTMLTextAreaElement).className == rangeSelector) {
            (numberInput[0] as HTMLInputElement).value = String(maxValue - gap);
          } else {
            (numberInput[1] as HTMLInputElement).value = String(minValue + gap);
          }
        } else {
          (progressBarInput[0] as HTMLInputElement).value = String(minValue);
          (progressBarInput[1] as HTMLInputElement).value = String(maxValue);
          progressBar.style.left = (minValue / Number(numberInput[0].max)) * 100 + '%';
          progressBar.style.right = 100 - (maxValue / Number(numberInput[1].max)) * 100 + '%';
        }
      });
    });
  }
  if (priceProgress !== null) {
    progressBarControls(rangeInput, priceInput, priceProgress, priceGap, priceSelector);

    priceInput.forEach((input): void => {
      input.addEventListener('input', (e): void => {
        const minValue = parseInt(priceInput[0].value);
        const maxValue = parseInt(priceInput[1].value);
        if (maxValue - minValue >= priceGap && maxValue <= 1000) {
          if ((e.target as HTMLTextAreaElement).className == 'price__min-input') {
            rangeInput[0].value = String(minValue);
            priceProgress.style.left = (minValue / Number(rangeInput[0].max)) * 100 + '%';
          } else {
            rangeInput[1].value = String(maxValue);
            priceProgress.style.right = 100 - (maxValue / Number(rangeInput[0].max)) * 100 + '%';
          }
        }
      });
    });
  }
  if (stockProgress !== null) {
    progressBarControls(stockRangeInput, stockInput, stockProgress, stockGap, stockSelector);

    stockInput.forEach((input): void => {
      input.addEventListener('input', (e): void => {
        const minValue = parseInt(stockInput[0].value);
        const maxValue = parseInt(stockInput[1].value);

        if (maxValue - minValue >= stockGap && maxValue <= 1000) {
          if ((e.target as HTMLTextAreaElement).className == 'stock__min-input') {
            stockRangeInput[0].value = String(minValue);
            stockProgress.style.left = (minValue / Number(stockRangeInput[0].max)) * 100 + '%';
          } else {
            stockRangeInput[1].value = String(maxValue);
            stockProgress.style.right =
              100 - (maxValue / Number(stockRangeInput[0].max)) * 100 + '%';
          }
        }
      });
    });
  }
  mainFilters(products);
};

export { mainPage };
