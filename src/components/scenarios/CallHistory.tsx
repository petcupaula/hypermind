
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Filter } from "lucide-react";
import { format, subDays, startOfToday, isAfter, isSameDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type CallRecord = Database["public"]["Tables"]["call_history"]["Row"] & {
  scenarios: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    persona: {
      name: string;
      role: string;
      company: string;
    };
  };
};

type TimeFilter = "all" | "today" | "yesterday" | "week" | "month";

const CallHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scenarioFilter, setScenarioFilter] = React.useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = React.useState<string>("all");
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>("all");

  const { data: calls = [], isLoading } = useQuery({
    queryKey: ['call-history'],
    queryFn: async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error('No active session found');
        return [];
      }

      const { data, error } = await supabase
        .from('call_history')
        .select(`
          *,
          scenarios (
            title,
            description,
            category,
            difficulty,
            persona:personas (
              name,
              role,
              company
            )
          )
        `)
        .eq('user_id', sessionData.session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching call history:', error);
        toast({
          title: "Error",
          description: "Failed to load call history",
          variant: "destructive",
        });
        return [];
      }

      return data as CallRecord[];
    }
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filterCalls = (calls: CallRecord[]) => {
    return calls.filter(call => {
      const matchesScenario = scenarioFilter === "all" || call.scenarios.title === scenarioFilter;
      const matchesDifficulty = difficultyFilter === "all" || call.scenarios.difficulty === difficultyFilter;
      
      let matchesTime = true;
      const callDate = new Date(call.created_at);
      const today = startOfToday();

      if (timeFilter === "today") {
        matchesTime = isSameDay(callDate, today);
      } else if (timeFilter === "yesterday") {
        matchesTime = isSameDay(callDate, subDays(today, 1));
      } else if (timeFilter === "week") {
        matchesTime = isAfter(callDate, subDays(today, 7));
      } else if (timeFilter === "month") {
        matchesTime = isAfter(callDate, subDays(today, 30));
      }

      return matchesScenario && matchesDifficulty && matchesTime;
    });
  };

  const uniqueScenarios = Array.from(new Set(calls.map(call => call.scenarios.title)));
  const filteredCalls = filterCalls(calls);

  if (isLoading) {
    return <div className="text-center py-8">Loading call history...</div>;
  }

  if (calls.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="py-8 text-center text-muted-foreground">
          No calls recorded yet. Start a conversation to begin building your history.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Call History
          <span className="ml-3 text-lg text-muted-foreground">
            ({filteredCalls.length} {filteredCalls.length === 1 ? 'call' : 'calls'})
          </span>
        </h1>
        <div className="flex items-center gap-4">
          <Select value={scenarioFilter} onValueChange={setScenarioFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by scenario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All scenarios</SelectItem>
              {uniqueScenarios.map(scenario => (
                <SelectItem key={scenario} value={scenario}>
                  {scenario}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">Past week</SelectItem>
              <SelectItem value="month">Past month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCalls.map((call) => (
          <Card 
            key={call.id} 
            className="bg-card/50 backdrop-blur hover:bg-card/70 transition-colors cursor-pointer"
            onClick={() => navigate(`/calls/${call.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{call.scenarios.title}</CardTitle>
                  <CardDescription className="mt-1.5 space-y-1">
                    <p>{call.scenarios.description}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-primary">
                        {call.scenarios.persona.name} • {call.scenarios.persona.role} at {call.scenarios.persona.company}
                      </p>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                        call.scenarios.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                        call.scenarios.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {call.scenarios.difficulty}
                      </span>
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
          </Card>
        ))}
      </div>
    </>
  );
};

export default CallHistory;
