"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useCallback, useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4 hover:text-white transition-colors cursor-pointer',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-a:text-primary max-w-none min-h-[300px] w-full bg-moss-muted/30 border border-moss-border rounded-lg p-6 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-100 transition-all shadow-inner',
      },
    },
    onUpdate: ({ editor }) => {
      // Debounce the state update to prevent UI stuttering on every keystroke
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange(editor.getHTML());
      }, 500);
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-[#1a211a] border border-moss-border rounded-t-lg backdrop-blur-md sticky top-0 z-10">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${editor.isActive('bold') ? 'bg-primary text-[#121a12] shadow-[0_0_10px_rgba(238,173,43,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded-md text-sm font-serif italic transition-all ${editor.isActive('italic') ? 'bg-primary text-[#121a12] shadow-[0_0_10px_rgba(238,173,43,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          Italic
        </button>
        <div className="w-px h-4 bg-moss-border mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-[#121a12] shadow-[0_0_10px_rgba(238,173,43,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-[#121a12] shadow-[0_0_10px_rgba(238,173,43,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          H3
        </button>
        <div className="w-px h-4 bg-moss-border mx-1"></div>
        <button
          type="button"
          onClick={setLink}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${editor.isActive('link') ? 'bg-primary text-[#121a12] shadow-[0_0_10px_rgba(238,173,43,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined text-[16px]">link</span> Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">link_off</span> Unlink
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        {editor.isEmpty && (
          <div className="absolute top-6 left-6 text-slate-500 pointer-events-none user-select-none">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} className="min-h-[300px] cursor-text" />
      </div>
    </div>
  );
}
