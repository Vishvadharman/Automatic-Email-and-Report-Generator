
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Mail, FileText, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutputPreviewProps {
  content: string;
}

const OutputPreview: React.FC<OutputPreviewProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Content has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (!content) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Content has been downloaded as a text file.",
    });
  };

  const handleEmailLink = () => {
    if (!content) return;
    
    const subject = encodeURIComponent('Generated Content');
    const body = encodeURIComponent(content);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Generated Content</span>
            </CardTitle>
            {content && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEmailLink}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {content ? (
            <div className="bg-white rounded-lg p-6 border border-gray-200 min-h-[300px]">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium leading-relaxed">
                {content}
              </pre>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Content Generated Yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Enter your content and click "Generate Content" to see your AI-powered output here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {content && (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-gray-700">Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-col h-auto py-4 border-green-200 hover:bg-green-50 hover:border-green-300"
              >
                {copied ? <Check className="h-5 w-5 text-green-600 mb-2" /> : <Copy className="h-5 w-5 text-green-600 mb-2" />}
                <span className="text-xs text-green-700">Copy</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex-col h-auto py-4 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                <Download className="h-5 w-5 text-blue-600 mb-2" />
                <span className="text-xs text-blue-700">Download</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleEmailLink}
                className="flex-col h-auto py-4 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
              >
                <Mail className="h-5 w-5 text-purple-600 mb-2" />
                <span className="text-xs text-purple-700">Email</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OutputPreview;
