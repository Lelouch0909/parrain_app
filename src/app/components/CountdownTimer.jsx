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
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-lg w-full">
                    <h2 className="text-2xl md:text-4xl font-bold text-emerald-400 mb-6 md:mb-8">
                        Voici la liste de vos filleules
                    </h2>
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-4 md:p-8 rounded-xl shadow-lg border border-gray-700">
                        <p className="text-emerald-200 text-base md:text-xl">
                            La liste sera bientôt disponible...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col items-center text-center max-w-2xl w-full">
                <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-6 text-emerald-400 px-4">
                    Les parrains seront attribués sous peu
                </h1>
                
                <h2 className="text-base md:text-2xl text-emerald-200 mb-6 md:mb-12">
                    Les activités débuteront dans
                </h2>
                
                <div className="flex gap-1 md:gap-4 justify-center items-center flex-wrap px-2">
                    <TimeUnit value={timeRemaining.days} label="jours" />
                    <div className="text-lg md:text-4xl font-bold text-emerald-400">:</div>
                    <TimeUnit value={timeRemaining.hours} label="heures" />
                    <div className="text-lg md:text-4xl font-bold text-emerald-400">:</div>
                    <TimeUnit value={timeRemaining.minutes} label="minutes" />
                    <div className="text-lg md:text-4xl font-bold text-emerald-400">:</div>
                    <TimeUnit value={timeRemaining.seconds} label="secondes" />
                </div>
            </div>
        </div>
    );
}
