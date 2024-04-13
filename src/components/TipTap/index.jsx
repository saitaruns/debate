import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Underline from "@tiptap/extension-underline";
import {
  Code2,
  Heading,
  Link2,
  List,
  ListOrdered,
  MessageSquareQuote,
} from "lucide-react";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";

const TipTap = ({ onChange = () => {}, limit = 500, className, value }) => {
  const editor = useEditor({
    content: ``,
    extensions: [
      StarterKit,
      Underline,
      CharacterCount.configure({
        limit,
      }),
      Link.configure({
        openOnClick: true,
        validate: (href) => /^https?:\/\//.test(href),
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-dark break-words whitespace-pre-wrap outline-none w-full ring-0 ring-transparent focus:ring-0 focus:ring-transparent focus:ring-offset-0",
      },
    },
    onUpdate({ editor }) {
      const content = editor.getHTML();
      const charCount = editor.storage.characterCount.characters();
      onChange({
        content,
        count: charCount,
      });
    },
    onCreate({ editor }) {
      editor.commands.setContent(value);
    },
  });

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <div className=" flex gap-1 flex-wrap border-b pb-1">
        <Button
          type="button"
          variant="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("bold"),
          })}
        >
          B
        </Button>
        <Button
          type="button"
          variant="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("italic"),
          })}
        >
          I
        </Button>
        <Button
          type="button"
          variant="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("underline"),
          })}
        >
          U
        </Button>
        <Button
          type="button"
          variant="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("strike"),
          })}
        >
          S
        </Button>
        <Button
          type="button"
          variant="icon"
          onClick={setLink}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("link"),
          })}
        >
          <Link2 size={16} />
        </Button>
        <Button
          type="button"
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
          type="button"
          variant="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("code"),
          })}
        >
          <Code2 size={16} />
        </Button>
        <Button
          type="button"
          variant="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("bulletList"),
          })}
        >
          <List size={16} />
        </Button>
        <Button
          type="button"
          variant="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("orderedList"),
          })}
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          type="button"
          variant="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("blockquote"),
          })}
        >
          <MessageSquareQuote size={16} />
        </Button>
      </div>

      <div className="pt-4 px-4 pb-3 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTap;
