import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Underline from "@tiptap/extension-underline";
import {
  Code2,
  Heading,
  List,
  ListOrdered,
  MessageSquareQuote,
} from "lucide-react";

const TipTap = () => {
  const editor = useEditor({
    content: ``,
    extensions: [StarterKit, Underline],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-dark outline-none w-full h-full ring-0 ring-transparent focus:ring-0 focus:ring-transparent focus:ring-offset-0",
      },
    },
    onUpdate({ editor }) {
      console.log(editor.getJSON());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className=" flex gap-1 flex-wrap">
        <Button
          variant="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("bold"),
          })}
        >
          B
        </Button>
        <Button
          variant="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("italic"),
          })}
        >
          I
        </Button>
        <Button
          variant="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("underline"),
          })}
        >
          U
        </Button>
        <Button
          variant="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("strike"),
          })}
        >
          S
        </Button>
        <Button
          variant="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("heading", { level: 3 }),
          })}
        >
          <Heading size={16} />
        </Button>
        <Button
          variant="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("code"),
          })}
        >
          <Code2 size={16} />
        </Button>
        <Button
          variant="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("bulletList"),
          })}
        >
          <List size={16} />
        </Button>
        <Button
          variant="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("orderedList"),
          })}
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          variant="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("blockquote"),
          })}
        >
          <MessageSquareQuote size={16} />
        </Button>
      </div>

      <div className="p-4 max-h-[300px] overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default TipTap;
