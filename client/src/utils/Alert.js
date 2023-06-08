import React, { useState, useEffect } from 'react';
import '../styles/Alert.css';

const Alert = ({ message, type, duration, onClose }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(true);

    const timer = setTimeout(() => {
      setShowAlert(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    showAlert && (
      <div className={`alert ${type}`}>
        <div className="message">{message}</div>
        <button className="close-btn" onClick={() => setShowAlert(false)}>
          X
        </button>
      </div>
    )
  );
};

export default Alert;
