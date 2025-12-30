import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

export function DisciplineScore({ score = 0 }: { score?: number }) {
    return (
        <Card className="border-primary/20 bg-card/50 backdrop-blur relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="h-24 w-24 text-primary" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Discipline Score
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-5xl font-bold text-primary mb-4 neon-text">{score}</div>
                <Progress value={score} className="h-2 mb-2 bg-secondary" />
                <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium flex items-center gap-1 inline-flex">
                        <TrendingUp className="h-3 w-3" /> --%
                    </span>{" "}
                    from yesterday. Keep pushing.
                </p>
            </CardContent>
        </Card>
    );
}
