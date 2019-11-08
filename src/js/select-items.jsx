import { KeyCodes, parseKeyCode } from 'utils/key-codes';
import autoScrollToShowItem from 'auto-scroll';
import PropTypes from 'prop-types';
import React from 'react';

class SelectItems extends React.Component {

  static propTypes = {
    allItems: PropTypes.array.isRequired,
    filteredItems: PropTypes.array.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    currentSelectedItemIndex: PropTypes.number.isRequired,

    onClick: PropTypes.func.isRequired,

    textForEmptyState: PropTypes.string,
    textForNoSearchResults: PropTypes.string
  };

  static defaultProps = {
    textForEmptyState: 'Empty',
    textForNoSearchResults: 'No Results'
  }

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.renderEmptyState = this.renderEmptyState.bind(this);
    this.renderNoSearchResults = this.renderNoSearchResults.bind(this);
    this.renderItems = this.renderItems.bind(this);
  }

  componentDidUpdate() {
    autoScrollToShowItem();
  }

  onClick(e) {
    const itemId = e.currentTarget.dataset.id;
    this.props.onClick(itemId);
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

  renderEmptyState() {
    return <span className="empty-state">{this.props.textForEmptyState}</span>;
  }

  renderNoSearchResults() {
    return <span className="no-search-results-state">{this.props.textForNoSearchResults}</span>;
  }

  renderItems() {
    const items = this.props.filteredItems;
    let counter = -1;
    const self = this;

    return (
      items.map((item) => {
        counter += 1;
        const className = counter === self.props.currentSelectedItemIndex ? 'selected' : '';

        /*
         * NOTE: WAI-ARIA recommends event listeners are not placed on
         * non-interactive elements such as <li>. TherRecommended alternative
         * is an internal <div> containing the event listeners and letting
         * <li> preseve its semantic meaning as a container.
         *
         */
        // eslint-disable-next-line max-len
        // See: github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions.md
        return (
          <li key={item.id} data-id={item.id} className={className}>
            <div data-id={item.id} role="presentation" onClick={self.onClick} onKeyDown={self.onKeyDown}>
              {item.html || <span>{item.name}</span>}
            </div>
          </li>
        );
      })
    );
  }

  render() {
    let content;

    if (this.props.allItems.length === 0) {
      content = this.renderEmptyState();
    }
    else if (this.props.filteredItems.length === 0) {
      content = this.renderNoSearchResults();
    }
    else {
      content = this.renderItems();
    }

    return (
      <ul data-testid="select-items" className="select-items">
        {content}
      </ul>
    );
  }

}

export default SelectItems;
