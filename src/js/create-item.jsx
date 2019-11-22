import { KeyCodes, parseKeyCode } from 'utils/key-codes';
import PropTypes from 'prop-types';
import React from 'react';

class CreateItem extends React.Component {

  // eslint-disable-next-line react/sort-comp
  static behaviorsOnEmptySearch = [
    'enabled',
    'disabled',
    'hidden'
  ];

  static propTypes = {
    searchInputValue: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    behaviorOnEmptySearch: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ])
  };

  static defaultProps = {
    behaviorOnEmptySearch: 'disabled',
    label: 'Create'
  }

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.label = this.label.bind(this);
    this.isValidBehaviorOnEmptySearch = this.isValidBehaviorOnEmptySearch.bind(this);
    this.shouldDisable = this.shouldDisable.bind(this);
    this.shouldHide = this.shouldHide.bind(this);
  }

  componentDidMount() {
    if (!this.isValidBehaviorOnEmptySearch()) {
      // Note: The actual "defaulting" is implemented in the logic below
      // eslint-disable-next-line no-console
      console.warn(`Invalid value \`${this.props.behaviorOnEmptySearch}\` for prop ` +
        `\`createItemBehaviorOnEmptySearch\`, expected one of [${CreateItem.behaviorsOnEmptySearch}]. ` +
        'Defaulting to \'disabled\'.');
    }
  }

  // eslint-disable-next-line no-unused-vars
  onClick(_e) {
    if (this.shouldDisable()) {
      return;
    }

    this.props.onClick(this.searchValue());
  }

  onKeyDown(e) {
    if (this.shouldDisable()) {
      return;
    }

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

  isValidBehaviorOnEmptySearch() {
    return CreateItem.behaviorsOnEmptySearch.indexOf(this.props.behaviorOnEmptySearch) >= 0;
  }

  // eslint-disable-next-line padded-blocks
  shouldDisable() {

    /*
     * If an invalid value is specified, we default the behavior to the
     * same as `disabled`
     */
    return this.searchValue().length === 0 &&
      (this.props.behaviorOnEmptySearch === 'disabled' || !this.isValidBehaviorOnEmptySearch());
  }

  shouldHide() {
    return this.searchValue().length === 0 && this.props.behaviorOnEmptySearch === 'hidden';
  }

  render() {
    if (this.shouldHide()) {
      return null;
    }

    return (
      <div
        data-testid="create-item"
        role="button"
        tabIndex={0}
        className={`create-item ${this.shouldDisable() ? 'create-item--disabled' : ''}`}
        onClick={this.onClick}
        onKeyDown={this.onKeyDown}>
        {this.label()}
      </div>
    );
  }

}

export default CreateItem;
