import { cleanup, fireEvent, render } from '@testing-library/react';
import CloseMenuButton from 'close-menu-button';
import KeyCodes from 'utils/key-codes';
import React from 'react';

let onClick;

const defaults = CloseMenuButton.defaultProps;

beforeEach(() => {
  onClick = jest.fn();
});

afterEach(cleanup);

describe('<CloseMenuButton />', () => {
  it('renders the component', () => {
    const rendered = renderComponent();

    const button = rendered.getByTestId('close-menu-button');
    expect(button).toHaveAttribute('role', 'button');

    const content = button.querySelector('span');
    expect(content).toHaveTextContent(defaults.label);
  });

  describe('label prop', () => {
    it('overrides the default label when a string is provided', () => {
      const rendered = renderComponent({ label: 'foo' });

      const button = rendered.getByTestId('close-menu-button');

      const content = button.querySelector('span');
      expect(content).toHaveTextContent('foo');
    });

    it('overrides the default label when a function is provided', () => {
      const labelFunc = () => { return <div>custom text</div>; };
      const rendered = renderComponent({ label: labelFunc });

      const button = rendered.getByTestId('close-menu-button');

      const content = button.querySelector('div');
      expect(content).toHaveTextContent('custom text');
    });
  });

  describe('button click event', () => {
    it('fires onClick', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('close-menu-button');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('button keyPress event', () => {
    it('fires onClick if Enter was pressed', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('close-menu-button');
      fireEvent.keyPress(button, KeyCodes.ENTER);

      expect(onClick).toHaveBeenCalled();
    });

    it('does not fire onClick if another key was pressed', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('close-menu-button');
      fireEvent.keyPress(button, KeyCodes.ESCAPE);

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = { onClick: onClick };
  const props = { ...fixedProps, ...additionalProps };

  return render(<CloseMenuButton {...props} />);
};
