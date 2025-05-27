'use client';

import { useState, useEffect } from 'react';

type Option = {
  id: string;
  name: string;
};

type CheckboxFilterProps = {
  options: Option[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
};

export default function CheckboxFilter({ options, selectedValues, onChange }: CheckboxFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMore, setShowMore] = useState(false);
  const initialDisplayCount = 6;

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show search bar if there are more than initialDisplayCount options
  const showSearch = options.length > initialDisplayCount;

  const handleToggle = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((value) => value !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div className="space-y-2">
      {showSearch && (
        <div className="relative mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full py-1.5 pl-7 pr-2 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
          />
          <svg
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}

      {filteredOptions.length > 0 ? (
        <div className={`space-y-1.5 ${showMore ? '' : 'max-h-[200px] overflow-y-auto'}`}>
          {(showMore ? filteredOptions : filteredOptions.slice(0, initialDisplayCount)).map(
            (option) => (
              <label key={option.id} className="flex items-start cursor-pointer group">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedValues.includes(option.id)}
                    onChange={() => handleToggle(option.id)}
                  />
                  <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center group-hover:border-blue-500 dark:group-hover:border-blue-400">
                    {selectedValues.includes(option.id) && (
                      <svg className="w-3 h-3 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                  {option.name}
                </span>
              </label>
            )
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">No options found</p>
      )}

      {filteredOptions.length > initialDisplayCount && !searchTerm && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-xs font-medium text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 mt-1"
        >
          {showMore ? 'Show Less' : `+${filteredOptions.length - initialDisplayCount} more`}
        </button>
      )}
    </div>
  );
} 