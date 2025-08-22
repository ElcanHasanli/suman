import React from 'react';

const LoadingSpinner = ({ size = 'default', color = '#fc2f70' }) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: '2em' },
          ball: { width: '0.4em', height: '0.4em' }
        };
      case 'large':
        return {
          container: { width: '6em' },
          ball: { width: '1.2em', height: '1.2em' }
        };
      default:
        return {
          container: { width: '4em' },
          ball: { width: '0.8em', height: '0.8em' }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const styles = {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%'
    },
    balls: {
      width: sizeStyles.container.width,
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    ball: {
      width: sizeStyles.ball.width,
      height: sizeStyles.ball.height,
      borderRadius: '50%',
      backgroundColor: color
    },
    ball1: {
      width: sizeStyles.ball.width,
      height: sizeStyles.ball.width,
      borderRadius: '50%',
      backgroundColor: color,
      transform: 'translateX(-100%)',
      animation: 'left-swing 0.5s ease-in alternate infinite'
    },
    ball2: {
      width: sizeStyles.ball.width,
      height: sizeStyles.ball.width,
      borderRadius: '50%',
      backgroundColor: color
    },
    ball3: {
      width: sizeStyles.ball.width,
      height: sizeStyles.ball.width,
      borderRadius: '50%',
      backgroundColor: color,
      transform: 'translateX(-95%)',
      animation: 'right-swing 0.5s ease-out alternate infinite'
    }
  };

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.balls}>
          <div style={styles.ball1}></div>
          <div style={styles.ball2}></div>
          <div style={styles.ball3}></div>
        </div>
      </div>
      
      <style>{`
        @keyframes left-swing {
          50%,
          100% {
            transform: translateX(95%);
          }
        }

        @keyframes right-swing {
          50% {
            transform: translateX(-95%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
};

export default LoadingSpinner;
