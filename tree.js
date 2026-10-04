import { Node } from './node.js';

const assertCallback = (callback) => {
  if (typeof callback !== 'function') {
    throw new Error('A callback function is required');
  }
};

export class Tree {
  constructor(array) {
    this.root = this.#buildTree(array);
  }

  #buildTree(array) {
    const sorted = [...new Set(array)].sort((a, b) => a - b);

    const build = (start, end) => {
      if (start > end) return null;
      const mid = Math.floor((start + end) / 2);
      const node = new Node(sorted[mid]);
      node.left = build(start, mid - 1); // smaller values
      node.right = build(mid + 1, end); // bigger values
      return node;
    };

    return build(0, sorted.length - 1);
  }

  // searching - inserting - deleting

  #findNode(value) {
    let current = this.root;
    while (current !== null) {
      if (value === current.data) return current;
      current = value < current.data ? current.left : current.right;
    }
    return null;
  }

  includes(value) {
    return this.#findNode(value) !== null;
  }

  insert(value) {
    this.root = this.#insertNode(this.root, value);
  }

  #insertNode(node, value) {
    if (node === null) return new Node(value); // found the empty spot
    if (value < node.data) node.left = this.#insertNode(node.left, value);
    else if (value > node.data)
      node.right = this.#insertNode(node.right, value);
    return node;
  }

  deleteItem(value) {
    this.root = this.#deleteNode(this.root, value);
  }

  // Returns the (possibly new) root of this subtree.
  #deleteNode(node, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.#deleteNode(node.left, value);
    } else if (value > node.data) {
      node.right = this.#deleteNode(node.right, value);
    } else {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      let successor = node.right;
      while (successor.left !== null) successor = successor.left;
      node.data = successor.data;
      node.right = this.#deleteNode(node.right, successor.data);
    }
    return node;
  }

  //   traversals

  levelOrderForEach(callback) {
    assertCallback(callback);
    if (this.root === null) return;

    const queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift(); // take from the front
      callback(node.data);
      if (node.left) queue.push(node.left); // add children at the back
      if (node.right) queue.push(node.right);
    }
  }

  levelOrderForEachRecursive(callback) {
    assertCallback(callback);

    const visitLevel = (nodesInLevel) => {
      if (nodesInLevel.length === 0) return;
      const nextLevel = [];
      for (const node of nodesInLevel) {
        callback(node.data);
        if (node.left) nextLevel.push(node.left);
        if (node.right) nextLevel.push(node.right);
      }
      visitLevel(nextLevel);
    };

    if (this.root) visitLevel([this.root]);
  }

  // Depth-first: left -> node -> right (gives sorted order in a BST)
  inOrderForEach(callback) {
    assertCallback(callback);
    const visit = (node) => {
      if (node === null) return;
      visit(node.left);
      callback(node.data);
      visit(node.right);
    };
    visit(this.root);
  }

  // Depth-first: node -> left -> right
  preOrderForEach(callback) {
    assertCallback(callback);
    const visit = (node) => {
      if (node === null) return;
      callback(node.data);
      visit(node.left);
      visit(node.right);
    };
    visit(this.root);
  }

  // Depth-first: left -> right -> node
  postOrderForEach(callback) {
    assertCallback(callback);
    const visit = (node) => {
      if (node === null) return;
      visit(node.left);
      visit(node.right);
      callback(node.data);
    };
    visit(this.root);
  }

  // height - depth - balance

  #nodeHeight(node) {
    if (node === null) return -1;
    return (
      1 + Math.max(this.#nodeHeight(node.left), this.#nodeHeight(node.right))
    );
  }

  height(value) {
    const node = this.#findNode(value);
    return node === null ? undefined : this.#nodeHeight(node);
  }

  depth(value) {
    let current = this.root;
    let edges = 0;
    while (current !== null) {
      if (value === current.data) return edges;
      current = value < current.data ? current.left : current.right;
      edges++;
    }
    return undefined;
  }

  isBalanced() {
    const check = (node) => {
      if (node === null) return true;
      const diff = Math.abs(
        this.#nodeHeight(node.left) - this.#nodeHeight(node.right),
      );
      return diff <= 1 && check(node.left) && check(node.right);
    };
    return check(this.root);
  }

  // Collect the values in sorted order, then build a fresh balanced tree.
  rebalance() {
    const values = [];
    this.inOrderForEach((value) => values.push(value));
    this.root = this.#buildTree(values);
  }
}
