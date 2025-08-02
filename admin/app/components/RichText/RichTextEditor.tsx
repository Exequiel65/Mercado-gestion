import { Button } from "../ui/button"
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Heading from '@tiptap/extension-heading'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { List, ListOrdered } from "lucide-react";
import { useEffect } from "react";

export default function RichTextEditor({
    value,
    onChange,
    disabled
}: {
    value: string
    onChange: (html: string) => void,
    disabled: boolean
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false, // para no duplicar
            }),
            Underline,
            TextStyle,
            Heading.configure({
                levels: [1, 2, 3],
            }),
        ],
        editable: !disabled,
        content: value,
        onUpdate: ({ editor }) => {
            if (!disabled) onChange(editor.getHTML())
        }
    })

    if (!editor) return null
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, false)
        }
    }, [editor, value])
    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled)
        }
    }, [editor, disabled])
    return (
        <div className="border p-4 rounded space-y-2">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-800 text-white' : ''}>
                    B
                </Button>
                <Button variant="outline" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-800 text-white' : ''}>
                    <em>I</em>
                </Button>
                <Button variant="outline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-gray-800 text-white' : ''}>
                    <u>U</u>
                </Button>
                <Button variant="outline" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-800 text-white' : ''}>
                    <List></List>
                </Button>
                <Button variant="outline" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-800 text-white' : ''}>
                    <ListOrdered></ListOrdered>
                </Button>
                <Select onValueChange={(level) => editor.chain().focus().toggleHeading({ level: parseInt(level) as 1 | 2 | 3 }).run()}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Heading" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">H1</SelectItem>
                        <SelectItem value="2">H2</SelectItem>
                        <SelectItem value="3">H3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Editor con clases personalizadas */}
            <EditorContent
                editor={editor}
                // spellCheck={false}
                placeholder={"<p>Escribí tus términos y condiciones...</p>"}
                frameBorder={"none"}
                className="min-h-[200px] max-h-[600px] overflow-y-auto rounded-md border border-gray-300 bg-white p-4
             focus:outline-none
             prose prose-sm max-w-none
             [&_ul]:list-disc [&_ul]:pl-6 
             [&_ol]:list-decimal [&_ol]:pl-6 
             [&_li]:mb-1 
             [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base"
            />
        </div>
    )
}
