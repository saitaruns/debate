import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Mention from "@tiptap/extension-mention";
import TagList from "./TagList";
import PlaceHolder from "@tiptap/extension-placeholder";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { flushSync } from "react-dom";

const fallacies = [
  {
    label: "Ad Hominem",
    id: 1,
  },
  {
    label: "Strawman",
    id: 2,
  },
  {
    label: "False Dilemma",
    id: 3,
  },
  {
    label: "Slippery Slope",
    id: 4,
  },
  {
    label: "Appeal to Authority",
    id: 5,
  },
  {
    label: "Appeal to Ignorance",
    id: 6,
  },
  {
    label: "Circular Reasoning",
    id: 7,
  },
  {
    label: "Hasty Generalization",
    id: 8,
  },
  {
    label: "Post Hoc Ergo Propter Hoc",
    id: 9,
  },
  {
    label: "Red Herring",
    id: 10,
  },
  {
    label: "Appeal to Emotion",
    id: 11,
  },
  {
    label: "Tu Quoque",
    id: 12,
  },
  {
    label: "False Cause",
    id: 13,
  },
  {
    label: "Begging the Question",
    id: 14,
  },
  {
    label: "Appeal to Nature",
    id: 15,
  },
  {
    label: "Composition and Division",
    id: 16,
  },
  {
    label: "No True Scotsman",
    id: 17,
  },
  {
    label: "Genetic Fallacy",
    id: 18,
  },
  {
    label: "Equivocation",
    id: 19,
  },
  {
    label: "Appeal to Tradition",
    id: 20,
  },
  {
    label: "Bandwagon Fallacy",
    id: 21,
  },
];

const TipTap = ({
  onChange = () => {},
  handleSetDetails = () => {},
  limit = 500,
  className,
  value = null,
}) => {
  const mentionsRef = useRef(null);

  const editor = useEditor({
    content: ``,
    extensions: [
      StarterKit,
      Underline,
      PlaceHolder.configure({
        placeholder: "Write your argument here... ('/' to mention fallacies)",
      }),
      CharacterCount.extend({
        onUpdate({ editor }) {
          const json = editor.getJSON();
          const extractFallaciesAndLinks = (content) => {
            let fallacies = [];
            let links = [];

            const traverseNodes = (nodes) => {
              nodes.forEach((node) => {
                if (node.type === "mention") {
                  fallacies.push({ ...node.attrs });
                }
                if (node.type === "link") {
                  links.push({
                    ...node.attrs,
                  });
                }
                if (node.content) {
                  traverseNodes(node.content);
                } else if (node.marks) {
                  traverseNodes(node.marks);
                }
              });
            };

            traverseNodes(content);

            return [fallacies, links];
          };

          const [fallacies, links] = extractFallaciesAndLinks(json.content);
          this.storage.links = () => {
            return links || [];
          };

          this.storage.fallacies = () => {
            return fallacies || [];
          };
        },
      }).configure({
        limit,
      }),
      Link.extend({
        inclusive: false,
      }).configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          class: "fallacy-link",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Mention.configure({
        renderHTML({ options, node }) {
          return ["span", options.HTMLAttributes, node.attrs.label];
        },
        HTMLAttributes: {
          class: "fallacy-tag",
          "data-type": "fallacy",
        },
        suggestion: {
          char: "/",
          allowSpaces: true,
          items: ({ query }) => {
            return fallacies.filter((item) =>
              item.label.toLowerCase().startsWith(query.toLowerCase())
            );
          },
          render: () => {
            let component;
            return {
              onStart: (props) => {
                component = new ReactRenderer(TagList, {
                  props,
                  editor: props.editor,
                });

                const element = component.element;

                mentionsRef.current.appendChild(element);
              },

              onUpdate(props) {
                component.updateProps(props);
              },

              onExit() {
                component.destroy();
              },
            };
          },
        },
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "[&_.is-editor-empty::before]:text-sm [&_.is-editor-empty::before]:text-muted-foreground [&_.is-editor-empty::before]:float-left [&_.is-editor-empty::before]:h-0 [&_.is-editor-empty::before]:content-[attr(data-placeholder)] prose dark:prose-invert break-words whitespace-pre-wrap outline-none w-full ring-0 ring-transparent focus:ring-0 focus:ring-transparent focus:ring-offset-0 ",
      },
    },
    onUpdate({ editor }) {
      const content = editor.getHTML();

      const links = editor.storage.characterCount.links();
      const charCount = editor.storage.characterCount.characters();
      const fallacies = editor.storage.characterCount.fallacies();

      console.log("fallacies", fallacies, "links", links, "count", charCount);

      flushSync(() => {
        handleSetDetails({
          links,
          fallacies,
        });

        onChange({
          content,
          count: charCount,
        });
      });
    },
    onCreate({ editor }) {
      if (value !== null) editor.commands.setContent(value);
    },
  });

  const setLink = useCallback(
    (url) => {
      // const previousUrl = editor.getAttributes("link").href;

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
    },
    [editor]
  );

  if (!editor || !fallacies.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={cn(className, "relative")}>
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="icon"
              className={cn("rounded-full", {
                "bg-secondary": editor.isActive("link"),
              })}
            >
              <Link2 size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="center" side="bottom" className="space-y-1">
            <p className="text-xs sm:text-sm">Add a link to your argument.</p>
            <Input
              type="text"
              placeholder="https://example.com"
              onChange={(e) => setLink(e.target.value)}
            />
          </PopoverContent>
        </Popover>
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
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn("rounded-full", {
            "bg-secondary": editor.isActive("codeBlock"),
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
      <div
        id="mention-suggestion"
        className={cn("w-full bg-secondary rounded-sm", {})}
        ref={mentionsRef}
      ></div>
    </div>
  );
};

export default TipTap;
