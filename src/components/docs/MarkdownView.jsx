import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Check } from "lucide-react";
import entitiesSchema from "./entitiesSchema";
import relations from "./relations";
import apiEndpoints from "./apiEndpoints";

export default function MarkdownView() {
    const [copied, setCopied] = React.useState(false);

    const generateMarkdown = () => {
        let md = "# System Documentation\n\n";
        
        md += "## Entities\n\n";
        Object.entries(entitiesSchema).forEach(([name, schema]) => {
            md += `### ${name}\n`;
            md += `**Description:** ${schema.description || 'N/A'}\n\n`;
            md += "| Field | Type | Description |\n|---|---|---|\n";
            if (schema.properties) {
                Object.entries(schema.properties).forEach(([prop, details]) => {
                    md += `| ${prop} | ${details.type} | ${details.description || '-'} |\n`;
                });
            }
            md += "\n";
        });

        md += "## Relations\n\n";
        Object.entries(relations).forEach(([entity, rels]) => {
            md += `### ${entity}\n`;
            Object.entries(rels.related_to).forEach(([target, details]) => {
                md += `- Relates to **${target}** via \`${details.foreign_key}\` (${details.type})\n`;
            });
            md += "\n";
        });

        md += "## API Endpoints\n\n";
        
        // REST API
        if (apiEndpoints.rest_api && apiEndpoints.rest_api.endpoints) {
            md += "### REST API\n\n";
            apiEndpoints.rest_api.endpoints.forEach(ep => {
                md += `#### ${ep.path}\n`;
                md += `${ep.description}\n\n`;
            });
        }

        // Backend Functions
        if (apiEndpoints.backend_functions && apiEndpoints.backend_functions.endpoints) {
            md += "### Backend Functions\n\n";
            apiEndpoints.backend_functions.endpoints.forEach(ep => {
                md += `#### ${ep.name} (${ep.method})\n`;
                md += `**URL:** ${ep.url}\n`;
                md += `${ep.description}\n\n`;
            });
        }

        return md;
    };

    const markdownContent = generateMarkdown();

    const handleCopy = () => {
        navigator.clipboard.writeText(markdownContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="border-0 shadow-lg" dir="ltr">
            <CardHeader className="bg-gray-50/50 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-lg">System Documentation (Markdown)</CardTitle>
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy Markdown"}
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <pre className="p-6 bg-slate-900 text-slate-50 overflow-auto h-[70vh] text-sm font-mono rounded-b-xl">
                    {markdownContent}
                </pre>
            </CardContent>
        </Card>
    );
}