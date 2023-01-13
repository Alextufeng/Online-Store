import { renderProducts } from './renderProducts';
import { IProduct } from '../../types/types';

function mainFilters(products: IProduct[]) {
  const categoryFilterList: NodeListOf<ChildNode> | undefined =
    document.querySelector('.category__list')?.childNodes;
  const brandFilterList: NodeListOf<ChildNode> | undefined =
    document.querySelector('.brand__list')?.childNodes;
  const filteredCategoryBrandProducts: IProduct[] = [];
  const filteredProducts: IProduct[] = [];
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
  }

  if (categoryFilterList !== undefined) {
    categoryFilterList.forEach((inputFilterLine): void =>
      inputFilterLine.addEventListener('change', (checkBox): void => {
        if (checkBox.target instanceof HTMLElement || checkBox.target !== null) {
          const inputCategory: string | null = (checkBox.target as HTMLElement).id;

          if ((checkBox.target as HTMLInputElement).checked) {
            if (filteredCategoryBrandProducts.length) {
              products.map((product: IProduct) => {
                if (inputCategory == product.category) {
                  filteredProducts.push(product);
                }
              });
              renderProducts(filteredProducts);
            } else {
              products.map((product: IProduct) => {
                if (inputCategory == product.category) {
                  filteredProducts.push(product);
                }
              });
              console.log(filteredProducts);
              console.log(filteredCategoryBrandProducts);
              renderProducts(filteredProducts);
            }
            //brandFilter(filteredProducts);
            renderProducts(filteredProducts);
          } else {
            if (filteredProducts.length) {
              filteredProducts.filter((product: IProduct, index: number) => {
                //return product.category !== inputCategory;
                const indexToDelete = index;

                if (indexToDelete > -1) {
                  return filteredProducts.splice(indexToDelete, 1);
                }
              });
              renderProducts(filteredProducts);
            } else {
              renderProducts(products);
            }
          }
        }
      })
    );
  }

  //const brandFilter = (filteredProducts: IProduct[]) => {
  if (brandFilterList !== undefined) {
    brandFilterList.forEach((inputFilterLine): void =>
      inputFilterLine.addEventListener('change', (checkBox): void => {
        if (checkBox.target instanceof HTMLElement || checkBox.target !== null) {
          const inputBrand: string | null = (checkBox.target as HTMLElement).id;
          console.log(filteredProducts);
          console.log(filteredCategoryBrandProducts);

          if ((checkBox.target as HTMLInputElement).checked) {
            if (filteredProducts.length) {
              filteredProducts.map((product) => {
                if (inputBrand == product.brand) {
                  filteredCategoryBrandProducts.push(product);
                }
              });
            } else {
              products.map((product) => {
                if (inputBrand == product.brand) {
                  filteredCategoryBrandProducts.push(product);
                }
              });
            }
            //renderProducts(filteredCategoryBrandProducts);
          } else {
            if (filteredCategoryBrandProducts.length) {
              filteredCategoryBrandProducts.filter((product: IProduct, index: number) => {
                //return product.brand !== inputBrand;
                const indexToDelete = index;

                if (indexToDelete > -1) {
                  return filteredProducts.splice(indexToDelete, 1);
                  //return filteredProducts;
                }
              });
              renderProducts(filteredCategoryBrandProducts);
            } else {
              renderProducts(filteredProducts);
            }
          }
          renderProducts(filteredCategoryBrandProducts);
        }
      })
    );
  }
  //  };

  //renderProducts(products);
}
export { mainFilters };
