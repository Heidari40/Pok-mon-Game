'use client'

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface TimerHandles {
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    getFormattedTime: () => string;
    time: number;
}

const Timer = forwardRef<TimerHandles>((props, ref) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | number | null>(null);

   const startTimer = () => {
    if(!isRunning){
       setIsRunning(true);
       intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
       }, 1000);
      }
   };

    const stopTimer = () => {
        setIsRunning(false);
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetTimer = () => {
        stopTimer();
        setTime(0)
    };

    const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)// Math.floor afrunder et tal til nærmeste hele tal 4.6 => 5
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // padStart tilføjes 0
                                                          // For at formatere tiden pænt og ensartet, fx:

                                                         // 5 minutter og 3 sekunder → "05:03"

                                                         // 12 minutter og 45 sekunder → "12:45"
   };
   useImperativeHandle(ref, () => ({
   startTimer,
   stopTimer,
   resetTimer,
   getFormattedTime: () => formatTime(time),
   time: time
   }))

   useEffect (() =>{
    return () => {
        stopTimer();
    }
   }, []);


   return (

     <div>
        <h2>{formatTime(time)}</h2>
     </div>
   );
    
});
 Timer.displayName = 'Timer';

export default Timer;

