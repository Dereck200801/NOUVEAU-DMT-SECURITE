import { useEffect } from 'react';

type KeyHandler = () => void;

function useKeyPress(targetKey: string, handler: KeyHandler): void {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [targetKey, handler]);
}

export default useKeyPress; 