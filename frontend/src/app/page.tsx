"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/FileUploader";
import { BlockViewer } from "@/components/BlockViewer";
import { Block } from "@/types";

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeTab, setActiveTab] = useState("upload");

  const handleUploadSuccess = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    setActiveTab("blocks");
  };

  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">CAD File Block Viewer</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="blocks">View Blocks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </TabsContent>
          
          <TabsContent value="blocks">
            <BlockViewer blocks={blocks} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
} 