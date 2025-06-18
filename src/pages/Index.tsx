
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Wand2, Copy, Download, Mail, FileText, MessageSquare, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import OutputPreview from '@/components/OutputPreview';

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState('');
  const [format, setFormat] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Hardcoded Gemini API key
  const GEMINI_API_KEY = 'AIzaSyBPIluo0P8oUrWj2yQSCR6ix-sLZ_ZbADE';

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some bullet points or task updates to generate content.",
        variant: "destructive"
      });
      return;
    }

    if (!tone || !format) {
      toast({
        title: "Selection Required",
        description: "Please select both tone and format for generation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a professional content generator. Convert the user's input into a well-structured ${format} with a ${tone} tone. Format the output professionally and make it ready to use.

Please convert these bullet points/notes into a ${format} with a ${tone} tone:

${inputText}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated';
      setGeneratedContent(generatedText);
      
      toast({
        title: "Content Generated!",
        description: "Your AI-powered content has been generated successfully using Gemini 2.0.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileContent = (content: string) => {
    setInputText(content);
    toast({
      title: "File Uploaded",
      description: "File content has been loaded into the input area.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AutoMail & ReportGen
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Content Generation with Gemini 2.0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Input Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your bullet points, task updates, or meeting notes here...&#10;&#10;• Project milestone completed&#10;• Team meeting scheduled for Friday&#10;• Budget review pending&#10;• Client feedback received"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                />
                
                <FileUpload onFileContent={handleFileContent} />
              </CardContent>
            </Card>

            {/* Generation Settings */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span>Generation Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tone</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-400">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Formal
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="friendly">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Friendly
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Urgent
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Format</label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-400">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="status report">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Status Report</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="summary">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>Summary</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating with Gemini 2.0...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <OutputPreview content={generatedContent} />
        </div>
      </div>
    </div>
  );
};

export default Index;
