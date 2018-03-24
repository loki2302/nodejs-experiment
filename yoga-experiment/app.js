const yoga = require('yoga-layout');
const Node = yoga.Node;

const root = Node.create();
root.setWidth(500);
root.setHeight(300);
root.setFlexDirection(yoga.FLEX_DIRECTION_ROW);
root.setJustifyContent(yoga.JUSTIFY_SPACE_BETWEEN);

const nodes = [];
for(var i = 0; i < 3; ++i) {
    const node = Node.create();
    node.setWidth(100);
    node.setHeight(100);
    root.insertChild(node, i);
    nodes.push(node);
}

root.calculateLayout(500, 300);

for(var i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    const layout = node.getComputedLayout();
    console.log(`${i}: left=${layout.left}, top=${layout.top}, width=${layout.width}, height=${layout.height}`);
}
