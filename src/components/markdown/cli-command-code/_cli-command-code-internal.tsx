import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { CheckIcon, ClipboardIcon, TerminalIcon, XIcon } from "lucide-react"
import { useState } from "react"

export function CliCommandCodeInternal({
  commands,
}: {
  commands: {
    label: string
    code: string
  }[]
}) {
  const [selectedTab, setSelectedTab] = useLocalStorage("cli-method", "npm")
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  )

  function handleCopy() {
    const command = commands.find(cmd => cmd.label === selectedTab)
    if (command) {
      navigator.clipboard
        .writeText(command.code)
        .then(() => setCopyState("copied"))
        .catch(() => setCopyState("error"))
        .finally(() => setTimeout(() => setCopyState("idle"), 2000))
    }
  }

  return (
    <Card className="not-content group overflow-hidden border-fart-highlight/30 bg-code p-0 shadow-sm transition-colors hover:border-fart-highlight/50">
      <CardContent className="p-0">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="gap-0"
        >
          <div className="flex items-center border-b border-fart-highlight/30 bg-muted/20 px-3 py-1.5">
            <div className="mr-3 flex size-5 items-center justify-center rounded-sm bg-primary/10">
              <TerminalIcon className="size-3.5 text-primary" />
            </div>
            <TabsList className="h-7 gap-1 bg-transparent p-0 font-mono">
              {commands.map((command, index) => (
                <TabsTrigger
                  key={index}
                  value={command.label}
                  className="h-6 rounded-sm px-2 text-xs font-semibold tracking-wider uppercase data-[state=active]:border-fart-highlight/50 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  {command.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Tooltip open={copyState !== "idle"}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  className="ml-auto size-7 text-muted-foreground/50 hover:bg-primary/20 hover:text-primary"
                >
                  {copyState === "idle" ? (
                    <ClipboardIcon className="size-3.5" />
                  ) : copyState === "copied" ? (
                    <CheckIcon className="size-3.5" />
                  ) : (
                    <XIcon className="size-3.5 text-destructive" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {copyState === "error" ? "Error!" : "Copied"}
              </TooltipContent>
            </Tooltip>
          </div>
          <div>
            {commands.map(command => (
              <TabsContent
                key={command.label}
                value={command.label}
                className="no-scrollbar overflow-x-auto py-2.5 text-[13px] leading-relaxed text-muted-foreground"
              >
                <pre>
                  <code className="px-4 font-mono font-medium">
                    {command.code}
                  </code>
                </pre>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
