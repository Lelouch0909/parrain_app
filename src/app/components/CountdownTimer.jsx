"use client";
import React, { useState, useEffect } from 'react';
import { calculateTimeRemaining } from '../utils/dateUtils';
import { TimeUnit } from './TimeUnit';

export function CountdownTimer() {
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        // Get next Friday at 15:00
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + (5 + 7 - targetDate.getDay()) % 7);
        targetDate.setHours(15, 0, 0, 0);

        const timer = setInterval(() => {
            const remaining = calculateTimeRemaining(targetDate);
            setTimeRemaining(remaining);

            // Check if countdown is complete
            if (remaining.days === 0 &&
                remaining.hours === 0 &&
                remaining.minutes === 0 &&
                remaining.seconds === 0) {
                setIsCompleted(true);
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (isCompleted) {
        return (
            <div className="text-center">
                <h2 className="text-4xl font-bold text-emerald-400 mb-8">
                    Voici la liste de vos filleules
                </h2>
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700">
                    {/* La liste des filleules sera ajoutée ici */}
                    <p className="text-emerald-200 text-xl">
                        La liste sera bientôt disponible...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-5xl font-bold mb-8 text-emerald-400">Les activités débuterons dans</h1>
            <h2 className="text-2xl text-emerald-200 mb-12">Le parrains seront attribués sous peu</h2>
            <div className="flex gap-8 justify-center items-center">
                <TimeUnit value={timeRemaining.days} label="jours" />
                <div className="text-4xl font-bold text-emerald-400">:</div>
                <TimeUnit value={timeRemaining.hours} label="heures" />
                <div className="text-4xl font-bold text-emerald-400">:</div>
                <TimeUnit value={timeRemaining.minutes} label="minutes" />
                <div className="text-4xl font-bold text-emerald-400">:</div>
                <TimeUnit value={timeRemaining.seconds} label="secondes" />
            </div>
        </>
    );
}