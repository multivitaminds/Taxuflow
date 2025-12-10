"use client"

import { memo } from "react"

interface Token {
  type: "keyword" | "string" | "number" | "function" | "property" | "operator" | "punctuation" | "comment" | "text"
  value: string
}

const tokenize = (code: string, language: string): Token[] => {
  const tokens: Token[] = []

  // Simple tokenizer for demonstration
  const keywords = [
    "const",
    "let",
    "var",
    "function",
    "async",
    "await",
    "return",
    "import",
    "from",
    "require",
    "package",
    "func",
    "main",
    "<?php",
  ]
  const operators = ["=", "+", "-", "*", "/", "&&", "||", "!", "===", "!==", ":=", "=>"]

  const lines = code.split("\n")

  lines.forEach((line, lineIndex) => {
    // Check for comments
    if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
      tokens.push({ type: "comment", value: line })
      if (lineIndex < lines.length - 1) tokens.push({ type: "text", value: "\n" })
      return
    }

    // Simple word-by-word tokenization
    const words = line.split(/(\s+|[{}()[\],;:.'"-])/g).filter(Boolean)

    words.forEach((word, i) => {
      if (keywords.includes(word)) {
        tokens.push({ type: "keyword", value: word })
      } else if (/^["'].*["']$/.test(word)) {
        tokens.push({ type: "string", value: word })
      } else if (/^\d+$/.test(word)) {
        tokens.push({ type: "number", value: word })
      } else if (operators.includes(word)) {
        tokens.push({ type: "operator", value: word })
      } else if (/^[a-zA-Z_][a-zA-Z0-9_]*\(/.test(word)) {
        tokens.push({ type: "function", value: word })
      } else if (["{", "}", "(", ")", "[", "]", ",", ";", ":"].includes(word)) {
        tokens.push({ type: "punctuation", value: word })
      } else {
        tokens.push({ type: "text", value: word })
      }
    })

    if (lineIndex < lines.length - 1) {
      tokens.push({ type: "text", value: "\n" })
    }
  })

  return tokens
}

export const SyntaxHighlighter = memo(({ code, language }: { code: string; language: string }) => {
  const tokens = tokenize(code, language)

  return (
    <code className="text-sm font-mono">
      {tokens.map((token, i) => {
        const className = {
          keyword: "text-purple-400",
          string: "text-green-400",
          number: "text-orange-400",
          function: "text-blue-400",
          property: "text-red-400",
          operator: "text-cyan-400",
          punctuation: "text-gray-400",
          comment: "text-gray-500 italic",
          text: "text-gray-300",
        }[token.type]

        return (
          <span key={i} className={className}>
            {token.value}
          </span>
        )
      })}
    </code>
  )
})

SyntaxHighlighter.displayName = "SyntaxHighlighter"
