import CloseMenuButton from 'close-menu-button';
import DropdownMenu from 'dropdown-menu';
import OpenMenuButton from 'open-menu-button';
import parseItems from 'utils/parse-items';
import PropTypes from 'prop-types';
import React from 'react';

class ReactSelectOrCreate extends React.Component {

  static propTypes = {
    items: PropTypes.array.isRequired,

    onCreate: PropTypes.func,
    onSelect: PropTypes.func,

    createItemBehaviorOnEmptySearch: PropTypes.string,

    enableSearch: PropTypes.bool,

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
    enableSearch: true,
    onCreate: null,
    onSelect: null
  }

  constructor(props) {
    super(props);

    this.updateItems = this.updateItems.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.renderMenuClosed = this.renderMenuClosed.bind(this);
    this.renderMenuOpen = this.renderMenuOpen.bind(this);

    this.state = {
      items: parseItems(this.props.items),
      menuOpen: false
    };
  }

  updateItems(newItems) {
    this.setState((_prevState) => {
      return { items: parseItems(newItems) };
    });
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
    this.closeMenu();

    /* eslint-disable lines-around-comment */

    if (this.props.onCreate === null) {
      /*
       * If no handler was specified, just prepend the new item
       * to the existing list with a pseudo-random id
       */
      const id = `id-${new Date().getTime()}`;
      const newItems = [{ id: id, name: itemName }].concat(this.state.items);

      this.updateItems(newItems);
      return;
    }

    const returnVal = this.props.onCreate(itemName, this.state.items);

    if (typeof returnVal.then === 'function') {
      /*
       * If the handler returns a Promise, evaluate it asynchronously
       * and set the resulting object as the new value of `items`
       * Also see: https://stackoverflow.com/q/27746304/2490003
       */
      returnVal.
        then((newItems) => this.updateItems(newItems)).
        catch((error) => console.error(error)); // eslint-disable-line no-console
    }
    else if (typeof returnVal === 'object') {
      /*
       * If the handler returns an object, set that object as the new
       * value of `items`.
       */
      this.updateItems(returnVal);
    }

    /* eslint-enable lines-around-comment */
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
          enableSearch={this.props.enableSearch}
          createItemBehaviorOnEmptySearch={this.props.createItemBehaviorOnEmptySearch}
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
