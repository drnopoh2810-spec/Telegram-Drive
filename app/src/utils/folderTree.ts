export interface FolderLike {
  id: number;
  name: string;
  parent_id?: number | null;
}

export interface FlatFolder<T extends FolderLike> {
  folder: T;
  depth: number;
}

const normalizeParentId = (parentId: number | null | undefined): number | null =>
  parentId === undefined ? null : parentId;

export function getChildFolders<T extends FolderLike>(
  folders: T[],
  parentId: number | null,
): T[] {
  const folderIds = new Set(folders.map((folder) => folder.id));
  return folders.filter((folder) => {
    const folderParentId = normalizeParentId(folder.parent_id);
    if (parentId === null) {
      return folderParentId === null || !folderIds.has(folderParentId);
    }
    return folderParentId === parentId;
  });
}

export function flattenFolderTree<T extends FolderLike>(
  folders: T[],
  parentId: number | null = null,
): FlatFolder<T>[] {
  const flattened: FlatFolder<T>[] = [];
  const visited = new Set<number>();

  const walk = (currentParentId: number | null, depth: number) => {
    for (const folder of getChildFolders(folders, currentParentId)) {
      if (visited.has(folder.id)) continue;
      visited.add(folder.id);
      flattened.push({ folder, depth });
      walk(folder.id, depth + 1);
    }
  };

  walk(parentId, 0);
  return flattened;
}

export function getFolderPath<T extends FolderLike>(
  folders: T[],
  folderId: number | null,
): T[] {
  if (folderId === null) return [];

  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const path: T[] = [];
  const seen = new Set<number>();
  let current = byId.get(folderId);

  while (current && !seen.has(current.id)) {
    path.unshift(current);
    seen.add(current.id);
    const parentId = normalizeParentId(current.parent_id);
    current = parentId === null ? undefined : byId.get(parentId);
  }

  return path;
}
