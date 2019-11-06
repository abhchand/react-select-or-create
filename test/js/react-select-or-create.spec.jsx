import { cleanup, fireEvent, render } from '@testing-library/react';
import KeyCodes from 'utils/key-codes';
import React from 'react';
import ReactSelectOrCreate from 'react-select-or-create';

let rendered;

let items;
let onCreate;
let onSelect;

beforeEach(() => {
  items = [
    { id: 'TN', name: 'Tamil Nadu' },
    { id: 'MH', name: 'Maharashtra' },
    { id: 'KL', name: 'Kerala' }
  ];

  onCreate = jest.fn();
  onSelect = jest.fn();
});

afterEach(cleanup);

describe('<ReactSelectOrCreate />', () => {
  it('renders the component with menu closed', () => {
    rendered = renderComponent();

    const component = rendered.container;

    expect(component).toContainElement(getElementOpenMenuButton());
    expect(component).not.toContainElement(getElementCloseMenuButton());
    expect(component).not.toContainElement(getElementDropdownMenu());
  });

  describe('opening the dropdown menu', () => {
    it('user can open menu onClick', () => {
      rendered = renderComponent();

      clickOpenMenuButton();
      const component = rendered.container;

      expect(component).not.toContainElement(getElementOpenMenuButton());
      expect(component).toContainElement(getElementCloseMenuButton());
      expect(component).toContainElement(getElementDropdownMenu());
    });

    it('user can open menu onKeyPress Enter', () => {
      rendered = renderComponent();

      fireEvent.keyPress(getElementOpenMenuButton(), KeyCodes.ENTER);
      const component = rendered.container;

      expect(component).not.toContainElement(getElementOpenMenuButton());
      expect(component).toContainElement(getElementCloseMenuButton());
      expect(component).toContainElement(getElementDropdownMenu());
    });
  });

  describe('closing the dropdown menu', () => {
    it('user can open menu onClick', () => {
      rendered = renderComponent();

      clickOpenMenuButton();
      clickCloseMenuButton();

      const component = rendered.container;

      expect(component).toContainElement(getElementOpenMenuButton());
      expect(component).not.toContainElement(getElementCloseMenuButton());
      expect(component).not.toContainElement(getElementDropdownMenu());
    });

    it('user can close menu onKeyPress Enter', () => {
      rendered = renderComponent();

      clickOpenMenuButton();
      fireEvent.keyPress(getElementCloseMenuButton(), KeyCodes.ENTER);

      const component = rendered.container;

      expect(component).toContainElement(getElementOpenMenuButton());
      expect(component).not.toContainElement(getElementCloseMenuButton());
      expect(component).not.toContainElement(getElementDropdownMenu());
    });
  });

  it('user can search and filter items', () => {
    rendered = renderComponent();

    clickOpenMenuButton();
    searchFor('ra');

    expect(getElementSearchInput().value).toBe('ra');
    expect(displayedItems()).toMatchObject([
      { id: 'MH', name: 'Maharashtra' },
      { id: 'KL', name: 'Kerala' }
    ]);
  });

  describe('selecting items', () => {
    it('user can select an item onClick', () => {
      rendered = renderComponent();

      clickOpenMenuButton();

      expect(onSelect).not.toHaveBeenCalled();
      expect(onCreate).not.toHaveBeenCalled();

      fireEvent.click(getItem('MH'));

      expect(onSelect).toHaveBeenCalled();
      expect(onSelect.mock.calls[0]).toMatchObject([
        'MH',
        'Maharashtra'
      ]);
      expect(onCreate).not.toHaveBeenCalled();
    });

    it('user can select an item onKeyDown Enter', () => {
      rendered = renderComponent();

      clickOpenMenuButton();

      expect(onSelect).not.toHaveBeenCalled();
      expect(onCreate).not.toHaveBeenCalled();

      pressArrowDownOnSearchInpupt();
      fireEvent.keyDown(getElementSearchInput(), KeyCodes.ENTER);

      expect(onSelect).toHaveBeenCalled();
      expect(onSelect.mock.calls[0]).toMatchObject([
        'MH',
        'Maharashtra'
      ]);
      expect(onCreate).not.toHaveBeenCalled();
    });
  });

  describe('create new item', () => {
    it('user can create a new item onClick', () => {
      rendered = renderComponent();

      clickOpenMenuButton();

      expect(onSelect).not.toHaveBeenCalled();
      expect(onCreate).not.toHaveBeenCalled();

      searchFor('abcde');
      fireEvent.click(getElementCreateItem());

      expect(onSelect).not.toHaveBeenCalled();
      expect(onCreate).toHaveBeenCalled();
      expect(onCreate.mock.calls[0]).toMatchObject([
        'abcde',
        items
      ]);
    });

    it('user can create a new item onKeyDown Enter', () => {
      rendered = renderComponent();

      clickOpenMenuButton();

      expect(onSelect).not.toHaveBeenCalled();
      expect(onCreate).not.toHaveBeenCalled();

      searchFor('abcde');
      fireEvent.keyDown(getElementCreateItem(), KeyCodes.ENTER);

      expect(onSelect).not.toHaveBeenCalled();
      expect(onCreate).toHaveBeenCalled();
      expect(onCreate.mock.calls[0]).toMatchObject([
        'abcde',
        items
      ]);
    });
  });

  describe('text props', () => {
    it('overrides the default text props when present', () => {
      rendered = renderComponent({
        textForCloseMenuButton: 'foo close',
        textForNoSearchResults: 'foo no results',
        textForSearchInputPlaceholder: 'foo search',
        textForCreateItem: (text) => `foo ${text}`
      });

      clickOpenMenuButton();

      // TextForCloseMenuButton
      expect(getElementCloseMenuButton()).toHaveTextContent('foo close');

      // TextForSearchInputPlaceholder
      expect(getElementSearchInput()).toHaveAttribute('placeholder', 'foo search');


      searchFor('zzzz');

      // TextForNoSearchResults
      expect(getElementSelectItems()).toHaveTextContent('foo no results');

      // TextForCreateItem
      expect(getElementCreateItem()).toHaveTextContent('foo zzzz');

      cleanup();
      rendered = renderComponent({
        items: [],
        textForEmptyState: 'foo empty'
      });

      clickOpenMenuButton();

      // TextForEmptyState
      searchFor('zzzz');
      expect(getElementSelectItems()).toHaveTextContent('foo empty');
    });
  });
});

