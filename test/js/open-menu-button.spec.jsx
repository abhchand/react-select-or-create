import { cleanup, fireEvent, render } from '@testing-library/react';
import KeyCodes from 'utils/key-codes';
import OpenMenuButton from 'open-menu-button';
import React from 'react';

let onClick;

beforeEach(() => {
  onClick = jest.fn();
});

afterEach(cleanup);

describe('<OpenMenuButton />', () => {
  it('renders the component', () => {
    const rendered = renderComponent();

    const button = rendered.getByTestId('open-menu-button');
    expect(button).toHaveAttribute('role', 'button');
  });

  describe.only('label prop', () => {
    it('overrides the default label when a string is provided', () => {
      const rendered = renderComponent({ label: 'foo' });

      const button = rendered.getByTestId('open-menu-button');

      const content = button.querySelector('span');
      expect(content).toHaveTextContent('foo');
    });

    it('overrides the default label when a function is provided', () => {
      const labelFunc = () => { return <div>custom text</div>; };
      const rendered = renderComponent({ label: labelFunc });

      const button = rendered.getByTestId('open-menu-button');

      const content = button.querySelector('div');
      expect(content).toHaveTextContent('custom text');
    });
  });

  describe('button click event', () => {
    it('fires onClick', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('open-menu-button');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('button keyPress event', () => {
    it('fires onClick if Enter was pressed', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('open-menu-button');
      fireEvent.keyPress(button, KeyCodes.ENTER);

      expect(onClick).toHaveBeenCalled();
    });

    it('does not fire onClick if another key was pressed', () => {
      const rendered = renderComponent();

      const button = rendered.getByTestId('open-menu-button');
      fireEvent.keyPress(button, KeyCodes.ESCAPE);

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = { onClick: onClick };
  const props = { ...fixedProps, ...additionalProps };

  return render(<OpenMenuButton {...props} />);
};
