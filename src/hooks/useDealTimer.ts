'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

interface UseDealTimerOptions {
  endDate: string;
  onExpire?: () => void;
  updateInterval?: number;
}

export const useDealTimer = ({
  endDate,
  onExpire,
  updateInterval = 1000,
}: UseDealTimerOptions) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const calculateTimeRemaining = useCallback(() => {
    const now = new Date().getTime();
    
    // Debug logging
    console.log('useDealTimer Debug:', {
      endDate,
      endDateType: typeof endDate,
      endDateValue: endDate
    });
    
    // Validate endDate and handle invalid dates
    let end: number;
    try {
      const endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        // Invalid date, set to 24 hours from now
        console.warn('Invalid endDate in useDealTimer:', endDate);
        end = now + (24 * 60 * 60 * 1000);
      } else {
        end = endDateObj.getTime();
      }
    } catch (error) {
      // Invalid date string, set to 24 hours from now
      console.warn('Error parsing endDate in useDealTimer:', endDate, error);
      end = now + (24 * 60 * 60 * 1000);
    }
    
    const difference = end - now;

    if (difference <= 0) {
      setIsExpired(true);
      setIsActive(false);
      onExpire?.();
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      total: difference,
    };
  }, [endDate]); // Remove onExpire from dependencies to prevent infinite loops

  useEffect(() => {
    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Set up interval
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [endDate, updateInterval]); // Use endDate directly instead of calculateTimeRemaining

  const formatTime = useCallback((value: number): string => {
    // Handle NaN and invalid values
    if (isNaN(value) || !isFinite(value)) {
      return '00';
    }
    return Math.max(0, Math.floor(value)).toString().padStart(2, '0');
  }, []);

  const getFormattedTime = useCallback(() => {
    return {
      days: formatTime(timeRemaining.days),
      hours: formatTime(timeRemaining.hours),
      minutes: formatTime(timeRemaining.minutes),
      seconds: formatTime(timeRemaining.seconds),
    };
  }, [timeRemaining, formatTime]);

  const getTimeString = useCallback((format: 'short' | 'long' = 'short') => {
    const { days, hours, minutes, seconds } = timeRemaining;
    
    if (format === 'short') {
      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    } else {
      if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
      } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
      }
    }
  }, [timeRemaining]);

  const getProgressPercentage = useCallback((startDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    
    const total = end - start;
    const elapsed = now - start;
    
    if (total <= 0) return 100;
    
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  }, [endDate]);

  const isUrgent = useCallback(() => {
    const { days, hours, minutes } = timeRemaining;
    return days === 0 && hours < 2; // Less than 2 hours remaining
  }, [timeRemaining]);

  const isEndingSoon = useCallback(() => {
    const { days, hours } = timeRemaining;
    return days === 0 && hours < 24; // Less than 24 hours remaining
  }, [timeRemaining]);

  return {
    timeRemaining,
    isExpired,
    isActive,
    getFormattedTime,
    getTimeString,
    getProgressPercentage,
    isUrgent,
    isEndingSoon,
  };
};
