"use client"

import React from "react"

import { useRef, useCallback } from "react"
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading1, Heading2, Heading3, Quote, Minus, Link2 } from "lucide-react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

interface ToolbarButton {
  icon: React.ElementType
  label: string
  prefix: string
  suffix: string
  block?: boolean
}

const toolbarButtons: ToolbarButton[] = [
  { icon: Bold, label: "굵게", prefix: "**", suffix: "**" },
  { icon: Italic, label: "기울임", prefix: "_", suffix: "_" },
  { icon: Strikethrough, label: "취소선", prefix: "~~", suffix: "~~" },
  { icon: Heading1, label: "제목1", prefix: "# ", suffix: "", block: true },
  { icon: Heading2, label: "제목2", prefix: "## ", suffix: "", block: true },
  { icon: Heading3, label: "제목3", prefix: "### ", suffix: "", block: true },
  { icon: List, label: "목록", prefix: "- ", suffix: "", block: true },
  { icon: ListOrdered, label: "번호 목록", prefix: "1. ", suffix: "", block: true },
  { icon: Quote, label: "인용", prefix: "> ", suffix: "", block: true },
  { icon: Minus, label: "구분선", prefix: "\n---\n", suffix: "", block: true },
  { icon: Link2, label: "링크", prefix: "[", suffix: "](url)" },
]

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const applyFormat = useCallback(
    (btn: ToolbarButton) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)

      let newText: string
      let cursorPos: number

      if (btn.block && !selectedText) {
        // Block-level: insert at start of line or new line
        const beforeCursor = value.substring(0, start)
        const isStartOfLine = start === 0 || beforeCursor.endsWith("\n")
        const prefix = isStartOfLine ? btn.prefix : `\n${btn.prefix}`
        newText = value.substring(0, start) + prefix + value.substring(end)
        cursorPos = start + prefix.length
      } else if (selectedText) {
        // Wrap selected text
        newText =
          value.substring(0, start) +
          btn.prefix +
          selectedText +
          btn.suffix +
          value.substring(end)
        cursorPos = start + btn.prefix.length + selectedText.length + btn.suffix.length
      } else {
        // Insert placeholder
        const placeholder = btn.label
        newText =
          value.substring(0, start) +
          btn.prefix +
          placeholder +
          btn.suffix +
          value.substring(end)
        // Select the placeholder text
        cursorPos = start + btn.prefix.length + placeholder.length
      }

      onChange(newText)

      // Restore focus & cursor position
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(cursorPos, cursorPos)
      })
    },
    [value, onChange]
  )

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/50 px-2 py-1.5">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() => applyFormat(btn)}
            title={btn.label}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <btn.icon className="h-4 w-4" />
            <span className="sr-only">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="마크다운으로 일정을 작성하세요..."
        className="min-h-[400px] w-full resize-y bg-background p-5 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
