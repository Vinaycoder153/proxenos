"use client";

import { useEffect, useState } from "react";

export function Greeting() {
    const [greeting, setGreeting] = useState("Welcome");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

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
