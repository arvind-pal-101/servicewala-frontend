import React from 'react';

// Card Skeleton
export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="flex items-start space-x-4">
      <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
    <div className="mt-4 flex space-x-2">
      <div className="h-10 bg-gray-300 rounded flex-1"></div>
      <div className="h-10 bg-gray-300 rounded flex-1"></div>
    </div>
  </div>
);

// List Skeleton
export const ListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array(count).fill(0).map((_, index) => (
      <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

// Stats Skeleton
export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {Array(4).fill(0).map((_, index) => (
      <div key={index} className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl p-6 animate-pulse">
        <div className="h-12 bg-gray-400 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

// Profile Skeleton
export const ProfileSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
    <div className="md:flex">
      <div className="md:w-1/3 bg-gray-300 h-96"></div>
      <div className="md:w-2/3 p-8 space-y-6">
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-300 rounded"></div>
          <div className="h-24 bg-gray-300 rounded"></div>
        </div>
        <div className="flex space-x-4">
          <div className="h-12 bg-gray-300 rounded flex-1"></div>
          <div className="h-12 bg-gray-300 rounded flex-1"></div>
        </div>
      </div>
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead className="bg-gray-200">
        <tr>
          {Array(5).fill(0).map((_, i) => (
            <th key={i} className="px-6 py-3">
              <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array(rows).fill(0).map((_, rowIndex) => (
          <tr key={rowIndex} className="border-b">
            {Array(5).fill(0).map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);