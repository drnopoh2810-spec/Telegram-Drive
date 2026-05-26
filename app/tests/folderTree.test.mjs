import assert from "node:assert/strict";
import test from "node:test";
import { flattenFolderTree, getChildFolders } from "../.tmp-tests/folderTree.js";

const folders = [
  { id: 1, name: "Root A" },
  { id: 2, name: "Child A", parent_id: 1 },
  { id: 3, name: "Grandchild A", parent_id: 2 },
  { id: 4, name: "Root B", parent_id: null },
  { id: 5, name: "Orphan", parent_id: 999 },
];

test("flattens nested folders in parent-child order", () => {
  assert.deepEqual(
    flattenFolderTree(folders).map(({ folder, depth }) => `${folder.name}:${depth}`),
    ["Root A:0", "Child A:1", "Grandchild A:2", "Root B:0", "Orphan:0"],
  );
});

test("returns direct children for a selected parent", () => {
  assert.deepEqual(
    getChildFolders(folders, 1).map((folder) => folder.name),
    ["Child A"],
  );
});
