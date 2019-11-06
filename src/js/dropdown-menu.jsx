import CreateItem from 'create-item';
import PropTypes from 'prop-types';
import React from 'react';
import SearchInput from 'search-input';
import SelectItems from 'select-items';

class DropdownMenu extends React.Component {

  static propTypes = {
    items: PropTypes.array.isRequired,

    closeMenu: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleCreate: PropTypes.func.isRequired,

    textForEmptyState: PropTypes.string,
    textForNoSearchResults: PropTypes.string,
    textForSearchInputPlaceholder: PropTypes.string,
    textForCreateItem: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ])
  }

  constructor(props) {
    super(props);

    this.updateSearchResults = this.updateSearchResults.bind(this);
    this.incrementSelectedItem = this.incrementSelectedItem.bind(this);
    this.decrementSelectedItem = this.decrementSelectedItem.bind(this);

    this.state = {
      searchInputValue: '',
      filteredItems: this.props.items,
      currentSelectedItemIndex: 0
    };
  }

  updateSearchResults(query, results) {
    this.setState({
      searchInputValue: query,
      filteredItems: results,
      currentSelectedItemIndex: 0
    });
  }

  incrementSelectedItem() {
    this.setState((prevState) => {
      let idx = prevState.currentSelectedItemIndex;

      if (idx < prevState.filteredItems.length - 1) {
        idx += 1;
      }

      return { currentSelectedItemIndex: idx };
    });
  }

  decrementSelectedItem() {
    this.setState((prevState) => {
      let idx = prevState.currentSelectedItemIndex;

      if (idx > 0) {
        idx -= 1;
      }

      return { currentSelectedItemIndex: idx };
    });
  }

  render() {
    return (
      <div data-testid="dropdown-menu" className="dropdown-menu">
        <SearchInput
          items={this.props.items}
          filteredItems={this.state.filteredItems}
          currentSelectedItemIndex={this.state.currentSelectedItemIndex}
          onChange={this.updateSearchResults}
          onKeyEnter={this.props.handleSelect}
          onKeyEscape={this.props.closeMenu}
          onKeyArrowDown={this.incrementSelectedItem}
          onKeyArrowUp={this.decrementSelectedItem}
          placeholder={this.props.textForSearchInputPlaceholder} />

        <SelectItems
          allItems={this.props.items}
          filteredItems={this.state.filteredItems}
          currentSelectedItemIndex={this.state.currentSelectedItemIndex}
          onClick={this.props.handleSelect}
          textForEmptyState={this.props.textForEmptyState}
          textForNoSearchResults={this.props.textForNoSearchResults} />

        <CreateItem
          searchInputValue={this.state.searchInputValue}
          onClick={this.props.handleCreate}
          label={this.props.textForCreateItem} />
      </div>
    );
  }

}

export default DropdownMenu;
