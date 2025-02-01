import { buttonVariants } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { LucideIcon } from 'lucide-react'
import React from 'react'
import { useLocalStorage } from "usehooks-ts"

type Props = {
    isCollapsed: boolean,
    links: {
        title: string,
        label?: string,
        icon: LucideIcon,
        variant: "default" | "ghost"
    }[]
}

const Nav = ({ isCollapsed, links }: Props) => {
  const [ tab, setTab ] = useLocalStorage("vortextTab", "inbox");
    
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            {links.map((link, index) => 
                isCollapsed ? (
                  <Tooltip key={index} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span
                        onClick={() => setTab(link.title.toLowerCase())}
                        className={cn(
                          buttonVariants({ variant: link.variant, size: "icon" }),
                          "h-9 w-9 cursor-pointer",
                          link.variant === "default" &&
                          "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                        )}
                      >
                        <link.icon className="w-4 h-4" />
                        <span className="sr-only">{link.title}</span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-4">
                      {link.title}
                      {link.label && (
                        <span className="ml-auto text-muted-foreground">
                          {link.label}
                        </span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                    <span key={index}
                        onClick={() => {
                          setTab(link.title.toLowerCase())
                        }}
                        className={cn(
                            buttonVariants({ variant: link.variant, size: "sm" }),
                            link.variant === "default" &&
                            "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                            "justify-start cursor-pointer"
                        )}
                    >
                        <link.icon className="w-4 h-4 mr-2" /> {/* Lucide React Icon */}
                        { link.title }
                        {link.label && (
                            <span
                            className={cn(
                                "ml-auto",
                                link.variant === "default" &&
                                "text-background dark:text-white"
                            )}
                            >
                            {link.label}
                            </span>
                        )}
                    </span>
                )
            )}
        </nav>
    </div>
  )
}

export default Nav