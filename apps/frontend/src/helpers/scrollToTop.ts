export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export function scrollToElement(element: HTMLElement) {
  element.scrollIntoView({ behavior: 'smooth' });
}
