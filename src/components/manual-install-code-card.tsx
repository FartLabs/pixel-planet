import { useState, type ReactNode } from "react"
import { Card, CardContent } from "./ui/card"
import { CodeIcon } from "lucide-react"
import { Button } from "./ui/button"
import { TypeScriptIcon } from "./icons/typescript-icon"
import { CSSIcon } from "./icons/css-icon"
import { cn } from "@/lib/utils"

export function ManualInstallCodeCard({
  filePath,
  children,
}: {
  filePath: string
  children: ReactNode
}) {
  const Icon = getIcon(filePath)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="not-content group overflow-hidden border-fart-highlight/30 bg-code p-0 shadow-sm transition-colors hover:border-fart-highlight/50">
      <CardContent className="p-0">
        <div className="flex items-center border-b border-fart-highlight/30 bg-muted/20 px-3 py-1.5">
          <div className="mr-3 flex size-5 items-center justify-center rounded-sm bg-primary/10">
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Icon className="size-3.5 text-primary" />
          </div>
          <div className="font-mono text-[11px] font-semibold tracking-tight text-muted-foreground/70 uppercase">
            {filePath}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-6 px-2 text-[10px] font-bold tracking-widest text-muted-foreground/50 uppercase hover:bg-primary/20 hover:text-primary"
            onClick={() => setIsExpanded(e => !e)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
        <div
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            !isExpanded && "max-h-40",
          )}
        >
          <div className="text-[13px] leading-relaxed">{children}</div>
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-code via-code/90 to-transparent text-[10px] font-bold tracking-widest text-muted-foreground/40 uppercase transition-colors hover:text-primary"
            >
              Click to Expand
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getIcon(filePath: string) {
  if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
    return TypeScriptIcon
  }
  if (filePath.endsWith(".css")) {
    return CSSIcon
  }
  return CodeIcon
}
