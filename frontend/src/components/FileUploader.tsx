import * as React from "react";
import { useState } from "react";
import { FileInput } from "./ui/file-input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { Block } from "@/types";
import { fileApi } from "@/services/api";

interface FileUploaderProps {
  onUploadSuccess: (blocks: Block[]) => void;
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      
      const response = await fileApi.uploadFile(file);
      
      toast.success(`File "${file.name}" uploaded successfully!`);
      onUploadSuccess(response.blocks);
      
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload CAD File</CardTitle>
        <CardDescription>
          Upload DWG or DXF files to view and interact with their blocks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileInput 
          label="Select CAD File" 
          acceptedFileTypes=".dwg,.dxf" 
          description="Supported formats: DWG, DXF"
          id="cad-file"
          onChange={handleFileChange}
        />
        {file && (
          <p className="mt-2 text-sm">
            Selected file: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </CardFooter>
    </Card>
  );
} 