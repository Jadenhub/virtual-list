import React, { useEffect, useState } from 'react';
import AutoSizer from '../AutoSizer';
import VirtualList from '../VirtualList';
import { faker } from '@faker-js/faker';

function createRandomUser() {
  return {
    userId: faker.datatype.uuid(),
    username: faker.internet.userName(),
  };
}

async function fetchData() {
  return new Promise(resolve => {
    const users = [];
    Array.from({ length: 50 }).forEach(() => {
      users.push(createRandomUser());
    });
    resolve(users);
  });
}

function onScrollToBottom(setItems) {
  fetchData().then(data => setItems(d => d.concat(data)));
}

export default function() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    async function getData() {
      const data = await fetchData();
      setItems(items.concat(data));
    }
    getData();
  }, []);

  return (
    <div style={{ width: '100%', height: '150px' }}>
      <AutoSizer>
        {({ width, height = 0 }) => {
          return (
            <VirtualList
              itemCount={items.length}
              width={width}
              height={height}
              itemHeight={30}
              renderItem={({ index, style }) => {
                const i = items[index];
                return (
                  <div key={i.userId} style={style}>
                    <label>{i.username}</label>
                  </div>
                );
              }}
              onScrollToBottom={() => onScrollToBottom(setItems)}
            />
          );
        }}
      </AutoSizer>
    </div>
  );
}
