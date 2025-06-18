import React from 'react';

interface LoaderProps {
  /** Size of the spinner in `px`. Default: `48` */
  size?: number;
  /** Optional descriptive text shown under the spinner */
  label?: string;
  /** Render full-screen centered loader */
  fullScreen?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * A modern circular loader using only TailwindCSS utility classes.
 */
const Loader: React.FC<LoaderProps> = ({
  size = 48,
  label,
  fullScreen = false,
  className = '',
}) => {
  const spinner = (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-block ${className}`}
    >
      <div
        className="absolute inset-0 rounded-full border-4 border-yale-blue opacity-25"
        style={{ borderTopColor: 'transparent' }}
      />
      <div
        className="absolute inset-0 rounded-full border-4 border-yale-blue border-t-transparent animate-spin"
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        {spinner}
        {label && <p className="mt-4 text-gray-600">{label}</p>}
      </div>
    );
  }

  return (
    <>
      {spinner}
      {label && <span className="ml-2 text-sm text-gray-600">{label}</span>}
    </>
  );
};

export default Loader; 