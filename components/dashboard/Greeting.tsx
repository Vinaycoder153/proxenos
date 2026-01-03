"use client";

import { useState } from "react";

export function Greeting() {
    const [greeting] = useState(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    });

    return (
        <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                {greeting}, <span className="text-primary glow-text">Commander</span>.
            </h1>
            <p className="text-muted-foreground">
                Your AI productivity systems are online. Discipline is at <span className="text-primary">87%</span>.
            </p>
        </div>
    );
}
