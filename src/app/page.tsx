
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { reversePromptEngineering } from "@/ai/flows/reverse-prompt-engineering";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [aiOutput, setAiOutput] = useState("");
  const [likelyPrompt, setLikelyPrompt] = useState<string | null>(null);
  const [templatePrompt, setTemplatePrompt] = useState<string | null>(null);
  const [suggestedImprovement, setSuggestedImprovement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleReverseEngineer = async () => {
    setIsLoading(true);
    try {
      const result = await reversePromptEngineering({ aiOutput });
      setLikelyPrompt(result.likelyPrompt);
      setTemplatePrompt(result.templatePrompt);
      setSuggestedImprovement(result.suggestedImprovement);
    } catch (error: any) {
      console.error("Error during reverse prompt engineering:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reverse engineer prompt.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `Copied to clipboard`,
      description: `Copied ${label}`
    });
  };

  const handleReset = () => {
    setAiOutput("");
    setLikelyPrompt(null);
    setTemplatePrompt(null);
    setSuggestedImprovement(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Reverse Prompt Engineering</CardTitle>
          <CardDescription>
            Enter the AI output to reverse engineer the prompt.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Textarea
              placeholder="AI Output"
              value={aiOutput}
              onChange={(e) => setAiOutput(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={handleReverseEngineer} disabled={isLoading || !aiOutput}>
                {isLoading ? "Loading..." : "Reverse Engineer"}
              </Button>
            </div>
          </div>

          {likelyPrompt && (
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Badge>Likely Prompt</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(likelyPrompt, "Likely Prompt")}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <Card className="bg-secondary">
                <CardContent>{likelyPrompt}</CardContent>
              </Card>
            </div>
          )}

          {templatePrompt && (
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Badge>Template Prompt</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(templatePrompt, "Template Prompt")}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <Card className="bg-secondary">
                <CardContent>{templatePrompt}</CardContent>
              </Card>
            </div>
          )}

          {suggestedImprovement && (
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Badge>Suggested Improvement</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(suggestedImprovement, "Suggested Improvement")}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <Card className="bg-secondary">
                <CardContent>{suggestedImprovement}</CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
