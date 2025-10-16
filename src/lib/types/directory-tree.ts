export interface DirectoryTreeInterface {
  path: string;
  name: string;
  size: number;
  type: "directory" | "file";
  children?: DirectoryTreeInterface[];
  extension?: string;
  isSymbolicLink?: boolean;
}
