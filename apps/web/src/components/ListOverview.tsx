import { componentsMenu } from "@/data/ComponentsMenu";
import { hooksMenu } from "@/data/hooksMenu";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  collapsible?: boolean;
  type: "Component" | "Hook";
  className?: string;
}

export default function ListOverview({ collapsible, type, className }: Props) {
  const itemList = type === "Component" ? componentsMenu : hooksMenu;

  if (collapsible) {
    return (
      <Collapsible defaultOpen>
        <Card className={className}>
          <CollapsibleTrigger asChild className="cursor-pointer">
            <CardHeader className="flex items-center justify-between">
              <p className="font-semibold text-lg">
                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + "s"}
              </p>
              <ChevronDown />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent className="animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {itemList.map((item) => {
                  return (
                    <Link key={`${type}-${item.title}`} to={item?.url}>
                      <Card className="px-2 py-4">
                        <CardContent className="font-semibold text-center">{item.title}</CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  return (
    <Card className={className}>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {itemList.map((item) => {
            return (
              <Link key={`${type}-${item.title}`} to={item?.url}>
                <Card className="px-2 py-4">
                  <CardContent className="font-semibold text-center">{item.title}</CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
