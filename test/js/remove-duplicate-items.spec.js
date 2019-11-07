import removeDuplicateItems from 'utils/remove-duplicate-items';

it('removes duplicates, preserving only the first instance', () => {
  const items = [
    { id: 'a', name: '1' },
    { id: 'b', name: '2' },
    { id: 'a', name: '3' },
    { id: 'c', name: '4' },
    { id: 'b', name: '5' }
  ];

  const expected = [
    { id: 'a', name: '1' },
    { id: 'b', name: '2' },
    { id: 'c', name: '4' }
  ];

  expect(removeDuplicateItems(items)).toMatchObject(expected);
});
