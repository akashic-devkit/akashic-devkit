import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { hooksMenu } from "@/data/hooksMenu";
import { componentsMenu } from "@/data/ComponentsMenu";

const collapsibleMenus = [
  { label: "Components", items: componentsMenu },
  { label: "Hooks", items: hooksMenu },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="font-semibold">
          Akashic Devkit Template
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarLinkItem title="Home" url="/" />
          </SidebarMenu>
        </SidebarGroup>
        {collapsibleMenus.map(({ label, items }) => (
          <Collapsible key={label} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <CollapsibleGroupLabel text={label} />
              <CollapsibleContent className="animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarLinkItem key={item.title} title={item.title} url={item.url} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

function CollapsibleGroupLabel({ text }: { text: string }) {
  return (
    <SidebarGroupLabel asChild>
      <CollapsibleTrigger>
        {text}
        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
      </CollapsibleTrigger>
    </SidebarGroupLabel>
  );
}

function SidebarLinkItem({ title, url }: { title: string; url: string }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={url}>
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
