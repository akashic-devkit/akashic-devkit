import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { componentsMenu } from "@/data/ComponentsMenu";
import { hooksMenu } from "@/data/hooksMenu";
import { Link, useLocation, useMatches } from "@tanstack/react-router";
import { Fragment } from "react";

export default function AppBreadcrumb() {
  const { pathname } = useLocation();
  const pathList = pathname.split("/").filter((item) => !!item.length);
  const matches = useMatches();
  const isNotFound = matches.length === 1 && matches[0]?.routeId === "__root__";

  if (isNotFound) return;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={"/"}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathList.map((path, idx) => {
          const isFirstCategory = idx === 0;
          const pathText = isFirstCategory
            ? path.charAt(0).toUpperCase() + path.slice(1).toLowerCase()
            : path;
          const link = ["", ...pathList.slice(0, idx + 1)].join("/");

          if (isFirstCategory) {
            return (
              <Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={link}>{pathText}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            );
          }

          const dropdownPathList = pathList[0] === "component" ? componentsMenu : hooksMenu;

          return (
            <Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger>{pathText}</DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {dropdownPathList.map((dropdownPath) => {
                      return (
                        <DropdownMenuItem key={`${path}-${dropdownPath.title}`}>
                          <Link to={dropdownPath.url}>{dropdownPath.title}</Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
