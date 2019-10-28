A customizable select-or-create dropdown for ReactJS

<img src="meta/demo.gif" width="300" />

You can [view a live demo here](https://abhchand.me)

### Features

- Highly customizable
- Supports keyboard shortcuts
- Designed with a11y in mind
- Well tested

# Usage

Install the package:

```
yarn install react-select-or-create
```

In your React component:

```js
import ReactSelectOrCreate from 'react-select-or-create';

const countries = [
  { id: 'JP', name: 'Japan' },
  { id: 'NG', name: 'Nigeria' },
  { id: 'NL', name: 'Netherlands' }
];

const onSelectHandler = (itemId) => { alert(`Item '${itemId}' clicked!`); };

const onCreateHandler = (itemName, prevItems) => {
  const id = `id-${new Date().getTime()}`;
  const newItems = prevItems.unshift({ id: id, name: itemName });

  alert(`Added '${itemName}' (with id '${id}') to the top of the list!`);

  return newItems;
};

<ReactSelectOrCreate items={countries} onSelect={onSelectHandler} onCreate={onCreateHandler} />
```

The component also ships with minimal styling that you can import and override as needed:

```scss
@import "react-select-or-create/dist/main.css";
```

# Props


### `items` (required)

A list of items to be displayed in the dropdown list

**type**: `{Array}`

```
[
  { id: 'JP', name: 'Apple' },
  { id: 'NG', name: 'Banana' }
]
```

### `onSelect` (required)

A function to be called when an item is selected

**type**: `{Function(String itemId, String itemName)}`


### `onCreate` (required)

A function to be called when a new item is created

**type**: `{Function(String itemName, Array prevItems)}`

This function must return a new list of items to be displayed. It is up to you to determine if and how the new item is inserted into the list of previous items, and how to generate a new unique id.

### `textForOpenMenuButton`

Text to be displayed in the "open" button

**type**: `{String | Function()}`

**default**: `'Open'`

If a `String` is provided it will be automatically wrapped in a `<span>` tag.

If a `Function` is provided, it will be called and can return any desired content, from a simple string to JSX.

### `textForCloseMenuButton`

Text to be displayed in the "close" button

**type**: `{String | Function()}`

**default**: `'Close'`

If a `String` is provided it will be automatically wrapped in a `<span>` tag.

If a `Function` is provided, it will be called and can return any desired content, from a simple string to JSX.

### `textForItemsEmptyState`

Text to be displayed when there are no items to be displayed

**type**: `{String}`

**default**: `'No Results'`

### `textForSearchInputPlaceholder`

Text to be displayed as the search input field `placeholder`

**type**: `{String}`

**default**: `'Search...'`


### `textForCreateItem`

Text to display in the create item section. This will be updated as the user types in the search input.

**type**: `{String | Function(String searchValue)}`

**default**: `'Create'`

If a `String` is provided it will be automatically wrapped in a `<span>` tag.

If a `Function` is provided, it will be called and can return any desired content, from a simple string to JSX. The function receives the current search string as an argument.


# Development

If you'd like to edit or develop the component locally, you can run:

```
git clone https://github.com/abhchand/react-select-or-create.git

yarn install
yarn run dev
```

This will open `http://localhost:3035` in a browser window. Any changes made to the `src/` or to the `examples/index.jsx` file will be hot reloaded.

# Issues / Contributing

- If you have an issue or feature request, please [open an issue here](https://github.com/abhchand/react-select-or-create/issues/new).

- Contribution is encouraged! But please open an issue first to suggest a new feature and confirm that it will be accepted before filing a pull request.

# Changelog

_empty_
