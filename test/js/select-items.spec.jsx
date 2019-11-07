import { cleanup, fireEvent, render } from '@testing-library/react';
import { KeyCodes } from 'utils/key-codes';
import React from 'react';
import SelectItems from 'select-items';

let rendered;

let allItems;
let filteredItems;
let currentSelectedItemIndex;
let onClick;

const defaults = SelectItems.defaultProps;

beforeEach(() => {
  allItems = [
    { id: 'TN', name: 'Tamil Nadu' },
    { id: 'MH', name: 'Maharashtra' },
    { id: 'KL', name: 'Kerala' },
    { id: 'WB', name: 'West Bengal' }
  ];
  filteredItems = allItems.slice(0, allItems.length);

  currentSelectedItemIndex = 0;
  onClick = jest.fn();
});

afterEach(cleanup);

describe('<SelectItems />', () => {
  it('renders the component with the correct selected item', () => {
    rendered = renderComponent({ currentSelectedItemIndex: 1 });

    expect(displayedItems()).toMatchObject(filteredItems);

    const selected = getElementSelectItems().querySelector('li.selected');
    expect(selected.dataset.id).toBe('MH');
  });

  describe('no items exist', () => {
    it('renders the empty state', () => {
      rendered = renderComponent({ allItems: [] });

      expect(displayedItems()).toMatchObject([]);
      expect(getElementSelectItems()).toHaveTextContent(defaults.textForEmptyState);
    });

    it('overrides the default textForEmptyState when present', () => {
      rendered = renderComponent({ allItems: [], textForEmptyState: 'foo' });

      expect(getElementSelectItems()).toHaveTextContent('foo');
    });
  });

  describe('no search results exist', () => {
    it('renders the empty state', () => {
      rendered = renderComponent({ filteredItems: [] });

      expect(displayedItems()).toMatchObject([]);
      expect(getElementSelectItems()).toHaveTextContent(defaults.textForNoSearchResults);
    });

    it('overrides the default textForEmptyState when present', () => {
      rendered = renderComponent({ filteredItems: [], textForNoSearchResults: 'foo' });

      expect(getElementSelectItems()).toHaveTextContent('foo');
    });
  });

  describe('item onClick event', () => {
    it('fires onClick event', () => {
      rendered = renderComponent();
      expect(onClick).not.toHaveBeenCalled();

      fireEvent.click(getItem('KL').querySelector('div'));

      expect(onClick).toHaveBeenCalled();
      expect(onClick.mock.calls[0]).toMatchObject(['KL']);
    });
  });

  describe('item keyDown event', () => {
    it('fires onClick if Enter was pressed', () => {
      rendered = renderComponent();
      expect(onClick).not.toHaveBeenCalled();

      fireEvent.keyDown(getItem('KL').querySelector('div'), { keyCode: KeyCodes.ENTER });

      expect(onClick).toHaveBeenCalled();
      expect(onClick.mock.calls[0]).toMatchObject(['KL']);
    });

    it('does not fire onClick if another key was pressed', () => {
      rendered = renderComponent();
      expect(onClick).not.toHaveBeenCalled();

      fireEvent.keyDown(getItem('KL').querySelector('div'), { keyCode: KeyCodes.ESCAPE });

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});

const getElementSelectItems = () => rendered.getByTestId('select-items');

const getItem = (itemId) => getElementSelectItems().querySelector(`li[data-id="${itemId}"]`);

const displayedItems = () => {
  const displayedItemsList = [];
  const selectItems = getElementSelectItems();

  selectItems.querySelectorAll('li').forEach((item) => {
    displayedItemsList.push({ id: item.dataset.id, name: item.textContent });
  });

  return displayedItemsList;
};

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {
    allItems: allItems,
    filteredItems: filteredItems,
    currentSelectedItemIndex: currentSelectedItemIndex,
    onClick: onClick
  };
  const props = { ...fixedProps, ...additionalProps };

  return render(<SelectItems {...props} />);
};