const getElementOpenMenuButton = () => rendered.queryByTestId('open-menu-button');
const getElementCloseMenuButton = () => rendered.queryByTestId('close-menu-button');
const getElementDropdownMenu = () => rendered.queryByTestId('dropdown-menu');
const getElementSearchInput = () => rendered.getByTestId('search-input').querySelector('input');
const getElementCreateItem = () => rendered.getByTestId('create-item');
const getElementSelectItems = () => rendered.getByTestId('select-items');

const clickOpenMenuButton = () => fireEvent.click(getElementOpenMenuButton());
const clickCloseMenuButton = () => fireEvent.click(getElementCloseMenuButton());

// eslint-disable-next-line no-unused-vars
const pressArrowUpOnSearchInput = () => {
  const searchInput = getElementSearchInput();
  return fireEvent.keyDown(searchInput, KeyCodes.ARROW_UP);
};

const pressArrowDownOnSearchInpupt = () => {
  const searchInput = getElementSearchInput();
  return fireEvent.keyDown(searchInput, KeyCodes.ARROW_DOWN);
};

const getItem = (itemId) => rendered.getByTestId('select-items').querySelector(`li[data-id="${itemId}"] div`);
const searchFor = (query) => fireEvent.change(getElementSearchInput(), { target: { value: query } });


const displayedItems = () => {
  const displayedItemsList = [];
  const selectItems = getElementSelectItems();

  selectItems.querySelectorAll('li').forEach((item) => {
    displayedItemsList.push({ id: item.dataset.id, name: item.textContent });
  });

  return displayedItemsList;
};

const renderComponent = (additionalProps = {}) => {
  const fixedProps = { items: items, onCreate: onCreate, onSelect: onSelect };
  const props = { ...fixedProps, ...additionalProps };

  return render(<ReactSelectOrCreate {...props} />);
};
