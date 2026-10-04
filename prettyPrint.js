import { Tree } from './tree.js';

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null || node === undefined) {
    return;
  }

  prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

// Driver Script

// Array of random numbers, each less than 100 (0-99).
const randomArray = (size = 15) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 100));

// Prints the tree's values in level, pre, post and in order.
const printAllOrders = (tree) => {
  const show = (label, traverse) => {
    const values = [];
    traverse((value) => values.push(value));
    console.log(`${label}: ${values.join(' ')}`);
  };
  show('Level order', (cb) => tree.levelOrderForEach(cb));
  show('Pre order  ', (cb) => tree.preOrderForEach(cb));
  show('Post order ', (cb) => tree.postOrderForEach(cb));
  show('In order   ', (cb) => tree.inOrderForEach(cb));
};

// 1. Create a BST from an array of random numbers < 100
const numbers = randomArray();
console.log('Random array:', numbers.join(', '));
const tree = new Tree(numbers);
prettyPrint(tree.root);

// 2. Confirm the tree is balanced
console.log('\nBalanced?', tree.isBalanced());

// 3. Print all elements in level, pre, post and in order
printAllOrders(tree);

// 4. Unbalance the tree by adding several numbers > 100
//    (inserted in increasing order, they form one long chain on the right)
[105, 120, 150, 200, 300].forEach((n) => tree.insert(n));
console.log('\nAfter inserting numbers > 100:');
prettyPrint(tree.root);

// 5. Confirm the tree is unbalanced
console.log('\nBalanced?', tree.isBalanced());

// 6. Rebalance the tree
tree.rebalance();
console.log('\nAfter rebalance():');
prettyPrint(tree.root);

// 7. Confirm the tree is balanced again
console.log('\nBalanced?', tree.isBalanced());

// 8. Print all elements in level, pre, post and in order
printAllOrders(tree);

// Extra: quick demo of the remaining methods
console.log('\n--- extra demo ---');
const rootValue = tree.root.data;
console.log('includes(root value):', tree.includes(rootValue));
console.log('includes(12345)     :', tree.includes(12345));
console.log('height(root value)  :', tree.height(rootValue));
console.log('depth(root value)   :', tree.depth(rootValue));
console.log('height(12345)       :', tree.height(12345)); // not found -> undefined

tree.deleteItem(rootValue);
console.log(`\nAfter deleteItem(${rootValue}):`);
prettyPrint(tree.root);

try {
  tree.levelOrderForEach(); // no callback given
} catch (error) {
  console.log('\nError caught:', error.message);
}
