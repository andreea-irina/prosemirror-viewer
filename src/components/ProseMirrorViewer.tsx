import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Heading } from "@tiptap/extension-heading";
import { Link } from "@tiptap/extension-link";
import { CodeBlock } from "@tiptap/extension-code-block";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { useEffect, useState } from "react";

interface ProseMirrorViewerProps {
  proseMirrorJson: string;
}

export function ProseMirrorViewer({ proseMirrorJson }: ProseMirrorViewerProps) {
  const [error, setError] = useState<string>("");
  const [warnings, setWarnings] = useState<string[]>([]);

  // Capture console warnings and errors
  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;
    const capturedWarnings: string[] = [];

    console.warn = (...args) => {
      const parsedArgs = args.map((arg) => {
        if (typeof arg === "object" && arg !== null) {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      });
      const message = parsedArgs.join(" ");
      // Only capture Tiptap-related warnings
      if (
        message.toLowerCase().includes("tiptap") ||
        message.toLowerCase().includes("prosemirror") ||
        message.toLowerCase().includes("editor") ||
        message.toLowerCase().includes("node") ||
        message.toLowerCase().includes("mark")
      ) {
        capturedWarnings.push(`Warning: ${message}`);
        setWarnings([...capturedWarnings]);
      }
      originalWarn(...args);
    };

    console.error = (...args) => {
      const message = args.join(" ");
      // Only capture Tiptap-related errors
      if (
        message.toLowerCase().includes("tiptap") ||
        message.toLowerCase().includes("prosemirror") ||
        message.toLowerCase().includes("editor") ||
        message.toLowerCase().includes("node") ||
        message.toLowerCase().includes("mark")
      ) {
        capturedWarnings.push(`Error: ${message}`);
        setWarnings([...capturedWarnings]);
      }
      originalError(...args);
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const clearWarnings = () => {
    setWarnings([]);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-muted p-2 rounded font-mono text-sm",
        },
      }),
      HorizontalRule,
    ],
    content: "<p>Paste ProseMirror JSON on the left to view it here...</p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[400px] p-4 text-foreground",
      },
    },
    editable: false,
    onUpdate: ({ editor }) => {
      // Capture any editor update warnings
      try {
        const json = editor.getJSON();
        if (!json || !json.type) {
          setWarnings((prev) => [
            ...prev,
            `Editor Warning: Invalid document structure detected`,
          ]);
        }
      } catch (err) {
        setWarnings((prev) => [
          ...prev,
          `Editor Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        ]);
      }
    },
    onContentError: ({ error }) => {
      // Capture editor errors
      setWarnings((prev) => [
        ...prev,
        `Editor Error: ${error.message || error}`,
      ]);
    },
  });

  // Check if the parsed data is a valid ProseMirror document
  const isValidProseMirrorDocument = (data: unknown): boolean => {
    if (!data || typeof data !== "object") {
      return false;
    }

    const obj = data as Record<string, unknown>;

    // Must have a type property
    if (!("type" in obj) || typeof obj.type !== "string") {
      return false;
    }

    // Check if it's a valid ProseMirror document type
    const validTypes = [
      "doc",
      "paragraph",
      "heading",
      "text",
      "bulletList",
      "orderedList",
      "listItem",
      "blockquote",
      "codeBlock",
      "hardBreak",
      "horizontalRule",
    ];

    if (!validTypes.includes(obj.type)) {
      return false;
    }

    // If it has content, it should be an array
    if ("content" in obj && !Array.isArray(obj.content)) {
      return false;
    }

    // If it has attrs, it should be an object
    if (
      "attrs" in obj &&
      (typeof obj.attrs !== "object" || obj.attrs === null)
    ) {
      return false;
    }

    // If it has marks, it should be an array
    if ("marks" in obj && !Array.isArray(obj.marks)) {
      return false;
    }

    return true;
  };

  // Update editor content when ProseMirror JSON changes
  useEffect(() => {
    if (proseMirrorJson && editor) {
      try {
        const parsedData = JSON.parse(proseMirrorJson);

        // Validate ProseMirror document structure
        if (isValidProseMirrorDocument(parsedData)) {
          setError("");
          setWarnings([]); // Clear previous warnings
          editor.commands.setContent(parsedData);
        } else {
          console.log("Invalid ProseMirror document structure", parsedData);
          const errorMessage =
            "Invalid ProseMirror document structure. The JSON must have a valid 'type' property and proper document structure.";
          setError(errorMessage);
          editor.commands.setContent(`
            <div class="p-4 border border-destructive/20 rounded-md bg-destructive/10">
              <h2 class="text-destructive font-semibold mb-2">Invalid ProseMirror Document</h2>
              <p class="text-destructive text-sm mb-3">${errorMessage}</p>
              <div class="mt-3 p-3 bg-destructive/5 border border-destructive/10 rounded text-xs">
                <strong>Expected structure:</strong>
                <ul class="mt-2 ml-4 list-disc">
                  <li>Must have a 'type' property with valid ProseMirror node types</li>
                  <li>Valid types: doc, paragraph, heading, text, bulletList, orderedList, listItem, blockquote, codeBlock, hardBreak, horizontalRule</li>
                  <li>'content' must be an array if present</li>
                  <li>'attrs' must be an object if present</li>
                  <li>'marks' must be an array if present</li>
                </ul>
              </div>
            </div>
          `);
        }
      } catch (jsonError) {
        const errorMessage =
          jsonError instanceof Error
            ? jsonError.message
            : "Invalid JSON format";
        setError(errorMessage);
        editor.commands.setContent(`
          <div class="p-4 border border-destructive/20 rounded-md bg-destructive/10">
            <h2 class="text-destructive font-semibold mb-2">Invalid JSON</h2>
            <p class="text-destructive text-sm mb-3">The provided JSON is not valid. Please check the format.</p>
            <div class="mt-3 p-3 bg-destructive/5 border border-destructive/10 rounded text-xs">
              <strong>Error details:</strong> ${errorMessage}
            </div>
          </div>
        `);
      }
    } else if (!proseMirrorJson && editor) {
      setError("");
      setWarnings([]);
      editor.commands.setContent(
        "<p>Paste ProseMirror JSON on the left to view it here...</p>"
      );
    }
  }, [proseMirrorJson, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          ProseMirror Viewer
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {error
            ? "Error in ProseMirror document"
            : "View your ProseMirror document here"}
        </p>
        {error && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive text-xs">
            {error}
          </div>
        )}
        {warnings.length > 0 && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
            <div className="flex justify-between items-center mb-1">
              <div className="font-semibold">Tiptap Warnings/Errors:</div>
              <button
                onClick={clearWarnings}
                className="text-yellow-600 hover:text-yellow-800 text-xs underline"
              >
                Clear
              </button>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-xs">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
