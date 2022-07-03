import React, { useEffect, useMemo, useRef, useState } from 'react';
import { throttle } from './helpers/throttle';
import './styles/virtualList.css';

const buffer = 3;

export default function VirtualList({
  renderItem = () => {},
  itemCount = 0,
  width,
  height,
  onScrollToBottom = () => {},
  itemHeight,
}) {
  const scrollRef = useRef(null);
  const [start, setStart] = useState(0);
  const visibleCount = Math.ceil(height / itemHeight);
  const end = start + visibleCount;
  const listHeight = itemCount * itemHeight;
  const length = Math.min(itemCount, end);

  const items = useMemo(() => {
    const itemsList = [];
    for (let i = start; i < length; i++) {
      itemsList.push(
        renderItem({
          index: i,
          style: {
            position: 'absolute',
            top: `${i * itemHeight}px`,
            width: '100%',
            border: '1px solid red',
          },
        }),
      );
    }
    return itemsList;
  }, [start, length]);

  useEffect(() => {
    if (!scrollRef.current) return;
    function scrollListener() {
      const scrollTop = scrollRef.current.scrollTop;
      const nextStart = Math.floor(scrollTop / itemHeight);
      setStart(nextStart);
    }
    const throttledScrollListener = throttle(scrollListener);
    scrollRef.current.addEventListener('scroll', throttledScrollListener);
    return () => {
      scrollRef.current.removeEventListener('scroll', throttledScrollListener);
    };
  }, []);

  useEffect(() => {
    const nextEnd = start + visibleCount + buffer;
    if (nextEnd >= itemCount) onScrollToBottom();
  }, [start]);

  return (
    <div
      ref={scrollRef}
      className="container"
      style={{
        height,
        width: width || '100%',
      }}
    >
      <div
        className="realList"
        style={{
          height: listHeight,
        }}
      >
        {items}
      </div>
    </div>
  );
}
