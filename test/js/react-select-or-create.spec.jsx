import { cleanup, fireEvent, render } from '@testing-library/react';
import { KeyCodes } from 'utils/key-codes';
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

  onCreate = jest.fn((itemName, prevItems) => {
    // Prepend new item to previous list
    return [{ id: itemName, name: itemName }].concat(prevItems);
  });
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

      fireEvent.keyPress(getElementOpenMenuButton(), { keyCode: KeyCodes.ENTER });
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
      fireEvent.keyPress(getElementCloseMenuButton(), { keyCode: KeyCodes.ENTER });

      const component = rendered.container;

      expect(component).toContainElement(getElementOpenMenuButton());
      expect(component).not.toContainElement(getElementCloseMenuButton());
      expect(component).not.toContainElement(getElementDropdownMenu());
    });
  });

  describe('closing the dropdown menu', () => {
    it('removes items with null or undefined id', () => {
      rendered = renderComponent({
        items: [
          { id: 'TN', name: 'Tamil Nadu' },
          { id: null, name: 'Foo' },
          // eslint-disable-next-line no-undefined
          { id: undefined, name: 'Bar' },
          { id: 'MH', name: 'Maharashtra' }
        ]
      });

      clickOpenMenuButton();

      const expected = [
        { id: 'TN', name: 'Tamil Nadu' },
        { id: 'MH', name: 'Maharashtra' }
      ];
      expect(displayedItems()).toEqual(expected);
    });

    it('removes duplicate items', () => {
      rendered = renderComponent({
        items: [
          { id: 'TN', name: 'Tamil Nadu 2' },
          { id: 'TN', name: 'Tamil Nadu' },
          { id: 'MH', name: 'Maharashtra' }
        ]
      });

      clickOpenMenuButton();

      const expected = [
        { id: 'TN', name: 'Tamil Nadu 2' },
        { id: 'MH', name: 'Maharashtra' }
      ];
      expect(displayedItems()).toEqual(expected);
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
      fireEvent.keyDown(getElementSearchInput(), { keyCode: KeyCodes.ENTER });

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
      fireEvent.keyDown(getElementCreateItem(), { keyCode: KeyCodes.ENTER });

      expect(onSelect).not.toHaveBeenCalled();
      expect(onCreate).toHaveBeenCalled();
      expect(onCreate.mock.calls[0]).toMatchObject([
        'abcde',
        items
      ]);
    });

    it('handles items created with duplicate id', () => {
      rendered = renderComponent({
        items: [
          { id: 'TN', name: 'Tamil Nadu' },
          { id: 'MH', name: 'Maharashtra' }
        ]
      });

      clickOpenMenuButton();

      searchFor('TN');
      fireEvent.click(getElementCreateItem());

      clickOpenMenuButton();

      /*
       * Our jest mock function prepends the new value with the
       * same `id` and `name`. The original value will be marked
       * as duplicate.
       */
      const expected = [
        { id: 'TN', name: 'TN' },
        { id: 'MH', name: 'Maharashtra' }
      ];
      expect(displayedItems()).toEqual(expected);
    });
  });

  /*
   * The tests are written so that all optional props are defaulted and
   * we tested their behavior when specified.
   * Since the `onSelect` and `onCreate` handlers are optional but
   * impact so much functionality, we treat them in the opposite manner:
   * assume they are specified and test their behavior when they are
   * defaulted here
   */
  describe('click handler props', () => {
    it('onSelect prop can be null', () => {
      rendered = renderComponent({ onSelect: null });

      clickOpenMenuButton();

      fireEvent.click(getItem('MH'));

      // Menu is closed
      const component = rendered.container;
      expect(component).toContainElement(getElementOpenMenuButton());
      expect(component).not.toContainElement(getElementCloseMenuButton());
    });

    it('onCreate prop can be null', () => {
      rendered = renderComponent({ onCreate: null });

      clickOpenMenuButton();

      searchFor('abcde');
      fireEvent.click(getElementCreateItem());

      // Menu is closed
      const component = rendered.container;
      expect(component).toContainElement(getElementOpenMenuButton());
      expect(component).not.toContainElement(getElementCloseMenuButton());
    });

    describe('onCreate prop behavior', () => {
      describe('onCreate is null', () => {
        it('new items are prepended to the list with a random id', () => {
          rendered = renderComponent({ onCreate: null });

          clickOpenMenuButton();

          searchFor('abcde');
          fireEvent.click(getElementCreateItem());

          clickOpenMenuButton();
          expect(displayedItems()[0].name).toEqual('abcde');
        });
      });

      describe('onCreate returns an object', () => {
        it('uses the returned object to set the new value of `items`', () => {
          onCreate = jest.fn((itemName, prevItems) => {
            return [{ id: 'foo', name: itemName }].concat(prevItems);
          });

          rendered = renderComponent();

          clickOpenMenuButton();

          searchFor('abcde');
          fireEvent.click(getElementCreateItem());

          clickOpenMenuButton();
          expect(displayedItems()[0].id).toEqual('foo');
          expect(displayedItems()[0].name).toEqual('abcde');
        });

        it('removes duplicates from the returned value', () => {
          onCreate = jest.fn((itemName, _prevItems) => {
            return [
              { id: 'foo', name: itemName },
              { id: 'foo', name: 'other' }
            ];
          });

          rendered = renderComponent();

          clickOpenMenuButton();

          searchFor('abcde');
          fireEvent.click(getElementCreateItem());

          clickOpenMenuButton();

          const results = displayedItems();
          expect(results[0].id).toEqual('foo');
          expect(results[0].name).toEqual('abcde');
          expect(results.length).toEqual(1);
        });
      });

      describe('onCreate returns a Promise', () => {
        it('uses the returned object to set the new value of `items`', async() => {
          onCreate = jest.fn((itemName, prevItems) => {
            const newItems = [{ id: 'foo', name: itemName }].concat(prevItems);
            return Promise.resolve(newItems);
          });

          rendered = renderComponent();

          clickOpenMenuButton();

          searchFor('abcde');
          fireEvent.click(getElementCreateItem());

          // Menu should have closed
          expect(getElementOpenMenuButton()).not.toBeNull();

          // eslint-disable-next-line
          await (reopenMenu() && expect(displayedItems()[0].id).toEqual('foo') &&
            expect(displayedItems()[0].name).toEqual('abcde'));
        });

        it('removes duplicates from the returned value', async() => {
          onCreate = jest.fn((itemName, _prevItems) => {
            const newItems = [
              { id: 'foo', name: itemName },
              { id: 'foo', name: 'other' }
            ];
            return Promise.resolve(newItems);
          });

          rendered = renderComponent();

          clickOpenMenuButton();

          searchFor('abcde');
          fireEvent.click(getElementCreateItem());

          // Menu should have closed
          expect(getElementOpenMenuButton()).not.toBeNull();

          // eslint-disable-next-line
          await (reopenMenu() && expect(displayedItems()[0].id).toEqual('foo') &&
            expect(displayedItems()[0].name).toEqual('abcde') &&
            expect(displayedItems().length).toEqual(1));
        });

        it('gracefully handles any errors', async() => {
          onCreate = jest.fn((_itemName, _prevItems) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('rejected promise');
          });

          rendered = renderComponent();

          clickOpenMenuButton();

          searchFor('abcde');
          fireEvent.click(getElementCreateItem());

          // Menu should have closed
          expect(getElementOpenMenuButton()).not.toBeNull();

          // eslint-disable-next-line
          await (reopenMenu() && expect(displayedItems()[0].id).toEqual('TN') &&
            expect(displayedItems()[0].name).toEqual('Tamil Nadu'));
        });
      });
    });
  });

  describe('createItemBehaviorOnEmptySearch prop', () => {
    it('overrides the default behavior when present', () => {
      rendered = renderComponent({ createItemBehaviorOnEmptySearch: 'hidden' });

      clickOpenMenuButton();

      expect(getElementCreateItem()).toBeNull();
      searchFor('abcde');
      expect(getElementCreateItem()).not.toBeNull();
    });
  });

  describe('enableSearch prop', () => {
    it('renders the searchInput when true', () => {
      rendered = renderComponent({ enableSearch: true });

      clickOpenMenuButton();

      expect(getElementSearchInput()).not.toBeNull();
    });

    it('does not render the searchInput when false', () => {
      rendered = renderComponent({ enableSearch: false });

      clickOpenMenuButton();

      expect(rendered.queryByTestId('search-input')).toBeNull();
    });

    it('renders the searchInput when no value is specified', () => {
      rendered = renderComponent();

      clickOpenMenuButton();

      expect(getElementSearchInput()).not.toBeNull();
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
const getElementSearchInput = () => rendered.queryByTestId('search-input').querySelector('input');
const getElementCreateItem = () => rendered.queryByTestId('create-item');
const getElementSelectItems = () => rendered.queryByTestId('select-items');

const clickOpenMenuButton = () => fireEvent.click(getElementOpenMenuButton());
const clickCloseMenuButton = () => fireEvent.click(getElementCloseMenuButton());
const reopenMenu = () => {
  if (getElementCloseMenuButton()) { clickCloseMenuButton(); }
  if (getElementOpenMenuButton()) { clickOpenMenuButton(); }
};

// eslint-disable-next-line no-unused-vars
const pressArrowUpOnSearchInput = () => {
  const searchInput = getElementSearchInput();
  return fireEvent.keyDown(searchInput, { keyCode: KeyCodes.ARROW_UP });
};

const pressArrowDownOnSearchInpupt = () => {
  const searchInput = getElementSearchInput();
  return fireEvent.keyDown(searchInput, { keyCode: KeyCodes.ARROW_DOWN });
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
