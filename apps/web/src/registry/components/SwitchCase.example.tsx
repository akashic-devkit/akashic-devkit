import { Input } from "@/components/ui/input";
import { useState } from "react";
import SwitchCase from "./SwitchCase";

export default function SwitchCaseExample() {
  const [value, setValue] = useState("");

  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <SwitchCase
        value={value}
        cases={{
          "1": <p>one</p>,
          "2": <p>two</p>,
          "3": <p>three</p>,
          default: <p>not matched</p>,
        }}
      />
    </div>
  );
}
