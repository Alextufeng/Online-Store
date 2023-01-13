function create404() {
  const main: HTMLDivElement | null = document.querySelector('.main');
  if (main !== null) {
    main.innerHTML = `
    <h2 class="not-found">page not found (404)</h2>`;
  }
}
export { create404 };
