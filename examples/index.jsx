import React from 'react';
import ReactDom from 'react-dom';
import ReactSelectOrCreate from '../src/js/react-select-or-create';

const items = [
  { id: 'AP', name: 'Andhra Pradesh' },
  { id: 'AR', name: 'Arunachal Pradesh' },
  { id: 'AS', name: 'Assam' },
  { id: 'BR', name: 'Bihar' },
  { id: 'CG', name: 'Chhattisgarh' },
  { id: 'GA', name: 'Goa' },
  { id: 'GJ', name: 'Gujarat' },
  { id: 'HP', name: 'Himachal Pradesh' },
  { id: 'HR', name: 'Haryana' },
  { id: 'JH', name: 'Jharkhand' },
  { id: 'JK', name: 'Jammu and Kashmir ' },
  { id: 'KA', name: 'Karnataka' },
  { id: 'KL', name: 'Kerala' },
  { id: 'MH', name: 'Maharashtra' },
  { id: 'ML', name: 'Meghalaya' },
  { id: 'MN', name: 'Manipur' },
  { id: 'MP', name: 'Madhya Pradesh' },
  { id: 'MZ', name: 'Mizoram' },
  { id: 'NL', name: 'Nagaland' },
  { id: 'OD', name: 'Odisha' },
  { id: 'PB', name: 'Punjab' },
  { id: 'RJ', name: 'Rajasthan' },
  { id: 'SK', name: 'Sikkim' },
  { id: 'TN', name: 'Tamil Nadu' },
  { id: 'TR', name: 'Tripura' },
  { id: 'TS', name: 'Telangana' },
  { id: 'UK', name: 'Uttarakhand' },
  { id: 'UP', name: 'Uttar Pradesh' },
  { id: 'WB', name: 'West Bengal' }
];

const onCreate = (itemName, prevItems) => {
  // eslint-disable-next-line no-alert
  alert(`onCreate fired with item '${itemName}'!`);

  const id = `id-${new Date().getTime()}`;

  prevItems.unshift({ id: id, name: itemName });
  return prevItems;
};

// eslint-disable-next-line no-alert
const onSelect = (itemId) => { alert(`onSelect fired with item id '${itemId}'!`); };

const textForCreateItem = (searchValue) => {
  return <span>{ searchValue === '' ? 'Create State' : `Create State '${searchValue}'` }</span>;
};

ReactDom.render(
  <ReactSelectOrCreate items={items} />,
  document.getElementById('app-simple'),
);

ReactDom.render(
  <ReactSelectOrCreate
    items={items}
    onCreate={onCreate}
    onSelect={onSelect}
    textForOpenMenuButton="What state do you live in?"
    textForCloseMenuButton="States of India 🇮🇳"
    textForEmptyState="Nothing here"
    textForNoSearchResults="No matches!"
    textForSearchInputPlaceholder="Start typing.."
    textForCreateItem={textForCreateItem} />,
  document.getElementById('app-customized'),
);
