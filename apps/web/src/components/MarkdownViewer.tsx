import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { useEffect, useState } from "react";
import { docsMap } from "@/data/docsMap";

interface Props {
  name: string;
}

export default function MarkdownViewer({ name }: Props) {
  const [markdown, setMarkdown] = useState("");

  const loadFromFile = async () => {
    try {
      const key = name as keyof typeof docsMap;
      const module = await docsMap[key]();
      setMarkdown(module.default);
    } catch {
      //   setCodeStr("");
      //   setLoadErr("파일을 표시할 수 없습니다.");
    }
  };

  useEffect(() => {
    loadFromFile();
  }, []);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]} // GitHub Flavored Markdown 지원
      rehypePlugins={[rehypeHighlight]} // 코드 하이라이팅
      components={components}
    >
      {markdown}
    </ReactMarkdown>
  );
}

// 커스텀 컴포넌트들
const components: Components = {
  // 코드 블록 커스터마이징
  pre: ({ children, ...props }) => (
    <pre
      {...props}
      style={{
        backgroundColor: "#f6f8fa",
        border: "1px solid #d1d9e0",
        borderRadius: "6px",
        padding: "16px",
        overflow: "auto",
        fontSize: "14px",
        lineHeight: "1.45",
        fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
        margin: "16px 0",
      }}
    >
      {children}
    </pre>
  ),

  // 헤딩 커스터마이징
  h1: ({ children, ...props }) => (
    <h1
      {...props}
      style={{
        fontSize: "2em",
        fontWeight: "600",
        margin: "24px 0 16px 0",
        color: "#24292f",
        borderBottom: "1px solid #d1d9e0",
        paddingBottom: "12px",
      }}
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2
      {...props}
      style={{
        fontSize: "1.5em",
        fontWeight: "600",
        margin: "20px 0 12px 0",
        color: "#24292f",
        borderBottom: "1px solid #d1d9e0",
        paddingBottom: "8px",
      }}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3
      {...props}
      style={{
        fontSize: "1.25em",
        fontWeight: "600",
        margin: "16px 0 8px 0",
        color: "#24292f",
      }}
    >
      {children}
    </h3>
  ),

  // 링크 커스터마이징
  a: ({ children, href, ...props }) => (
    <a
      {...props}
      href={href}
      style={{
        color: "#0969da",
        textDecoration: "none",
      }}
      className="hover:!underline"
    >
      {children}
    </a>
  ),

  // 인용문 커스터마이징
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      style={{
        borderLeft: "4px solid #d1d9e0",
        padding: "0 16px",
        margin: "16px 0",
        color: "#656d76",
        fontStyle: "italic",
      }}
    >
      {children}
    </blockquote>
  ),

  // 테이블 커스터마이징
  table: ({ children, ...props }) => (
    <div style={{ overflow: "auto", margin: "16px 0" }}>
      <table
        {...props}
        style={{
          borderCollapse: "collapse",
          width: "100%",
          border: "1px solid #d1d9e0",
          borderRadius: "6px",
        }}
      >
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...props }) => (
    <th
      {...props}
      style={{
        padding: "12px",
        textAlign: "left",
        backgroundColor: "#f6f8fa",
        border: "1px solid #d1d9e0",
        fontWeight: "600",
      }}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td
      {...props}
      style={{
        padding: "12px",
        border: "1px solid #d1d9e0",
      }}
    >
      {children}
    </td>
  ),

  // 리스트 커스터마이징
  ul: ({ children, ...props }) => (
    <ul
      {...props}
      style={{
        paddingLeft: "24px",
        margin: "16px 0",
      }}
    >
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol
      {...props}
      style={{
        paddingLeft: "24px",
        margin: "16px 0",
      }}
    >
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li
      {...props}
      style={{
        margin: "4px 0",
        lineHeight: "1.6",
      }}
    >
      {children}
    </li>
  ),
};
