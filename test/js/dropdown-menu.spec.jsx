import { cleanup, fireEvent, render } from '@testing-library/react';
import DropdownMenu from 'dropdown-menu';
import { KeyCodes } from 'utils/key-codes';
import React from 'react';

let rendered;

let items;
let closeMenu;
let handleSelect;
let handleCreate;

beforeEach(() => {
  items = [
    { id: 'TN', name: 'Tamil Nadu' },
    { id: 'MH', name: 'Maharashtra' },
    { id: 'KL', name: 'Kerala' }
  ];

  closeMenu = jest.fn();
  handleSelect = jest.fn();
  handleCreate = jest.fn();
});

afterEach(cleanup);

describe('<DropdownMenu />', () => {
  it('renders the component', () => {
    rendered = renderComponent();

    const searchInput = getElementSearchInput();
    const selectItems = getElementSelectItems();
    const createItem = getElementCreateItem();

    expect(rendered.container).toContainElement(searchInput);
    expect(rendered.container).toContainElement(selectItems);
    expect(rendered.container).toContainElement(createItem);

    expect(displayedItems()).toMatchObject(items);
  });

  describe('createItemBehaviorOnEmptySearch prop', () => {
    it('defines the behavior correctly in the child components', () => {
      rendered = renderComponent({
        textForCreateItem: (text) => `Create '${text}'`,
        createItemBehaviorOnEmptySearch: 'hidden'
      });

      expect(getElementCreateItem()).toBeNull();
      searchFor('ra');
      expect(getElementCreateItem()).not.toBeNull();
    });
  });

  describe('enableSearch prop', () => {
    it('renders the searchInput when true', () => {
      rendered = renderComponent({
        enableSearch: true
      });

      expect(getElementSearchInput()).not.toBeNull();
    });

    it('does not render the searchInput when false', () => {
      rendered = renderComponent({
        enableSearch: false
      });

      expect(rendered.queryByTestId('search-input')).toBeNull();
    });
  });

  describe('text value props', () => {
    it('overrides the text values correctly in the child components', () => {
      rendered = renderComponent({
        // Force <SelectOpions /> to display empty state
        items: [],
        textForEmptyState: 'some empty state',
        textForSearchInputPlaceholder: 'some placeholder',
        textForCreateItem: (text) => `${text}-foo`
      });

      searchFor('abcd');

      let searchInput = getElementSearchInput();
      let selectItems = getElementSelectItems();
      let createItem = getElementCreateItem();

      // Test that text labels are rendered
      expect(searchInput).toHaveAttribute('placeholder', 'some placeholder');
      expect(selectItems).toHaveTextContent('some empty state');
      expect(createItem).toHaveTextContent('abcd-foo');

      cleanup();
      rendered = renderComponent({
        textForNoSearchResults: 'no search results state'
      });

      // Search for something that doesn't exist
      searchFor('zzz');

      searchInput = getElementSearchInput();
      selectItems = getElementSelectItems();
      createItem = getElementCreateItem();

      // Test that text labels are rendered
      expect(selectItems).toHaveTextContent('no search results state');
    });
  });

  describe('searching for items', () => {
    it('the component updates while typing', () => {
      rendered = renderComponent({
        textForCreateItem: (text) => `Create '${text}'`
      });

      searchFor('ra');

      const expected = [
        { id: 'MH', name: 'Maharashtra' },
        { id: 'KL', name: 'Kerala' }
      ];

      const searchInput = getElementSearchInput();
      const createItem = getElementCreateItem();

      expect(searchInput.value).toBe('ra');
      expect(displayedItems()).toMatchObject(expected);
      expect(createItem).toHaveTextContent('Create \'ra\'');
    });

    it('selected item resets to first item with each input change', () => {
      rendered = renderComponent();

      pressArrowDownOnSearchInpupt();
      expectCurrentSelectedItemToBe('MH');

      searchFor('a');
      expectCurrentSelectedItemToBe('TN');
    });

    it('clearing the input resets the component', () => {
      rendered = renderComponent();

      const searchInput = getElementSearchInput();
      searchFor('ra');
      searchFor('');

      const createItem = getElementCreateItem();

      expect(searchInput.value).toBe('');
      expect(displayedItems()).toMatchObject(items);
      expect(createItem).not.toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    it('items can be navigated with the up/down arrow', () => {
      rendered = renderComponent();

      pressArrowDownOnSearchInpupt();
      expectCurrentSelectedItemToBe('MH');

      pressArrowDownOnSearchInpupt();
      expectCurrentSelectedItemToBe('KL');

      pressArrowDownOnSearchInpupt();
      expectCurrentSelectedItemToBe('KL');

      pressArrowUpOnSearchInput();
      expectCurrentSelectedItemToBe('MH');

      pressArrowUpOnSearchInput();
      expectCurrentSelectedItemToBe('TN');

      pressArrowUpOnSearchInput();
      expectCurrentSelectedItemToBe('TN');
    });
  });
});

const getElementSearchInput = () => rendered.queryByTestId('search-input').querySelector('input');
const getElementSelectItems = () => rendered.queryByTestId('select-items');
const getElementCreateItem = () => rendered.queryByTestId('create-item');

const pressArrowUpOnSearchInput = () => {
  const searchInput = getElementSearchInput();
  return fireEvent.keyDown(searchInput, { keyCode: KeyCodes.ARROW_UP });
};

const pressArrowDownOnSearchInpupt = () => {
  const searchInput = getElementSearchInput();
  return fireEvent.keyDown(searchInput, { keyCode: KeyCodes.ARROW_DOWN });
};

const expectCurrentSelectedItemToBe = (expectedItemId) => {
  const selectItems = getElementSelectItems();
  const currentSelectedItem = selectItems.querySelector('li.selected').dataset.id;

  expect(currentSelectedItem).toEqual(expectedItemId);
};

const searchFor = (text) => {
  const searchInput = getElementSearchInput();
  fireEvent.change(searchInput, { target: { value: text } });
};

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
    items: items,
    closeMenu: closeMenu,
    handleSelect: handleSelect,
    handleCreate: handleCreate,
    enableSearch: true
  };
  const props = { ...fixedProps, ...additionalProps };

  return render(<DropdownMenu {...props} />);
};
