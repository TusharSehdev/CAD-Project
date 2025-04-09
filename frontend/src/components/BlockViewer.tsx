import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Block } from "@/types";
import { blockApi } from "@/services/api";

interface BlockViewerProps {
  blocks?: Block[];
  initialSearch?: string;
  fileId?: number;
}

export function BlockViewer({ blocks: initialBlocks, initialSearch = "", fileId }: BlockViewerProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks || []);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(!initialBlocks);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  
  // If initialBlocks is not provided, fetch blocks from API
  useEffect(() => {
    if (!initialBlocks) {
      fetchBlocks();
    }
  }, [initialBlocks, fileId, currentPage]);
  
  const fetchBlocks = async () => {
    try {
      setIsLoading(true);
      
      const filters: { search?: string; fileId?: number } = {};
      if (searchTerm) filters.search = searchTerm;
      if (fileId) filters.fileId = fileId;
      
      const response = await blockApi.getBlocks({
        page: currentPage,
        limit: 10,
        ...filters
      });
      
      setBlocks(response.blocks);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = () => {
    setCurrentPage(1);
    fetchBlocks();
  };
  
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchBlocks();
  };
  
  const handleViewDetails = async (blockId: number) => {
    try {
      // If we already have complete block data, use it
      const blockInState = blocks.find(b => b.id === blockId);
      
      if (blockInState && blockInState.properties) {
        setSelectedBlock(blockInState);
      } else {
        // Otherwise fetch the complete block data
        const blockDetails = await blockApi.getBlockById(blockId);
        setSelectedBlock(blockDetails);
      }
    } catch (error) {
      console.error("Error fetching block details:", error);
    }
  };
  
  const filteredBlocks = useMemo(() => {
    // Only perform client-side filtering if we have initialBlocks
    // Otherwise, filtering is handled by the API
    if (!initialBlocks || !searchTerm.trim()) return blocks;
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    return blocks.filter(block => 
      block.name.toLowerCase().includes(lowerCaseSearch) || 
      (block.category && block.category.toLowerCase().includes(lowerCaseSearch))
    );
  }, [blocks, searchTerm, initialBlocks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>CAD Blocks</CardTitle>
        <CardDescription>
          View and interact with blocks from your CAD files.
        </CardDescription>
        <div className="flex mt-4">
          <Input 
            placeholder="Search blocks..." 
            className="max-w-sm mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="outline" onClick={searchTerm ? handleClearSearch : handleSearch}>
            {searchTerm ? "Clear" : "Search"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            Loading blocks...
          </div>
        ) : filteredBlocks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No blocks found matching your search criteria.
          </div>
        ) : (
          <>
            <Table>
              <TableCaption>
                {blocks.length > 0 
                  ? `Showing ${filteredBlocks.length} ${initialBlocks ? `of ${blocks.length}` : ""} blocks.`
                  : "Upload a CAD file to view blocks."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlocks.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell className="font-medium">{block.name}</TableCell>
                    <TableCell>{block.category}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(block.id)}
                          >
                            View Properties
                          </Button>
                        </DialogTrigger>
                        {selectedBlock && selectedBlock.id === block.id && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{selectedBlock.name} Properties</DialogTitle>
                              <DialogDescription>
                                Details for the selected block
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {Object.entries(selectedBlock.properties || {}).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2 items-center gap-4">
                                  <span className="text-sm font-medium capitalize">{key}:</span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {!initialBlocks && totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span className="mx-2 flex items-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 