import { KeyCodes, parseKeyCode } from 'utils/key-codes';
import PropTypes from 'prop-types';
import React from 'react';

class CreateItem extends React.Component {

  static propTypes = {
    searchInputValue: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ])
  };

  static defaultProps = {
    label: 'Create'
  }

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.label = this.label.bind(this);
  }

  // eslint-disable-next-line no-unused-vars
  onClick(_e) {
    this.props.onClick(this.searchValue());
  }

  onKeyDown(e) {
    switch (parseKeyCode(e)) {
      case KeyCodes.ENTER: {
        this.onClick(e);
        break;
      }

    // eslint skip default
    }
  }

  searchValue() {
    return this.props.searchInputValue.trim();
  }

  label() {
    switch (typeof this.props.label) {
      case 'string': {
        return <span>{this.props.label}</span>;
      }

      case 'function': {
        return this.props.label(this.searchValue());
      }

      default: {
        return CreateItem.defaultProps.label;
      }
    }
  }

  render() {
    return (
      <div
        data-testid="create-item"
        role="button"
        tabIndex={0}
        className="create-item"
        onClick={this.onClick}
        onKeyDown={this.onKeyDown}>
        {this.label()}
      </div>
    );
  }

}

export default CreateItem;
