import React from 'react';

const SkeletonLoader = () => {
  return (
    <div role="status" className="animate-pulse p-4 space-y-4 max-w-3xl">
      {/* Block 1 */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-10/12"></div>
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-11/12"></div>
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded p-4 space-y-2">
          <div className="h-2.5 bg-gray-300 rounded-md dark:bg-gray-600 w-3/4"></div>
          <div className="h-2.5 bg-gray-300 rounded-md dark:bg-gray-600 w-1/2"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-md dark:bg-gray-600 w-2/3"></div>
        <div className="h-2.5 bg-gray-300 rounded-md dark:bg-gray-600 w-1/2"></div>
      </div>

      {/* Block 2 (Repeated Pattern) */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-10/12"></div>
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-11/12"></div>
      </div>
      
      {/* Block 3 (Repeated Pattern) */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-10/12"></div>
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-11/12"></div>
      </div>

      {/* Block 4 (Repeated Pattern) */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-full"></div>
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-10/12"></div>
        <div className="h-3 bg-gray-200 rounded-md dark:bg-gray-700 w-11/12"></div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonLoader;