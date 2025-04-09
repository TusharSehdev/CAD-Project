import { Block } from "@/types";
import { bypassFetch } from "@/utils/securityExtensions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Interface for pagination parameters
interface PaginationParams {
  page?: number;
  limit?: number;
}

// Interface for block filter parameters
interface BlockFilterParams extends PaginationParams {
  search?: string;
  categoryId?: number;
  fileId?: number;
}

// Interface for API response with pagination
interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  [key: string]: any;
}

// CAD file API 
export const fileApi = {
  // Upload a CAD file - Using XMLHttpRequest to bypass BitDefender interference
  uploadFile: async (file: File): Promise<{ blocks: Block[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use bypassFetch to avoid extension interference
    return bypassFetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
  },
  
  // Get all files with pagination
  getFiles: async (params: PaginationParams = {}): Promise<PaginatedResponse<{ files: any[] }>> => {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    
    try {
      // Try the secure method first
      return await bypassFetch(`${API_URL}/files?${queryParams}`);
    } catch (error) {
      // Fall back to regular fetch if bypass fails
      const response = await fetch(`${API_URL}/files?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch files');
      }
      
      return response.json();
    }
  },
  
  // Get file by ID
  getFileById: async (id: number): Promise<any> => {
    try {
      // Try the secure method first
      return await bypassFetch(`${API_URL}/files/${id}`);
    } catch (error) {
      // Fall back to regular fetch
      const response = await fetch(`${API_URL}/files/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch file');
      }
      
      return response.json();
    }
  }
};

// Block API
export const blockApi = {
  // Get all blocks with pagination and filtering
  getBlocks: async (params: BlockFilterParams = {}): Promise<PaginatedResponse<{ blocks: Block[] }>> => {
    const { page = 1, limit = 10, search, categoryId, fileId } = params;
    
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    
    if (search) queryParams.append('search', search);
    if (categoryId) queryParams.append('categoryId', categoryId.toString());
    if (fileId) queryParams.append('fileId', fileId.toString());
    
    try {
      // Try secure method first
      return await bypassFetch(`${API_URL}/blocks?${queryParams}`);
    } catch (error) {
      // Fall back to regular fetch
      const response = await fetch(`${API_URL}/blocks?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch blocks');
      }
      
      return response.json();
    }
  },
  
  // Get block by ID
  getBlockById: async (id: number): Promise<Block> => {
    try {
      // Try secure method first
      return await bypassFetch(`${API_URL}/blocks/${id}`);
    } catch (error) {
      // Fall back to regular fetch
      const response = await fetch(`${API_URL}/blocks/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch block');
      }
      
      return response.json();
    }
  },
  
  // Get all block categories
  getCategories: async (): Promise<{ id: number; name: string; description: string }[]> => {
    try {
      // Try secure method first
      return await bypassFetch(`${API_URL}/categories`);
    } catch (error) {
      // Fall back to regular fetch
      const response = await fetch(`${API_URL}/categories`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch categories');
      }
      
      return response.json();
    }
  }
}; 