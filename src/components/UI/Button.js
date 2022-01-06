import React , {useRef , useEffect} from 'react';
import VanillaTilt from 'vanilla-tilt';
import './Button.css';
const Button = ({ onClick, children, className, type }) => {
  const classes = `general_button ${className} js-tilt-glare`;
  const sittingsIcon = useRef();
  useEffect(() => {
    const sittingsIconNode = sittingsIcon.current;
    const vanillaTiltOptions = {
      reverse: true,
      max: 15,
      speed: 400,
      scale: 1.12,
      glare: true,
      reset: true,
      perspective: 500,
      transition: true,
      'max-glare': 0.75,
      'glare-prerender': false,
      gyroscope: true,
      gyroscopeMinAngleX: -45,
      gyroscopeMaxAngleX: 45,
      gyroscopeMinAngleY: -45,
      gyroscopeMaxAngleY: 45,
    };
    VanillaTilt.init(sittingsIconNode, vanillaTiltOptions);
    return () => {
      sittingsIconNode.vanillaTilt.destroy();
    };
  }, []);
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      ref={sittingsIcon}
    >
      {children}
    </button>
  );
};

export default Button;
