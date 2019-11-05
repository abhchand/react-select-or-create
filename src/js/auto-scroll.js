function getHeight(element) {
  return parseInt(window.getComputedStyle(element).getPropertyValue('height'), 10);
}

// eslint-disable-next-line padded-blocks
function autoScrollToShowItem() {

  /*
   * Unfortunately since this functionality relies heavily on computed
   * styling it is difficult to test.
   */
  // eslint-disable-next-line no-process-env
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const item = document.querySelector('.react-select-or-create li.selected');
  if (item === null) {
    return;
  }

  const itemHeight = getHeight(item);

  const firstItem = document.querySelector('.react-select-or-create ul > li');

  const container = document.querySelector('.react-select-or-create .select-items');
  const containerHeight = getHeight(container);

  const scrollWindowTop = container.scrollTop;
  const scrollWindowBottom = scrollWindowTop + containerHeight;
  const itemPosition = item.offsetTop - firstItem.offsetTop;

  // Scroll up if needed
  if (itemPosition < scrollWindowTop) {
    container.scrollTop = itemPosition;
  }

  // Scroll down if needed
  if (itemPosition > scrollWindowBottom - itemHeight) {
    container.scrollTop = itemPosition - containerHeight + itemHeight;
  }
}

export default autoScrollToShowItem;
