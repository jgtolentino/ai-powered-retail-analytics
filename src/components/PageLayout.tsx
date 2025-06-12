import React, { PropsWithChildren } from 'react';

/**
 * PageLayout ensures consistent padding, max-width,
 * and background across all analytics pages.
 */
interface PageLayoutProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageLayout({ 
  children, 
  title, 
  description, 
  actions 
}: PropsWithChildren<PageLayoutProps>) {
  return (
    <div className="space-y-6">
      {/* Consistent Page Header */}
      {(title || description || actions) && (
        <div className="mb-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            {(title || description) && (
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-2 text-sm text-gray-700">
                    {description}
                  </p>
                )}
              </div>
            )}
            {actions && (
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}