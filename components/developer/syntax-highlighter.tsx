"use client"

import { memo } from "react"

interface Token {
  type:
    | "keyword"
    | "string"
    | "number"
    | "function"
    | "property"
    | "operator"
    | "punctuation"
    | "comment"
    | "text"
    | "method"
    | "variable"
    | "boolean"
    | "null"
  value: string
}

const tokenize = (code: string, language: string): Token[] => {
  const tokens: Token[] = []

  // Enhanced keywords for multiple languages
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
    "export",
    "default",
    "class",
    "extends",
    "new",
    "this",
    "if",
    "else",
    "for",
    "while",
    "switch",
    "case",
    "break",
    "continue",
    "try",
    "catch",
    "throw",
    "typeof",
    "instanceof",
    "require",
    "package",
    "func",
    "main",
    "<?php",
    "curl",
    "npm",
    "pip",
    "git",
    "true",
    "false",
    "null",
    "undefined",
  ]

  const operators = ["=", "+", "-", "*", "/", "&&", "||", "!", "===", "!==", "==", "!=", ":=", "=>", "->", "\\"]

  const lines = code.split("\n")

  lines.forEach((lineContent, lineIndex) => {
    const trimmed = lineContent.trim()

    // Check for comments (various styles)
    if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
      tokens.push({ type: "comment", value: lineContent })
      if (lineIndex < lines.length - 1) tokens.push({ type: "text", value: "\n" })
      return
    }

    // Regex-based tokenization for better accuracy
    const regex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+\.?\d*\b|[a-zA-Z_$][a-zA-Z0-9_$]*|\s+|[^\s\w])/g
    const matches = lineContent.match(regex) || []

    matches.forEach((match) => {
      // String literals
      if (/^["']/.test(match)) {
        tokens.push({ type: "string", value: match })
      }
      // Numbers
      else if (/^\d/.test(match)) {
        tokens.push({ type: "number", value: match })
      }
      // Booleans and null
      else if (match === "true" || match === "false") {
        tokens.push({ type: "boolean", value: match })
      } else if (match === "null" || match === "undefined") {
        tokens.push({ type: "null", value: match })
      }
      // Keywords
      else if (keywords.includes(match)) {
        tokens.push({ type: "keyword", value: match })
      }
      // Function/method calls (word followed by parenthesis)
      else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(match)) {
        // Check if next non-whitespace token is '('
        const nextIndex = matches.indexOf(match) + 1
        if (nextIndex < matches.length && matches[nextIndex].trim() === "(") {
          tokens.push({ type: "function", value: match })
        } else {
          // Check if it looks like a property (after a dot)
          const prevIndex = matches.indexOf(match) - 1
          if (prevIndex >= 0 && matches[prevIndex].trim() === ".") {
            tokens.push({ type: "property", value: match })
          } else {
            tokens.push({ type: "variable", value: match })
          }
        }
      }
      // Operators
      else if (operators.some((op) => match.includes(op))) {
        tokens.push({ type: "operator", value: match })
      }
      // Punctuation
      else if (/^[{}()[\],;:.]$/.test(match)) {
        tokens.push({ type: "punctuation", value: match })
      }
      // Whitespace and everything else
      else {
        tokens.push({ type: "text", value: match })
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
    <code className="text-sm font-mono leading-relaxed">
      {tokens.map((token, i) => {
        const className = {
          keyword: "text-[#ff79c6] font-semibold", // Pink for keywords
          string: "text-[#50fa7b]", // Green for strings
          number: "text-[#bd93f9]", // Purple for numbers
          boolean: "text-[#bd93f9]", // Purple for booleans
          null: "text-[#bd93f9]", // Purple for null/undefined
          function: "text-[#8be9fd]", // Cyan for functions
          method: "text-[#8be9fd]", // Cyan for methods
          property: "text-[#f1fa8c]", // Yellow for properties
          variable: "text-[#f8f8f2]", // Off-white for variables
          operator: "text-[#ff79c6]", // Pink for operators
          punctuation: "text-[#6272a4]", // Gray-blue for punctuation
          comment: "text-[#6272a4] italic", // Gray for comments
          text: "text-[#f8f8f2]", // Off-white for text
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
