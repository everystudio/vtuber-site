import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";
import Image from '@tiptap/extension-image'
import React, { useEffect } from "react";

export default function RichTextEditor({ value, onChange }) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image
        ],
        content: value,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    // 🔽 追加: 親から渡された value が変わったら editor に反映する
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div>
            {/* Toolbar */}
            <div className="mb-2 flex flex-wrap gap-2 border-b pb-2">
                <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="B" />
                <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="I" />
                <ToolbarButton active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} label="H1" />
                <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2" />
                <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="• List" />
                <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="1. List" />
                <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="❝ Quote" />
                <ToolbarButton active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} label="</> Code" />
                <ToolbarButton
                    active={false}
                    onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = async () => {
                            const file = input.files?.[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append("image", file);

                            try {
                                const res = await fetch(`${baseUrl}/api/upload-image.php`, {
                                    method: "POST",
                                    body: formData
                                });
                                const json = await res.json();
                                const url = json.url; // サーバーから返された画像URL

                                editor.chain().focus().setImage({ src: url }).run();

                                // ← ここでログを出す
                                console.error("挿入後HTML:", editor.getHTML());
                            } catch (err) {
                                console.error("画像アップロード失敗:", err);
                            }
                        };
                        input.click();
                    }}
                    label="🖼️ Image"
                />
            </div>

            {/* Editor */}
            <div className="border p-2 rounded min-h-[200px]">
                <EditorContent
                    editor={editor}
                    className="prose p-2 min-h-[180px] outline-none"
                />
            </div>
        </div>
    );
}

function ToolbarButton({ active, onClick, label }) {
    return (
        <button
            className={clsx(
                "px-2 py-1 border rounded text-sm",
                active ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            )}
            onClick={onClick}
            type="button"
        >
            {label}
        </button>
    );
}
