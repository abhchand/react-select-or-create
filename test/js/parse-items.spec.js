import parseItems from 'utils/parse-items';

describe('removeNullIdItems()', () => {
  it('removes items with null id', () => {
    const items = [
      { id: 'a', name: '1' },
      { id: null, name: '2' },
      { id: 'c', name: '4' }
    ];

    const expected = [
      { id: 'a', name: '1' },
      { id: 'c', name: '4' }
    ];

    expect(parseItems(items)).toMatchObject(expected);
  });

  it('removes items with undefined id', () => {
    const items = [
      { id: 'a', name: '1' },
      // eslint-disable-next-line no-undefined
      { id: undefined, name: '2' },
      { id: 'c', name: '4' }
    ];

    const expected = [
      { id: 'a', name: '1' },
      { id: 'c', name: '4' }
    ];

    expect(parseItems(items)).toMatchObject(expected);
  });
});

describe('removeDuplicateItems()', () => {
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

    expect(parseItems(items)).toMatchObject(expected);
  });
});
