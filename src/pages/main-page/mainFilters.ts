import { IProduct } from '../../types/types';
import { renderProducts } from './renderProducts'

function mainFilters(products: IProduct[]) {
  // const productsField: HTMLDivElement | null = document.querySelector('.products');
  // const showProductCards = (products: IProduct[]): void => {
  //   if (productsField !== null) {
  //     productsField.innerHTML = products
  //       .map((product: IProduct) => {
  //         const { id, title, thumbnail, price } = product;
  //         let buttonValue = 'Add To Cart';
  //         if (JSON.parse(localStorage.getItem('cartProducts') || '').includes(id)) {
  //           buttonValue = 'Drop From Cart';
  //         }
  //         return `<div class="products__item">
  //   <div class="products__title">${title}</div>
  //   <div class="products__photo" style="background-image: url(${thumbnail})"></div>
  //   <div class="products__price">${price} $</div>
  //   <div class="products__options">
  //     <button class="products__details" id="${id}">Details</button>
  //     <button class="products__cart" id="${id}">${buttonValue}</button>
  //   </div>
  // </div>`;
  //       })
  //       .join('');
  //   }
  // };

  const categoryFilterList: NodeListOf<ChildNode> | undefined =
    document.querySelector('.category__list')?.childNodes;
  const brandFilterList: NodeListOf<ChildNode> | undefined =
    document.querySelector('.brand__list')?.childNodes;
  const filteredProducts: IProduct[] = [];
  const filteredCategoryBrandProducts: IProduct[] = [];

  if (categoryFilterList !== undefined) {
    categoryFilterList.forEach((el): void =>
      el.addEventListener('change', (e): void => {
        if (e.target instanceof HTMLElement) {
          const inputCategory: string | null = e.target.id;
          //console.log(inputCategory);
          (e.target as HTMLElement).style.color = 'white';
          if (filteredCategoryBrandProducts.length) {
            filteredCategoryBrandProducts.map((product) => {
              if (inputCategory == product.category) filteredProducts.push(product);
            });
          } else {
            products.map((product) => {
              if (inputCategory == product.category) filteredProducts.push(product);
            });
          }

          renderProducts(filteredProducts);
          //console.log(filteredProducts);
        }
      })
    );
  }

  if (brandFilterList !== undefined) {
    brandFilterList.forEach((el): void =>
      el.addEventListener('change', (e): void => {
        if (e.target instanceof HTMLElement) {
          const inputBrand: string | null = e.target.id;
          //console.log(inputBrand);
          (e.target as HTMLInputElement).checked = true;
          if (filteredProducts.length) {
            filteredProducts.map((product) => {
              if (inputBrand == product.brand) filteredCategoryBrandProducts.push(product);
            });
            //console.log(filteredCategoryBrandProducts);
          } else {
            products.map((product) => {
              if (inputBrand == product.brand) filteredCategoryBrandProducts.push(product);
            });
          }
          renderProducts(filteredCategoryBrandProducts);
        }
      })
    );
  }

  const resetFiltersButton = document.querySelector('.filters__buttons-reset');
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  if (resetFiltersButton !== null) {
    resetFiltersButton.addEventListener('click', (): void => {
      if (categoryFilterList !== undefined) {
        allCheckboxes.forEach((el): void => {
          (el as HTMLInputElement).checked = false;
          filteredCategoryBrandProducts.splice(0, filteredCategoryBrandProducts.length);
          filteredProducts.splice(0, filteredProducts.length);
        });
      }
      renderProducts(products);
    });

    /* 
  const productsArea: HTMLDivElement | null = document.querySelector('.products');
  if (productsArea !== null && filteredCategoryBrandProducts.length !== 0) {
    if (filteredCategoryBrandProducts.length === 0) {
      productsArea.innerHTML = 'Not found...';
    } else {
      
    }
  } */
  }
}
export { mainFilters };
