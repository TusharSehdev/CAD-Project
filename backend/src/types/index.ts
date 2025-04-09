export interface BlockProperty {
  [key: string]: string | number;
}

export interface Block {
  id: number;
  name: string;
  category: string;
  properties: BlockProperty;
}

export interface File {
  id: number;
  name: string;
  path: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string;
} 