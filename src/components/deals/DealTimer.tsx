'use client';

import React from 'react';
import { useDealTimer } from '../../hooks/useDealTimer';
import { DealTimerProps } from '../../types/deal';
import { Clock, AlertTriangle } from 'lucide-react';

const DealTimer: React.FC<DealTimerProps> = ({
  endDate,
  className = '',
  showLabels = true,
  compact = false,
}) => {
  const {
    timeRemaining,
    isExpired,
    isActive,
    getFormattedTime,
    getTimeString,
    isUrgent,
    isEndingSoon,
  } = useDealTimer({
    endDate,
    onExpire: () => {
      // Deal expired - could trigger notifications or updates
    },
  });

  if (!isActive || isExpired) {
    return (
      <div className={`flex items-center gap-2 text-red-500 ${className}`}>
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">Deal Expired</span>
      </div>
    );
  }

  const formattedTime = getFormattedTime();
  const urgent = isUrgent();
  const endingSoon = isEndingSoon();

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Clock className={`w-3 h-3 ${urgent ? 'text-red-500' : 'text-gray-500'}`} />
        <span className={`text-xs font-medium ${urgent ? 'text-red-500' : 'text-gray-600'}`}>
          {getTimeString('short')}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className={`w-4 h-4 ${urgent ? 'text-red-500' : 'text-primary'}`} />
        <span className={`text-sm font-medium ${urgent ? 'text-red-500' : 'text-gray-700'}`}>
          {urgent ? 'Ending Soon!' : endingSoon ? 'Ending Today' : 'Time Remaining'}
        </span>
      </div>

      {/* Timer Display */}
      <div className={`grid grid-cols-4 gap-2 ${urgent ? 'animate-pulse' : ''}`}>
        {/* Days */}
        {timeRemaining.days > 0 && (
          <div className={`text-center p-2 rounded-lg border ${
            urgent 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
            <div className={`text-lg font-bold ${urgent ? 'text-red-600' : 'text-gray-800'}`}>
              {formattedTime.days}
            </div>
            {showLabels && (
              <div className="text-xs text-gray-500 mt-1">Days</div>
            )}
          </div>
        )}

        {/* Hours */}
        <div className={`text-center p-2 rounded-lg border ${
          urgent 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          <div className={`text-lg font-bold ${urgent ? 'text-red-600' : 'text-gray-800'}`}>
            {formattedTime.hours}
          </div>
          {showLabels && (
            <div className="text-xs text-gray-500 mt-1">Hours</div>
          )}
        </div>

        {/* Minutes */}
        <div className={`text-center p-2 rounded-lg border ${
          urgent 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          <div className={`text-lg font-bold ${urgent ? 'text-red-600' : 'text-gray-800'}`}>
            {formattedTime.minutes}
          </div>
          {showLabels && (
            <div className="text-xs text-gray-500 mt-1">Minutes</div>
          )}
        </div>

        {/* Seconds */}
        <div className={`text-center p-2 rounded-lg border ${
          urgent 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          <div className={`text-lg font-bold ${urgent ? 'text-red-600' : 'text-gray-800'}`}>
            {formattedTime.seconds}
          </div>
          {showLabels && (
            <div className="text-xs text-gray-500 mt-1">Seconds</div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all duration-1000 ${
            urgent ? 'bg-red-500' : 'bg-primary'
          }`}
          style={{ 
            width: `${Math.max(0, Math.min(100, (timeRemaining.total / (24 * 60 * 60 * 1000)) * 100))}%` 
          }}
        />
      </div>

      {/* Status Text */}
      {urgent && (
        <div className="text-center">
          <span className="text-xs text-red-600 font-medium animate-pulse">
            ⚡ Hurry! Limited time offer
          </span>
        </div>
      )}
    </div>
  );
};

export default DealTimer;
