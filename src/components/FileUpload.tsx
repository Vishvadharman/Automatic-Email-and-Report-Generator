
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileContent }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['.txt', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .txt or .csv file.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onFileContent(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
      <div className="space-y-3">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-50 rounded-full">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Upload a file to auto-populate the input
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Supports .txt and .csv files (max 5MB)
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
