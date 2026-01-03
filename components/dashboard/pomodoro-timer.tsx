"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

type TimerMode = 'work' | 'break' | 'longBreak';

const TIMER_DURATIONS = {
    work: 25 * 60, // 25 minutes
    break: 5 * 60, // 5 minutes
    longBreak: 15 * 60, // 15 minutes
};

export function PomodoroTimer() {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.work);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const handleStart = () => setIsRunning(true);
        const handlePause = () => setIsRunning(false);

        window.addEventListener('nexus-start-timer', handleStart);
        window.addEventListener('nexus-pause-timer', handlePause);

        return () => {
            window.removeEventListener('nexus-start-timer', handleStart);
            window.removeEventListener('nexus-pause-timer', handlePause);
        };
    }, []);

    const handleTimerComplete = () => {
        setIsRunning(false);

        if (mode === 'work') {
            const newCount = completedPomodoros + 1;
            setCompletedPomodoros(newCount);

            // After 4 pomodoros, take a long break
            const nextMode = newCount % 4 === 0 ? 'longBreak' : 'break';
            setMode(nextMode);
            setTimeLeft(TIMER_DURATIONS[nextMode]);

            toast({
                title: "🎉 Pomodoro Complete!",
                description: `Great work! Time for a ${nextMode === 'longBreak' ? 'long' : 'short'} break.`,
                variant: "success",
            });

            // Play notification sound (optional)
            if (typeof Audio !== 'undefined') {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(() => { });
            }
        } else {
            setMode('work');
            setTimeLeft(TIMER_DURATIONS.work);

            toast({
                title: "Break Over!",
                description: "Ready to start another focused session?",
            });
        }
    };

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, mode]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setMode('work');
        setTimeLeft(TIMER_DURATIONS.work);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const switchMode = (newMode: TimerMode) => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(TIMER_DURATIONS[newMode]);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode]) * 100;

    return (
        <Card className="glass border-primary/20">
            <CardHeader>
                <CardTitle className="text-lg font-mono uppercase tracking-wider flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Focus Timer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Mode Selector */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => switchMode('work')}
                        variant={mode === 'work' ? 'default' : 'outline'}
                        size="sm"
                        className={mode === 'work' ? 'bg-primary text-black' : ''}
                    >
                        Work
                    </Button>
                    <Button
                        onClick={() => switchMode('break')}
                        variant={mode === 'break' ? 'default' : 'outline'}
                        size="sm"
                        className={mode === 'break' ? 'bg-primary text-black' : ''}
                    >
                        Break
                    </Button>
                    <Button
                        onClick={() => switchMode('longBreak')}
                        variant={mode === 'longBreak' ? 'default' : 'outline'}
                        size="sm"
                        className={mode === 'longBreak' ? 'bg-primary text-black' : ''}
                    >
                        Long Break
                    </Button>
                </div>

                {/* Timer Display */}
                <div className="text-center space-y-4">
                    <div className="relative">
                        <div className="text-7xl font-bold neon-text tabular-nums">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono uppercase mt-2">
                            {mode === 'work' ? 'Focus Session' : mode === 'break' ? 'Short Break' : 'Long Break'}
                        </div>
                    </div>

                    <Progress value={progress} className="h-2" />
                </div>

                {/* Controls */}
                <div className="flex gap-2 justify-center">
                    <Button
                        onClick={toggleTimer}
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-black px-8"
                    >
                        {isRunning ? (
                            <>
                                <Pause className="h-5 w-5 mr-2" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="h-5 w-5 mr-2" />
                                Start
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={resetTimer}
                        size="lg"
                        variant="outline"
                    >
                        <RotateCcw className="h-5 w-5" />
                    </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{completedPomodoros}</div>
                        <div className="text-xs text-muted-foreground font-mono">Completed</div>
                    </div>
                    <Coffee className="h-8 w-8 text-muted-foreground/50" />
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{Math.floor(completedPomodoros / 4)}</div>
                        <div className="text-xs text-muted-foreground font-mono">Long Breaks</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
