import React, { useEffect, useRef, useState } from 'react';

function AutoSizer({ children }) {
  const ref = useRef(null);
  const [size, setSize] = useState({});
  useEffect(() => {
    if (!ref.current || !ref.current.parentNode) return;
    const resizeObserver = new ResizeObserver(entries => {
      requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        if (!ref && !ref.current) return;
        const target = entries[0].target;
        const { offsetWidth, offsetHeight } = target;
        setSize({
          width: offsetWidth,
          height: offsetHeight,
        });
      });
    });
    resizeObserver.observe(ref.current.parentNode);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ overflow: 'visible', width: 0, height: 0 }}>
      {children(size)}
    </div>
  );
}

export default AutoSizer;
