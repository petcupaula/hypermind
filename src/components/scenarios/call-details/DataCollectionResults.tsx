
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, XCircle, HelpCircle, Info } from "lucide-react";
import dataCollectionConfig from "@/config/dataCollectionConfig";
import type { DataCollectionResults as DataCollectionResultsType } from "./types";

interface DataCollectionResultsProps {
  results: unknown;
}

export const DataCollectionResults = ({ results }: DataCollectionResultsProps) => {
  const typedResults = results as DataCollectionResultsType;
  if (!typedResults?.metrics || typeof typedResults.metrics !== 'object') return null;

  const getDataCollectionResultStatus = (key: string, value: boolean | number | null) => {
    const config = dataCollectionConfig[key];
    if (!config) {
      return { isGood: false, description: "Unknown metric" };
    }
    return config.evaluate(value);
  };

  return Object.entries(typedResults.metrics).map(([key, result]) => {
    const status = getDataCollectionResultStatus(key, result.value);
    
    return (
      <div key={key} className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {result.value === null ? (
              <HelpCircle className="h-5 w-5 text-gray-400" />
            ) : (
              status.isGood ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                {result.json_schema?.description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        {result.json_schema.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className={`text-sm px-2 py-0.5 rounded-full ${
                result.value === null 
                  ? "bg-gray-100 text-gray-700"
                  : status.isGood
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
              }`}>
                {result.value === null ? 'Not collected' : 
                 typeof result.value === 'boolean' ? (result.value ? 'Yes' : 'No') : 
                 typeof result.value === 'number' ? result.value.toFixed(2) : 
                 result.value}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {status.description}
            </div>
            <div className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border/50">
              {result.rationale}
            </div>
          </div>
        </div>
      </div>
    ));
  });
};
