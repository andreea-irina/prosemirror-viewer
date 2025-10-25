# ProseMirror Viewer

A React application for visualizing and testing ProseMirror JSON documents. This tool allows you to paste ProseMirror JSON and see how it renders in a rich text editor, making it perfect for debugging, testing, and understanding ProseMirror document structures.

## Features

- **JSON Input Panel**: Paste and format ProseMirror JSON with validation
- **Live Preview**: See how your ProseMirror JSON renders in real-time
- **Error Handling**: Clear error messages for invalid JSON or document structures
- **Sample Data**: Load example ProseMirror documents to get started
- **Formatting Tools**: Format, validate, and clear JSON input
- **Warning Capture**: Automatically captures and displays Tiptap/ProseMirror warnings and errors

## Supported ProseMirror Node Types

The viewer supports standard ProseMirror node types including:

- Document (`doc`)
- Paragraphs (`paragraph`)
- Headings (`heading` with levels 1-3)
- Text with marks (bold, italic, links)
- Lists (bullet and ordered lists)
- Code blocks
- Blockquotes
- Horizontal rules
- Hard breaks

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd prosemirror-viewer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Input JSON**: Paste your ProseMirror JSON in the left panel
2. **Format & Validate**: Use the "Format JSON" and "Validate" buttons to ensure proper formatting
3. **Load Sample**: Click "Load Sample" to see an example ProseMirror document
4. **View Results**: The right panel will display your document as rendered content
5. **Debug Issues**: Any errors or warnings will be displayed in the viewer panel

## Example ProseMirror JSON

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "My Document" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "This is a " },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "bold" },
        { "type": "text", "text": " example." }
      ]
    }
  ]
}
```

## Built With

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tiptap** - Rich text editor (ProseMirror wrapper)
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/
│   ├── ProseMirrorPanel.tsx    # JSON input panel
│   ├── ProseMirrorViewer.tsx   # Document viewer
│   └── ui/                     # Reusable UI components
├── App.tsx                     # Main application
└── main.tsx                    # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
