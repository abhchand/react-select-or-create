function removeDuplicateItems(items) {
  const ids = [];
  const duplicateItems = [];
  const uniqueItems = [];

  items.forEach((item) => {
    if (ids.indexOf(item.id) < 0) {
      // Item has not been processed yet - add it to the unique list
      uniqueItems.push(item);
      ids.push(item.id);
    }
    else {
      // Item has been processed and is a duplicate
      duplicateItems.push(item);
    }
  });

  /*
   * Not ideal, but this avoids printing console messages
   * during jest test runs
   */
  if (typeof jest === 'undefined' && duplicateItems.length > 0) {
    const text = duplicateItems.map((item) => JSON.stringify(item)).join(', ');

    // eslint-disable-next-line no-console
    console.warn(`All ids must be unique! The following duplicate items were not rendered: ${text}`);
  }

  return uniqueItems;
}

export default removeDuplicateItems;
