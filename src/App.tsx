import { useState } from "react";
import { ProseMirrorPanel } from "./components/ProseMirrorPanel";
import { ProseMirrorViewer } from "./components/ProseMirrorViewer";

export default function App() {
  const [proseMirrorJson, setProseMirrorJson] = useState<string>("");

  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel - ProseMirror JSON */}
      <div className="w-1/2 border-r border-border">
        <ProseMirrorPanel
          proseMirrorJson={proseMirrorJson}
          onJsonChange={setProseMirrorJson}
        />
      </div>

      {/* Right Panel - ProseMirror Viewer */}
      <div className="w-1/2">
        <ProseMirrorViewer proseMirrorJson={proseMirrorJson} />
      </div>
    </div>
  );
}
