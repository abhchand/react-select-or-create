# react-select-or-create

<p align="left">
  <a href="https://www.npmjs.com/package/react-select-or-create">
    <img src="https://img.shields.io/npm/v/react-select-or-create.svg" alt="npm version" >
  </a>
  <a href="https://packagephobia.now.sh/result?p=react-select-or-create">
    <img src="https://packagephobia.now.sh/badge?p=react-select-or-create" alt="install size" >
  </a>
  <a href="https://github.com/abhchand/react-select-or-create/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/react-select-or-create.svg" alt="license">
  </a>
  <a href="https://circleci.com/gh/abhchand/react-select-or-create">
    <img src="https://circleci.com/gh/abhchand/react-select-or-create.svg?style=shield&circle-token=:circle-token">
  </a>
</p>

A customizable select-or-create dropdown for ReactJS

You can [view a live demo here](https://abhchand.me/react-select-or-create) or [view this project on npm here](https://www.npmjs.com/package/react-select-or-create)

<img src="meta/demo.gif" width="300" />


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

<ReactSelectOrCreate items={countries} />
```

Finally, import the styling. The component ships with minimal styling that you can override as needed.

```scss
@import "react-select-or-create/dist/main.css";
```

### Specifying click behavior

The above example renders a simple dropdown, but it's probably not very useful since by default it doesn't do anything when an item is clicked or created.

We can specify this behavior with the `onSelect` and `onCreate` function handlers:

```js
import ReactSelectOrCreate from 'react-select-or-create';

const colors = [{ id: 'blue', name: 'Blue' }, { id: 'pink', name: 'Pink' }];

const onSelect = (itemId) => { alert(`Item '${itemId}' clicked!`); };

const onCreate = (itemName, prevItems) => {
  alert(`Adding '${itemName}' to the end of the list!`);

  const id = String.prototype.toLowerCase(itemName);
  return prevItems.concat([{ id: id, name: itemName }]);
};

<ReactSelectOrCreate items={colors} onSelect={onSelect} onCreate={onCreate} />
```

### Specifying asynchronous behavior

It is sometimes useful to asynchronously run the `onCreate` logic that handles the creation of a new item.

For example, if you are managing a list of "teams" and the user creates a new team (item), you may want to asynchronously send a `POST` request to your application's server before updating the list.

The `onCreate` prop allows you to return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) which will eventually return an updated list of items.

```js
const onCreate = (itemName, prevItems) => {

  // We use an artificial delay with `setTimeout()` here to
  // mimic a long running async action
  // Reminder: Make sure you `return` your Promise!

  return new Promise((resolve) => setTimeout(resolve, 5000))
  .then(() => {
    const id = String.prototype.toLowerCase(itemName);
    return prevItems.concat([{ id: id, name: itemName }]);
  })
};
```

# Props

* [`items`](#items) (required)
* [`onSelect`](#onSelect)
* [`onCreate`](#onCreate)
* [`createItemBehaviorOnEmptySearch`](#createItemBehaviorOnEmptySearch)
* [`textForOpenMenuButton`](#textForOpenMenuButton)
* [`textForCloseMenuButton`](#textForCloseMenuButton)
* [`textForEmptyState`](#textForEmptyState)
* [`textForNoSearchResults`](#textForNoSearchResults)
* [`textForSearchInputPlaceholder`](#textForSearchInputPlaceholder)
* [`textForCreateItem`](#textForCreateItem)


### `items` (required)

A list of items to be displayed in the dropdown list

**type**: `{Array}`

```
[
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' }
]
```

`items` will be validated as follows:

* All `id`s must be unique. If duplicate `id`s are detected, only the first occurance of the item is used and the remaining duplicate items will be ignored when rendering.
* `id`s can not be `null` or `undefined`, or they will be ignored when rendering.

### `onSelect`

A function to be called when an item is selected.

**type**: `{Function(String itemId, String itemName)}`

**default**: `null`

The function will receive the id and name of the clicked item as arguments.

If no function is provided, then by default nothing will happen when an item is clicked.


### `onCreate`

A function to be called when a new item is created

**type**: `{Function(String itemName, Array prevItems)}`

**default**: `null` (see behavior below)

If no function is provided (e.g. `onCreate: null`), then any newly created item will be added to the top of the item list with a randomly generated `id`.

If a function definition is provided, it will receive as arguments the name of the new item and the array of previous items. It must return either:

* a **new array of items** to be displayed
* a `Promise` that will return a **new array of items** to be displayed

Please note that it is entirely up to you to determine how to modify the array of previous items to add in the newly created item, as well as how to generate a new unique id for it.

### `createItemBehaviorOnEmptySearch`

Defines the behavior of the "create" button _when the search field is blank_.

**type**: `{String}`

**default**: `'disabled'`

There are 3 possible values:

|value|description|
|---|---|
|`hidden`|The button will not be rendered.|
|`disabled`|The button will be rendered, but disabled. Clicking on the button or using the `ENTER` key will **not** trigger the `onCreate` handler. A special CSS class `create-item--disabled` will also be added so you can easily style the disabled state.|
|`enabled`|The button will be rendered as fully functional. Clicking on the button or using the `ENTER` key **will** trigger the `onCreate` handler.|

In all cases the button will become enabled and clickable once some text is entered into the search field.

If any other value is provided, it will ignore it and fall back on the default value.

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

### `textForEmptyState`

Text to be displayed when the list of `items` is empty.

**type**: `{String}`

**default**: `'Empty'`

### `textForNoSearchResults`

Text to be displayed when no item matches the search query.

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

See [release notes](https://github.com/abhchand/react-select-or-create/releases)
