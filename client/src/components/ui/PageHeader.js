import React from 'react';

const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          }
        </div>
        {action && <div className="mt-4 sm:mt-0">{action}</div>}
        }
      </div>
    </div>
  );
};

export default PageHeader;