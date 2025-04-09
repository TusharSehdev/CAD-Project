// Types for the CAD blocks and properties
export interface BlockProperty {
  [key: string]: string | number;
}

export interface Block {
  id: number;
  name: string;
  category: string;
  properties: BlockProperty;
}

export interface UploadResponse {
  message: string;
  filename: string;
  size: number;
  type: string;
  blocks: Block[];
}

export interface ErrorResponse {
  error: string;
} 