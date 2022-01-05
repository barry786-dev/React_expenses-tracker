import React, { useState } from 'react';
import './Clock.css';

const Clock = () => {
  const timeinit = new Date().toLocaleTimeString();
  const [time, setTime] = useState(timeinit);
  const tick = () => {
    setTime(new Date().toLocaleTimeString());
  };
  const clockTime = setInterval(tick, 1000);
  clearInterval(clockTime);
  return <div id='clock'>{time}</div>;
};
export default Clock;
