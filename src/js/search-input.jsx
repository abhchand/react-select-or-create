import { keyCodes, parseKeyCode } from 'utils';
import PropTypes from 'prop-types';
import React from 'react';

class SearchInput extends React.Component {

  static propTypes = {
    items: PropTypes.array.isRequired,
    filteredItems: PropTypes.array.isRequired,
    currentSelectedItemIndex: PropTypes.number.isRequired,

    onChange: PropTypes.func.isRequired,

    onKeyEnter: PropTypes.func.isRequired,
    onKeyEscape: PropTypes.func.isRequired,
    onKeyArrowDown: PropTypes.func.isRequired,
    onKeyArrowUp: PropTypes.func.isRequired,

    placeholder: PropTypes.string
  };

  static defaultProps = {
    placeholder: 'Search...'
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.performSearch = this.performSearch.bind(this);
  }

  componentDidMount() {
    this.searchInput.focus();
  }

  onChange(e) {
    const query = e.target.value;
    const results = this.performSearch(query);

    this.props.onChange(query, results);
  }

  onKeyDown(e) {
    e.stopPropagation();

    switch (parseKeyCode(e)) {
      case keyCodes.ENTER: {
        const idx = this.props.currentSelectedItemIndex;
        const id = this.props.filteredItems[idx].id;
        this.props.onKeyEnter(id);
        break;
      }

      case keyCodes.ESCAPE: {
        this.props.onKeyEscape();
        break;
      }

      case keyCodes.ARROW_UP: {
        this.props.onKeyArrowUp();
        break;
      }

      case keyCodes.ARROW_DOWN: {
        this.props.onKeyArrowDown();
        break;
      }

    // eslint skip default
    }
  }

  performSearch(_query) {
    const items = this.props.items;
    const results = [];

    const query = _query.trim();
    const regex = new RegExp(query, 'iu');

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const name = item.name;

      // If user has not searched for anything
      if (query.length <= 0) {
        results.push({
          id: item.id,
          name: name,
          html: <span>{name}</span>
        });
        continue;
      }

      const match = item.name.match(regex);

      /*
       * If user has searched for something, and this item
       * is a match
       */
      if (match) {
        const idxStart = name.toLowerCase().indexOf(query.toLowerCase());
        const idxEnd = idxStart + query.length - 1;

        const a = name.substring(0, idxStart);
        const b = name.substring(idxStart, idxEnd + 1);
        const c = name.substring(idxEnd + 1, name.length);

        results.push({
          id: item.id,
          name: name,
          html: <span>{a}<span className="highlight">{b}</span>{c}</span>
        });
      }
    }

    return results;
  }

  render() {
    return (
      <div data-testid="search-input" className="search-input">
        <input
          ref={(input) => { this.searchInput = input; }}
          type="text"
          name="search"
          autoComplete="off"
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown} />
      </div>
    );
  }

}

export default SearchInput;
