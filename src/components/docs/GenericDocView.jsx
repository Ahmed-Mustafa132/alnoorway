import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileJson, FileText } from "lucide-react";

export default function GenericDocView({ title, data, icon: Icon }) {
  const handleDownloadJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMarkdown = () => {
    let markdownContent = `# ${title}\n\n`;
    markdownContent += "```json\n";
    markdownContent += JSON.stringify(data, null, 2);
    markdownContent += "\n```";
    
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                  <CardTitle>{title}</CardTitle>
              </div>
              <div className="flex gap-2">
                <button 
                    onClick={handleDownloadJSON}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                >
                    <FileJson className="w-4 h-4" />
                    تحميل JSON
                </button>
                <button 
                    onClick={handleDownloadMarkdown}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                >
                    <FileText className="w-4 h-4" />
                    تحميل Markdown
                </button>
              </div>
          </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[70vh] w-full">
          <pre className="p-6 text-sm font-mono text-gray-800 bg-white" dir="ltr">
            {JSON.stringify(data, null, 2)}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}