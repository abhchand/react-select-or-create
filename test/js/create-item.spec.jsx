import { cleanup, fireEvent, render } from '@testing-library/react';
import CreateItem from 'create-item';
import { KeyCodes } from 'utils/key-codes';
import React from 'react';

let searchInputValue;
let onClick;

const defaults = CreateItem.defaultProps;

beforeEach(() => {
  onClick = jest.fn();
  searchInputValue = 'Georgia';
});

afterEach(cleanup);

describe('<CreateItem />', () => {
  it('renders the component', () => {
    const rendered = renderComponent();

    const button = rendered.getByTestId('create-item');
    expect(button).toHaveAttribute('role', 'button');

    const content = button.querySelector('span');
    expect(content).toHaveTextContent(defaults.label);
  });

  describe('button click event', () => {
    it('it fires onClick', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('create-item');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('button keyDown event', () => {
    it('fires onClick if Enter was pressed', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('create-item');
      fireEvent.keyDown(button, { keyCode: KeyCodes.ENTER });

      expect(onClick).toHaveBeenCalled();
    });

    it('does not fire onClick if another key was pressed', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('create-item');
      fireEvent.keyDown(button, { keyCode: KeyCodes.ESCAPE });

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('behaviorOnEmptySearch prop', () => {
    let behaviorOnEmptySearch;

    describe('value is `hidden`', () => {
      beforeEach(() => { behaviorOnEmptySearch = 'hidden'; });

      describe('searchInputValue is blank', () => {
        beforeEach(() => { searchInputValue = ''; });

        it('renders the component as hidden (i.e. null)', () => {
          expectRenderedAsHidden({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });

      describe('searchInputValue is present', () => {
        beforeEach(() => { searchInputValue = 'Georgia'; });

        it('renders the component as enabled', () => {
          expectRenderedAsEnabled({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });
    });

    describe('value is `disabled`', () => {
      beforeEach(() => { behaviorOnEmptySearch = 'disabled'; });

      describe('searchInputValue is blank', () => {
        beforeEach(() => { searchInputValue = ''; });

        it('renders the component as disabled', () => {
          expectRenderedAsDisabled({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });

      describe('searchInputValue is present', () => {
        beforeEach(() => { searchInputValue = 'Georgia'; });

        it('renders the component as enabled', () => {
          expectRenderedAsEnabled({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });
    });

    describe('value is `enabled`', () => {
      beforeEach(() => { behaviorOnEmptySearch = 'enabled'; });

      describe('searchInputValue is blank', () => {
        beforeEach(() => { searchInputValue = ''; });

        it('renders the component as enabled', () => {
          expectRenderedAsEnabled({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });

      describe('searchInputValue is present', () => {
        beforeEach(() => { searchInputValue = 'Georgia'; });

        it('renders the component as enabled', () => {
          expectRenderedAsEnabled({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });
    });

    describe('value is invalid', () => {
      beforeEach(() => { behaviorOnEmptySearch = 'abcdefgh'; });

      describe('searchInputValue is blank', () => {
        beforeEach(() => { searchInputValue = ''; });

        it('renders the component as disabled', () => {
          expectRenderedAsDisabled({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });

      describe('searchInputValue is present', () => {
        beforeEach(() => { searchInputValue = 'Georgia'; });

        it('renders the component as enabled', () => {
          expectRenderedAsEnabled({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });
    });

    describe('value is `null`', () => {
      beforeEach(() => { behaviorOnEmptySearch = null; });

      describe('searchInputValue is blank', () => {
        beforeEach(() => { searchInputValue = ''; });

        it('renders the component as disabled', () => {
          expectRenderedAsDisabled({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });

      describe('searchInputValue is present', () => {
        beforeEach(() => { searchInputValue = 'Georgia'; });

        it('renders the component as enabled', () => {
          expectRenderedAsEnabled({ behaviorOnEmptySearch: behaviorOnEmptySearch });
        });
      });
    });
  });

  describe('label prop', () => {
    it('overrides the default label when a function is provided', () => {
      const label = (text) => <div>{`${text} - foo`}</div>;
      const rendered = renderComponent({ label: label });

      const button = rendered.getByTestId('create-item');
      const content = button.querySelector('div');

      expect(content).toHaveTextContent(`${searchInputValue} - foo`);
    });

    it('overrides the default label when a string is provided', () => {
      const rendered = renderComponent({ label: 'some string' });

      const button = rendered.getByTestId('create-item');
      const content = button.querySelector('span');

      expect(content).toHaveTextContent('some string');
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = { searchInputValue: searchInputValue, onClick: onClick };
  const props = { ...fixedProps, ...additionalProps };

  return render(<CreateItem {...props} />);
};

const expectRenderedAsHidden = (additionalRenderProps = {}) => {
  const rendered = renderComponent(additionalRenderProps);

  const button = rendered.queryByTestId('create-item');
  expect(button).toBeNull();
};

const expectRenderedAsDisabled = (additionalRenderProps = {}) => {
  const rendered = renderComponent(additionalRenderProps);

  // Component is rendered as disabled
  const button = rendered.getByTestId('create-item');
  expect(button).toHaveClass('create-item--disabled');

  // Component is not clickable
  fireEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();

  // Component does not respond to keyboard events
  fireEvent.keyDown(button, { keyCode: KeyCodes.ENTER });
  expect(onClick).not.toHaveBeenCalled();
};

const expectRenderedAsEnabled = (additionalRenderProps = {}) => {
  const rendered = renderComponent(additionalRenderProps);

  // Component is rendered as enabled
  const button = rendered.getByTestId('create-item');
  expect(button).not.toHaveClass('create-item--disabled');

  // Component is clickable
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalled();

  // Component responds to keyboard events
  fireEvent.keyDown(button, { keyCode: KeyCodes.ENTER });
  expect(onClick).toHaveBeenCalled();
};
