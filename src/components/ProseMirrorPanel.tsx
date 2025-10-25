import { useState } from "react";
import { Button } from "./ui/button";

interface ProseMirrorPanelProps {
  proseMirrorJson: string;
  onJsonChange: (json: string) => void;
}

export function ProseMirrorPanel({
  proseMirrorJson,
  onJsonChange,
}: ProseMirrorPanelProps) {
  const [inputValue, setInputValue] = useState(proseMirrorJson);
  const [error, setError] = useState<string>("");

  const loadSampleProseMirror = () => {
    const sampleProseMirror = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [
            {
              type: "text",
              text: "Welcome to ProseMirror",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "This is a sample ProseMirror document with ",
            },
            {
              type: "text",
              marks: [{ type: "bold" }],
              text: "bold text",
            },
            {
              type: "text",
              text: " and ",
            },
            {
              type: "text",
              marks: [{ type: "italic" }],
              text: "italic text",
            },
            {
              type: "text",
              text: ".",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [
            {
              type: "text",
              text: "Features",
            },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Rich text formatting",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Lists and headings",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Code blocks",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: { language: "javascript" },
          content: [
            {
              type: "text",
              text: "function hello() {\n  console.log('Hello, ProseMirror!');\n}",
            },
          ],
        },
      ],
    };

    const formatted = JSON.stringify(sampleProseMirror, null, 2);
    setInputValue(formatted);
    onJsonChange(formatted);
    setError("");
  };

  const formatJSON = () => {
    try {
      if (!inputValue.trim()) {
        setError("");
        onJsonChange("");
        return;
      }

      const parsed = JSON.parse(inputValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setInputValue(formatted);
      onJsonChange(formatted);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const validateJSON = () => {
    try {
      if (!inputValue.trim()) {
        setError("");
        return;
      }

      JSON.parse(inputValue);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const clearJson = () => {
    setInputValue("");
    onJsonChange("");
    setError("");
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onJsonChange(value);
    setError("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          ProseMirror JSON
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Paste your ProseMirror JSON here and format it
        </p>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={formatJSON} size="sm">
            Format JSON
          </Button>
          <Button onClick={validateJSON} variant="outline" size="sm">
            Validate
          </Button>
          <Button onClick={loadSampleProseMirror} variant="outline" size="sm">
            Load Sample
          </Button>
          <Button onClick={clearJson} variant="outline" size="sm">
            Clear
          </Button>
        </div>
        {error && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Textarea */}
      <div className="flex-1 p-4">
        <textarea
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Paste your ProseMirror JSON here..."
          className="w-full h-full resize-none border border-input rounded-md p-3 font-mono text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>
    </div>
  );
}
