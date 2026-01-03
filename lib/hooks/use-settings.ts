"use client";

import { useState, useEffect } from 'react';

export interface SystemSettings {
    noise: boolean;
    scanlines: boolean;
    glow: boolean;
    audio: boolean;
}

const DEFAULT_SETTINGS: SystemSettings = {
    noise: true,
    scanlines: false,
    glow: true,
    audio: true,
};

export function useSettings() {
    const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        // 1. Load from localStorage
        const saved = localStorage.getItem('nexus_settings');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }

        // 2. Listen for updates from other instances
        const handleSync = (e: any) => {
            if (e.detail) setSettings(e.detail);
        };

        window.addEventListener('nexus-settings-updated', handleSync);
        return () => window.removeEventListener('nexus-settings-updated', handleSync);
    }, []);

    const updateSettings = (newSettings: Partial<SystemSettings>) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('nexus_settings', JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent('nexus-settings-updated', { detail: updated }));
            return updated;
        });
    };

    return { settings, updateSettings };
}
