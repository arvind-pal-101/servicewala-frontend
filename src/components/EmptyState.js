import React from 'react';
import { useNavigate } from 'react-router-dom';

function EmptyState({ 
  icon = '📭', 
  title = 'No Data Found', 
  message = 'There is nothing here yet', 
  actionText, 
  actionLink 
}) {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <div className="text-8xl mb-4 animate-bounce">
          {icon}
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          {message}
        </p>
      </div>

      {actionText && actionLink && (
        <button
          onClick={() => navigate(actionLink)}
          className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;