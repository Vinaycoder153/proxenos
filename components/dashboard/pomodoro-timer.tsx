"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
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

    const CIRCLE_RADIUS = 54;
    const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
    const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

    const modeColors: Record<TimerMode, string> = {
        work: 'var(--primary)',
        break: 'rgb(34,197,94)',
        longBreak: 'rgb(59,130,246)',
    };
    const modeColor = modeColors[mode];

    return (
        <Card className="glass border-primary/20 overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono uppercase tracking-[0.3em] flex items-center gap-2 text-primary">
                    <Brain className="h-4 w-4" />
                    Focus Timer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* Mode Selector */}
                <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
                    {([
                        { value: 'work', label: 'Work' },
                        { value: 'break', label: 'Break' },
                        { value: 'longBreak', label: 'Long' },
                    ] as { value: TimerMode; label: string }[]).map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => switchMode(value)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-200 ${mode === value
                                ? 'bg-primary text-black font-black'
                                : 'text-muted-foreground hover:text-white'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Circular Timer Display */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <svg
                            className="w-44 h-44 -rotate-90"
                            viewBox="0 0 140 140"
                            aria-hidden="true"
                        >
                            {/* Background track */}
                            <circle
                                cx="70" cy="70" r={CIRCLE_RADIUS}
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="8"
                                fill="none"
                            />
                            {/* Progress arc */}
                            <circle
                                cx="70" cy="70" r={CIRCLE_RADIUS}
                                stroke={modeColor}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                style={{
                                    transition: 'stroke-dashoffset 1s linear',
                                    filter: isRunning ? `drop-shadow(0 0 8px ${modeColor})` : 'none',
                                }}
                            />
                        </svg>
                        {/* Centered time & label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-4xl font-black tabular-nums tracking-tighter text-white">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                                {mode === 'work' ? 'Focus' : mode === 'break' ? 'Short Break' : 'Long Break'}
                            </div>
                            {isRunning && (
                                <div className="mt-1.5 flex items-center gap-1">
                                    <div className="h-1 w-1 rounded-full bg-primary animate-ping" />
                                    <span className="text-[8px] font-mono text-primary uppercase tracking-widest">Live</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3 items-center">
                        <Button
                            onClick={resetTimer}
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={toggleTimer}
                            className="h-12 px-8 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest rounded-xl transition-all hover:glow-active"
                        >
                            {isRunning ? (
                                <><Pause className="h-4 w-4 mr-2" />Pause</>
                            ) : (
                                <><Play className="h-4 w-4 mr-2" />Start</>
                            )}
                        </Button>
                        <Coffee className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                    <div className="flex flex-col items-center gap-0.5 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-2xl font-black text-primary tabular-nums">{completedPomodoros}</div>
                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Sessions</div>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-2xl font-black text-blue-400 tabular-nums">{Math.floor(completedPomodoros / 4)}</div>
                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Long Breaks</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
