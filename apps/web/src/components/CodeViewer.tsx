import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, CardContent } from "./ui/card";
import { rawCodesMap } from "@/data/rawCodesMap";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

interface BaseProps {
  label?: string;
  language?: string;
}

interface FileProps extends BaseProps {
  type: "file";
  fileName: string;
  code?: never; // code 속성을 명시적으로 금지
}

interface CodeProps extends BaseProps {
  type: "code";
  code: string;
  fileName?: never; // filePath 속성을 명시적으로 금지
}

type Props = FileProps | CodeProps;

export default function CodeViewer({ type, code, fileName, language = "typescript" }: Props) {
  const [codeStr, setCodeStr] = useState(code ?? "");
  const [loadErr, setLoadErr] = useState<null | string>(null);

  const loadFromFile = async (fileName: string) => {
    try {
      const module = await rawCodesMap[fileName as keyof typeof rawCodesMap]();
      setCodeStr(module.default);
      setLoadErr(null);
    } catch {
      setCodeStr("");
      setLoadErr("파일을 표시할 수 없습니다.");
    }
  };

  useEffect(() => {
    if (type !== "file") return;
    loadFromFile(fileName);
  }, [fileName, type]);

  return (
    <Card className="p-0 relative">
      {!loadErr && (
        <Button size="icon" className="absolute right-2 top-2" variant="outline">
          <Copy />
        </Button>
      )}
      <CardContent className="p-2">
        {loadErr ? (
          <div className="text-destructive">Error: {loadErr}</div>
        ) : (
          <SyntaxHighlighter
            language={language}
            style={vs}
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
              padding: 0,
              border: "none",
            }}
          >
            {codeStr}
          </SyntaxHighlighter>
        )}
      </CardContent>
    </Card>
  );
}
