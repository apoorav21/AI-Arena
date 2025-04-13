"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { addVote } from "@/lib/firebaseActions";

const MODELS = ["OpenAI", "Cohere", "Gemini", "DeepSeek R1", "Llama", "Mistral Small v3"];

async function getAIResponse(model: string, prompt: string): Promise<string> {
  try {
    switch (model) {
      case "OpenAI":
        const openaiResponse = await fetch("https://models.inference.ai.azure.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
          }),
        });

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json();
          const errorMessage = errorData.error ? `OpenAI API error: ${errorData.error.message}` : `OpenAI API error: ${openaiResponse.statusText}`;
          throw new Error(errorMessage);
        }

        const openaiData = await openaiResponse.json();
        return openaiData.choices[0].message.content.trim();

      case "Cohere":
        const cohereResponse = await fetch("https://api.cohere.ai/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `BEARER ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
            "Cohere-Version": "2022-12-06",
          },
          body: JSON.stringify({
            model: "command-r-plus",
            prompt: prompt,
            max_tokens: 150,
          }),
        });

        if (!cohereResponse.ok) {
          const errorData = await cohereResponse.json();
          const errorMessage = errorData.error ? `Cohere API error: ${errorData.error.message}` : `Cohere API error: ${cohereResponse.statusText}`;
          throw new Error(errorMessage);
        }

        const cohereData = await cohereResponse.json();
        return cohereData.generations[0].text.trim();

      case "Gemini":
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
              },
            }),
          }
        );

        if (!geminiResponse.ok) {
          const errorData = await geminiResponse.json();
          const errorMessage = errorData.error ? `Gemini API error: ${errorData.error.message}` : `Gemini API error: ${geminiResponse.statusText}`;
          throw new Error(errorMessage);
        }

        const geminiData = await geminiResponse.json();
        if (!geminiData.candidates || geminiData.candidates.length === 0 || !geminiData.candidates[0].content.parts || geminiData.candidates[0].content.parts.length === 0) {
            throw new Error("Gemini API error: No candidates returned");
        }
        return geminiData.candidates[0].content.parts[0].text.trim();
      case "DeepSeek R1":
        const deepseekResponse = await fetch("https://models.inference.ai.azure.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: "DeepSeek-R1",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
          }),
        });

        if (!deepseekResponse.ok) {
          const errorData = await deepseekResponse.json();
          const errorMessage = errorData.error ? `DeepSeek API error: ${errorData.error.message}` : `DeepSeek API error: ${deepseekResponse.statusText}`;
          throw new Error(errorMessage);
        }

        const deepseekData = await deepseekResponse.json();
        return deepseekData.choices[0].message.content.trim();
      case "Llama":
        const llamaResponse = await fetch("https://models.inference.ai.azure.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_LLAMA_API_KEY}`,
          },
          body: JSON.stringify({
            model: "Llama-3.3-70B-Instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
          }),
        });

        if (!llamaResponse.ok) {
          const errorData = await llamaResponse.json();
          const errorMessage = errorData.error ? `Llama API error: ${errorData.error.message}` : `Llama API error: ${llamaResponse.statusText}`;
          throw new Error(errorMessage);
        }

        const llamaData = await llamaResponse.json();
        return llamaData.choices[0].message.content.trim();
      case "Mistral Small v3":
        const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistral-small-250",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
          }),
        });

        if (!mistralResponse.ok) {
          const errorData = await mistralResponse.json();
          const errorMessage = errorData.error ? `Mistral API error: ${errorData.error.message}` : `Mistral API error: ${mistralResponse.statusText}`;
          throw new Error(errorMessage);
        }

        const mistralData = await mistralResponse.json();
        return mistralData.choices[0].message.content.trim();
      default:
        return "Model not supported.";
    }
  } catch (error: any) {
    console.error(`Error calling ${model} API:`, error);
    return `Error from ${model}: ${error.message || "Unknown error"}`;
  }
}

export default function AIArena() {
  const [prompt, setPrompt] = useState("");
  const [modelA, setModelA] = useState("");
  const [modelB, setModelB] = useState("");
  const [responseA, setResponseA] = useState("");
  const [responseB, setResponseB] = useState("");
  const [vote, setVote] = useState<"A" | "B" | "Tie" | null>(null);
  const [showModels, setShowModels] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const selectTwoRandomModels = () => {
    const availableModels = [...MODELS];
    const selectedModelAIndex = Math.floor(Math.random() * availableModels.length);
    const selectedModelA = availableModels[selectedModelAIndex];
    availableModels.splice(selectedModelAIndex, 1);
    const selectedModelB = availableModels[Math.floor(Math.random() * availableModels.length)];

    setModelA(selectedModelA);
    setModelB(selectedModelB);
  };


  useEffect(() => {
    selectTwoRandomModels();
  }, []);

  const handleRunArena = async () => {
    setIsLoading(true);
    setShowModels(false);
    setVote(null);
    setResponseA("Loading...");
    setResponseB("Loading...");

    try {
      const [responseFromA, responseFromB] = await Promise.all([
        getAIResponse(modelA, prompt),
        getAIResponse(modelB, prompt),
      ]);

      setResponseA(responseFromA);
      setResponseB(responseFromB);
    } catch (error: any) {
      console.error("Error running AI Arena:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get responses from AI models.",
        variant: "destructive",
      });
      setResponseA("Error");
      setResponseB("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (value: "A" | "B" | "Tie") => {
    setVote(value);
    setShowModels(true);
  
    let winningModel = null;
  
    if (value === "A") {
      winningModel = modelA;
    } else if (value === "B") {
      winningModel = modelB;
    }
  
    if (winningModel) {
      try {
        await addVote(winningModel);
        toast({
          title: "Vote Submitted",
          description: `You voted for ${value === "A" ? modelA : modelB}. Models will be revealed.`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to submit vote.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Vote Submitted",
        description: "You voted Tie. Models will be revealed.",
      });
    }
  };

  

  const handleReset = () => {
    setPrompt("");
    setResponseA("");
    setResponseB("");
    setVote(null);
    setShowModels(false);
    selectTwoRandomModels();

  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>AI Arena</CardTitle>
          <CardDescription>
            Enter a prompt and see two AI models battle it out!
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your prompt here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
            <Button onClick={handleRunArena} disabled={isLoading || !prompt}>
              {isLoading ? "Running..." : "Run Arena"}
            </Button>
          </div>
          </div>

          {responseA && responseB && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Model A</CardTitle>
                  {showModels && <CardDescription>{modelA}</CardDescription>}
                </CardHeader>
                <CardContent>{responseA}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model B</CardTitle>
                  {showModels && <CardDescription>{modelB}</CardDescription>}
                </CardHeader>
                <CardContent>{responseB}</CardContent>
              </Card>
            </div>
          )}

          {responseA && responseB && (
            <div className="grid gap-2">
              <Label>Vote</Label>
              <RadioGroup onValueChange={handleVote}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="A" id="r1" />
                  <Label htmlFor="r1">A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B" id="r2" />
                  <Label htmlFor="r2">B</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Tie" id="r3" />
                  <Label htmlFor="r3">Tie</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
