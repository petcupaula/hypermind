
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import type { CallRecord } from "./types";

interface CallHeaderProps {
  call: CallRecord;
  formatDuration: (seconds: number) => string;
}

export const CallHeader = ({ call, formatDuration }: CallHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-2xl">{call.scenarios.title}</CardTitle>
          <CardDescription>
            <div className="mt-2 space-y-2">
              <div className="text-base">{call.scenarios.description}</div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-primary">
                  {call.scenarios.persona.name} • {call.scenarios.persona.role} at {call.scenarios.persona.company}
                </div>
                <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                  call.scenarios.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                  call.scenarios.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {call.scenarios.difficulty}
                </span>
              </div>
            </div>
          </CardDescription>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {format(new Date(call.created_at), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatDuration(call.duration)}
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
