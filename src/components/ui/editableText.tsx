import React, { useRef } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (newVal: string) => void;
  className?: string;
}

/**
 * Inline editable text without disrupting layout.
 * Renders a span that becomes editable (contentEditable) on focus/click.
 * On blur or Enter key, calls onChange.
 */
const EditableText: React.FC<EditableTextProps> = ({ value, onChange, className }) => {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const handleBlur = () => {
    if (spanRef.current) {
      const newText = spanRef.current.textContent || '';
      if (newText !== value) onChange(newText);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <span
      ref={spanRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className + ' focus:outline-none focus:ring-1 focus:ring-accent rounded'}
    >
      {value}
    </span>
  );
};

export default EditableText; 