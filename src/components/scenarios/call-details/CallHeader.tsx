
import type { CallRecord } from "./types";

interface CallHeaderProps {
  call: CallRecord;
  formatDuration: (seconds: number) => string;
}

export const CallHeader = ({ call, formatDuration }: CallHeaderProps) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            {call.scenarios.title}
          </h2>
          <div className="text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <span>{call.scenarios.category}</span>
              <span>•</span>
              <span>{call.scenarios.difficulty}</span>
              <span>•</span>
              <span>{formatDuration(call.duration)}</span>
            </div>
            <div className="text-sm">
              {call.scenarios.description}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">{call.scenarios.persona.name}</div>
          <div className="text-sm text-muted-foreground">{call.scenarios.persona.role}</div>
          <div className="text-sm text-muted-foreground">{call.scenarios.persona.company}</div>
        </div>
      </div>
    </div>
  );
};
