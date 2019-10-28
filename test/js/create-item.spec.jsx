import { cleanup, fireEvent, render } from '@testing-library/react';
import CreateItem from 'create-item';
import KeyCodes from 'utils/key-codes';
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

  describe('searchInputValue is an empty string', () => {
    it('still renders the component', () => {
      const rendered = renderComponent({ searchInputValue: '' });

      const button = rendered.getByTestId('create-item');
      const content = button.querySelector('span');
      expect(content).toHaveTextContent(defaults.label);
    });
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
      fireEvent.keyDown(button, KeyCodes.ENTER);

      expect(onClick).toHaveBeenCalled();
    });

    it('does not fire onClick if another key was pressed', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('create-item');
      fireEvent.keyDown(button, KeyCodes.ESCAPE);

      expect(onClick).not.toHaveBeenCalled();
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

