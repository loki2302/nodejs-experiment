# todo

1. it should throw if "for" is not specified
2. it should throw if "as" is not specified
3. it should look at where "for" points to
4. it should publish at where "as" points to
4.1. it should not be available outside the target scope
4.2. the target scope should inherit the parent scope
5. it should publish removeItem
5.1. removeItem should throw if item does not exist
5.2. removeItem should remove item if it exists
6. it should publish newItem
7. it should publish addItem
7.1. addItem should append to "for"
7.2. addItem should reset newItem
