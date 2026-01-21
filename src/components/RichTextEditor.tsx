import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface RichTextEditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange, placeholder = "Escreva seu conteúdo aqui..." }, ref) => {
    const quillRef = useRef<ReactQuill>(null);

    useImperativeHandle(ref, () => ({
      getContent: () => value,
      setContent: (content: string) => onChange(content)
    }));

    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
      }
    };

    const formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike',
      'color', 'background',
      'script',
      'list', 'bullet', 'indent',
      'direction', 'align',
      'link', 'image', 'video',
      'blockquote', 'code-block'
    ];

    return (
      <div className="rich-text-editor">
        <style>{`
          .ql-toolbar {
            border: 1px solid hsl(var(--border));
            border-bottom: none;
            border-radius: 8px 8px 0 0;
            background: hsl(var(--background));
          }
          
          .ql-container {
            border: 1px solid hsl(var(--border));
            border-radius: 0 0 8px 8px;
            background: hsl(var(--background));
            color: hsl(var(--foreground));
            font-family: inherit;
          }
          
          .ql-editor {
            min-height: 200px;
            font-size: 14px;
            line-height: 1.6;
            color: hsl(var(--foreground));
          }
          
          .ql-editor::before {
            color: hsl(var(--muted-foreground));
            font-style: italic;
          }
          
          .ql-snow .ql-stroke {
            stroke: hsl(var(--foreground));
          }
          
          .ql-snow .ql-fill {
            fill: hsl(var(--foreground));
          }
          
          .ql-snow .ql-tooltip {
            background: hsl(var(--popover));
            border: 1px solid hsl(var(--border));
            color: hsl(var(--popover-foreground));
            border-radius: 6px;
          }
          
          .ql-snow .ql-tooltip input {
            background: hsl(var(--input));
            border: 1px solid hsl(var(--border));
            color: hsl(var(--foreground));
            border-radius: 4px;
          }
          
          .ql-snow .ql-picker-options {
            background: hsl(var(--popover));
            border: 1px solid hsl(var(--border));
            border-radius: 6px;
          }
          
          .ql-snow .ql-picker-item:hover {
            background: hsl(var(--accent));
          }
          
          .ql-snow.ql-toolbar button:hover {
            background: hsl(var(--accent));
          }
          
          .ql-snow.ql-toolbar button.ql-active {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
          }
          
          .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6 {
            color: hsl(var(--foreground));
            font-weight: 600;
            margin: 1em 0 0.5em 0;
          }
          
          .ql-editor blockquote {
            border-left: 4px solid hsl(var(--primary));
            padding-left: 16px;
            margin: 16px 0;
            background: hsl(var(--muted));
            border-radius: 0 6px 6px 0;
          }
          
          .ql-editor pre {
            background: hsl(var(--muted));
            border: 1px solid hsl(var(--border));
            border-radius: 6px;
            padding: 12px;
            overflow-x: auto;
          }
          
          .ql-editor a {
            color: hsl(var(--primary));
            text-decoration: underline;
          }
          
          .ql-editor a:hover {
            color: hsl(var(--primary));
            opacity: 0.8;
          }
        `}</style>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;