import CloseMenuButton from 'close-menu-button';
import DropdownMenu from 'dropdown-menu';
import OpenMenuButton from 'open-menu-button';
import PropTypes from 'prop-types';
import React from 'react';
import removeDuplicateItems from 'utils/remove-duplicate-items';

class ReactSelectOrCreate extends React.Component {

  static propTypes = {
    items: PropTypes.array.isRequired,

    onCreate: PropTypes.func,
    onSelect: PropTypes.func,

    textForOpenMenuButton: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    textForCloseMenuButton: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    textForEmptyState: PropTypes.string,
    textForNoSearchResults: PropTypes.string,
    textForSearchInputPlaceholder: PropTypes.string,

    textForCreateItem: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ])
  };

  static defaultProps = {
    onCreate: null,
    onSelect: null
  }

  constructor(props) {
    super(props);

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.renderMenuClosed = this.renderMenuClosed.bind(this);
    this.renderMenuOpen = this.renderMenuOpen.bind(this);

    this.state = {
      items: removeDuplicateItems(this.props.items),
      menuOpen: false
    };
  }

  openMenu() {
    this.setState({
      menuOpen: true
    });
  }

  closeMenu() {
    this.setState({
      menuOpen: false
    });
  }

  onCreate(itemName) {
    let newItems;

    // eslint-disable-next-line padded-blocks
    if (this.props.onCreate === null) {

      /*
       * If no handler was specified, just prepend the new item
       * to the existing list with a pseudo-random id
       */
      const id = `id-${new Date().getTime()}`;
      newItems = [{ id: id, name: itemName }].concat(this.state.items);
    }
    else {
      newItems = this.props.onCreate(itemName, this.state.items);
    }

    this.setState(() => ({ items: removeDuplicateItems(newItems) }));
    this.closeMenu();
  }

  onSelect(itemId) {
    if (this.props.onSelect !== null) {
      const item = this.state.items.find((i) => i.id === itemId);
      this.props.onSelect(item.id, item.name);
    }

    this.closeMenu();
  }

  renderMenuClosed() {
    return (
      <div tabIndex={-1} className="react-select-or-create">
        <OpenMenuButton
          onClick={this.openMenu}
          label={this.props.textForOpenMenuButton} />
      </div>
    );
  }

  renderMenuOpen() {
    return (
      <div tabIndex={-1} className="react-select-or-create">
        <CloseMenuButton
          onClick={this.closeMenu}
          label={this.props.textForCloseMenuButton} />

        <DropdownMenu
          items={this.state.items}
          closeMenu={this.closeMenu}
          handleSelect={this.onSelect}
          handleCreate={this.onCreate}
          textForSearchInputPlaceholder={this.props.textForSearchInputPlaceholder}
          textForEmptyState={this.props.textForEmptyState}
          textForNoSearchResults={this.props.textForNoSearchResults}
          textForCreateItem={this.props.textForCreateItem} />
      </div>
    );
  }

  render() {
    return this.state.menuOpen ? this.renderMenuOpen() : this.renderMenuClosed();
  }

}

export default ReactSelectOrCreate;
