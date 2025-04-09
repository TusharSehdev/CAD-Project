import * as React from "react";
import { useState, useEffect } from "react";
import { FileInput } from "./ui/file-input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import { Block } from "@/types";
import { fileApi } from "@/services/api";
import {
  detectSecurityExtensions,
  getSecurityExtensionMessage,
} from "@/utils/securityExtensions";
import { Alert, AlertDescription } from "./ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FileUploaderProps {
  onUploadSuccess: (blocks: Block[]) => void;
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [securityExtensionMessage, setSecurityExtensionMessage] = useState<
    string | null
  >(null);

  // Check for security extensions on component mount
  useEffect(() => {
    const message = getSecurityExtensionMessage();
    setSecurityExtensionMessage(message);
  }, []);

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

      const { hasBitDefender } = detectSecurityExtensions();

      if (hasBitDefender && !securityExtensionMessage) {
        // Only show this if we haven't already shown the alert
        toast.warning(
          "BitDefender extension detected. If upload fails, try disabling it temporarily.",
          { duration: 5000 }
        );
      }

      const response = await fileApi.uploadFile(file);

      toast.success(`File "${file.name}" uploaded successfully!`);
      onUploadSuccess(response.blocks);
    } catch (error) {
      console.error("Error uploading file:", error);

      // Handle different error types with more specific messages
      let errorMessage = "Failed to upload file. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Check for BitDefender or extension-related errors
        if (
          error.message.includes("Failed to fetch") ||
          error.toString().includes("chrome-extension") ||
          error.toString().includes("eppiocemhmnlbhjplcgkofciiegomcon")
        ) {
          errorMessage =
            "Upload failed due to browser extension interference. Try disabling BitDefender Web Protection or other security extensions.";
        }
      }

      toast.error(errorMessage, { duration: 8000 });
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
        {securityExtensionMessage && (
          <Alert variant="warning" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>{securityExtensionMessage}</AlertDescription>
          </Alert>
        )}

        <FileInput
          label="Select CAD File"
          acceptedFileTypes=".dwg,.dxf"
          description="Supported formats: DWG, DXF"
          id="cad-file"
          onChange={handleFileChange}
        />
        {file && (
          <p className="mt-2 text-sm">
            Selected file: <span className="font-medium">{file.name}</span> (
            {(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </CardFooter>
    </Card>
  );
}
