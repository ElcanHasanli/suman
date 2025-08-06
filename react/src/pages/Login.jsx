import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Waves, Star, Sparkles, Shield, Code, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../components/useDarkMode.js';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Dark mode hook
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Demo users
  const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'kuryer2', password: '123456', role: 'courier' },
    { username: 'kuryer1', password: '123456', role: 'courier' },
  ];
  const { login } = useAuth(); // ← bunu əlavə et

  // Dynamic styles based on dark mode
  const getContainerStyle = () => ({
    position: 'relative',
    minHeight: '100vh',
    background: isDarkMode
      ? 'linear-gradient(135deg, #1f2937, #111827)'
      : 'linear-gradient(135deg, #3b82f6, #2563eb)',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: 'white',
  });

  const getBackgroundElementStyle1 = () => ({
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: isDarkMode
      ? 'radial-gradient(circle at center, rgba(75, 85, 99, 0.3), transparent 70%)'
      : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 70%)',
    borderRadius: '50%',
    top: '-100px',
    left: '-100px',
    filter: 'blur(70px)',
  });

  const getBackgroundElementStyle2 = () => ({
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: isDarkMode
      ? 'radial-gradient(circle at center, rgba(55, 65, 81, 0.4), transparent 70%)'
      : 'radial-gradient(circle at center, rgba(191, 219, 254, 0.3), transparent 70%)',
    borderRadius: '50%',
    bottom: '-120px',
    right: '-100px',
    filter: 'blur(50px)',
  });

  const getBrandContainerStyle = () => ({
    marginBottom: '30px',
    textAlign: 'center',
    background: isDarkMode
      ? 'rgba(55, 65, 81, 0.3)'
      : 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '30px 20px',
    backdropFilter: 'blur(10px)',
    border: isDarkMode
      ? '1px solid rgba(75, 85, 99, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.1)',
  });

  const getFormContainerStyle = () => ({
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    background: isDarkMode
      ? 'rgba(55, 65, 81, 0.3)'
      : 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: isDarkMode
      ? '1px solid rgba(75, 85, 99, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.1)',
  });

  const getInputStyle = () => ({
    width: '100%',
    maxWidth: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: isDarkMode
      ? '1.5px solid rgba(75, 85, 99, 0.5)'
      : '1.5px solid rgba(255, 255, 255, 0.2)',
    background: isDarkMode
      ? 'rgba(55, 65, 81, 0.4)'
      : 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  });

  const getButtonStyle = () => ({
    position: 'relative',
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    background: isDarkMode
      ? 'linear-gradient(90deg, #374151 0%, #4b5563 100%)'
      : 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    zIndex: 0,
  });

  const getKhamsakraftFooterStyle = () => ({
    marginBottom: '15px',
    padding: '15px',
    background: isDarkMode
      ? 'rgba(251, 191, 36, 0.05)'
      : 'rgba(251, 191, 36, 0.1)',
    borderRadius: '8px',
    border: isDarkMode
      ? '1px solid rgba(251, 191, 36, 0.1)'
      : '1px solid rgba(251, 191, 36, 0.2)',
  });

  const footerTextStyle = {
    margin: 0,
    fontSize: '0.9rem',
    color: isHovered ? '#fff' : 'rgba(255, 255, 255, 0.4)',
    transition: 'color 0.3s ease',
    cursor: 'default'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 800));

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setError('İstifadəçi adı və ya şifrə yanlışdır.');
      setIsLoading(false);
      return;
    }

    login(user); 
    setFoundUser(user);
    setSuccess(true);
    setIsLoading(false);
  };



  useEffect(() => {
    if (success && foundUser) {
      setTimeout(() => {
        if (foundUser.role === 'admin') {
          navigate('/dashboard');
        } else if (foundUser.role === 'courier') {
          navigate('/courier');  // Kuryer paneli ünvanı
        } else {
          navigate('/my-orders');
        }
      }, 500);
    }
  }, [success, foundUser, navigate]);

  return (
    <div style={getContainerStyle()}>
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px',
          background: isDarkMode
            ? 'rgba(55, 65, 81, 0.8)'
            : 'rgba(255, 255, 255, 0.2)',
          border: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.5)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          color: 'white',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.background = isDarkMode
            ? 'rgba(75, 85, 99, 0.9)'
            : 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.background = isDarkMode
            ? 'rgba(55, 65, 81, 0.8)'
            : 'rgba(255, 255, 255, 0.2)';
        }}
        title={isDarkMode ? 'Light moda keç' : 'Dark moda keç'}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Animated Background Elements */}
      <div style={getBackgroundElementStyle1()}></div>
      <div style={getBackgroundElementStyle2()}></div>
      <div style={backgroundElementStyle3}></div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: isDarkMode
              ? 'rgba(156, 163, 175, 0.4)'
              : 'rgba(191, 219, 254, 0.4)',
            borderRadius: '50%',
            left: `${15 + i * 12}%`,
            top: `${8 + (i % 4) * 25}%`,
            animation: `bounce 4s infinite ${i * 0.4}s`
          }}
        />
      ))}

      <div style={mainContainerStyle}>
        {/* Main Brand Container */}
        <div style={getBrandContainerStyle()}>
          <div style={logoContainerStyle}>
            <div style={logoStyle}>
              <Waves size={40} color="white" />
            </div>
            <div style={logoGlowStyle}></div>
          </div>
          <h1 style={titleStyle}>SuMan</h1>
          <p style={subtitleStyle}>Su idarəetmə sistemi</p>

          {/* Premium Badge */}
          <div style={premiumBadgeStyle}>
            <Star size={16} />
            <span>Premium Solution</span>
          </div>
        </div>

        <div style={getFormContainerStyle()}>
          <div style={formOverlayStyle}></div>
          <div style={formContentStyle}>
            <h2 style={formTitleStyle}>
              <Shield size={20} style={{ marginRight: '8px' }} />
              Hesaba daxil olun
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={inputContainerStyle}>
                <div style={inputIconStyle}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="İstifadəçi adı"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={getInputStyle()}
                  onFocus={(e) => {
                    e.target.style.boxShadow = isDarkMode
                      ? '0 0 0 2px rgba(156, 163, 175, 0.5)'
                      : '0 0 0 2px rgba(147, 197, 253, 0.5)';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = isDarkMode
                      ? 'rgba(75, 85, 99, 0.5)'
                      : 'rgba(255, 255, 255, 0.2)';
                  }}
                />
              </div>

              <div style={inputContainerStyle}>
                <div style={inputIconStyle}>
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifrə"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...getInputStyle(), paddingRight: '40px' }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = isDarkMode
                      ? '0 0 0 2px rgba(156, 163, 175, 0.5)'
                      : '0 0 0 2px rgba(147, 197, 253, 0.5)';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = isDarkMode
                      ? 'rgba(75, 85, 99, 0.5)'
                      : 'rgba(255, 255, 255, 0.2)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={togglePasswordStyle}
                  onMouseEnter={(e) => (e.target.style.color = 'white')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(191, 219, 254, 0.7)')}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {error && (
                <div style={errorStyle}>
                  <p style={errorTextStyle}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || success}
                style={getButtonStyle()}
                onMouseEnter={(e) => {
                  if (!isLoading && !success) {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && !success) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                <div style={buttonOverlayStyle}></div>
                <span style={buttonContentStyle}>
                  {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={spinnerStyle}></div>
                      <span>Gözləyin...</span>
                    </div>
                  ) : success ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ ...spinnerStyle, borderColor: '#10b981', borderTopColor: '#34d399' }}></div>
                      <span>Uğurlu!</span>
                    </div>
                  ) : (
                    'Daxil ol'
                  )}
                </span>
              </button>
            </form>

            <div style={infoStyle}>
              <p style={infoTextStyle}>Təhlükəsiz giriş sistemi</p>
            </div>
          </div>
        </div>

        {/* KhamsaCraft Footer */}
        <div style={footerStyle}>
          <div style={getKhamsakraftFooterStyle()}>
            <div style={footerBrandStyle}>
              <Sparkles size={16} color="#fbbf24" />
              <span style={footerBrandTextStyle}> KhamsaCraft məhsulu</span>
            </div>
          </div>
          <p
            style={footerTextStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Powered by KhamsaCraft | SuMan © 2025
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.5); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(180deg); }
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        input::placeholder {
          color: rgba(191, 219, 254, 0.7);
        }
        input:hover {
          background: ${isDarkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgba(255, 255, 255, 0.15)'} !important;
        }
        .khamsa-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Static styles (unchanged)
const backgroundElementStyle3 = {
  position: 'absolute',
  width: '200px',
  height: '200px',
  background: 'radial-gradient(circle at center, rgba(147, 197, 253, 0.3), transparent 70%)',
  borderRadius: '50%',
  top: '40%',
  left: '40%',
  filter: 'blur(50px)',
};

const mainContainerStyle = {
  position: 'relative',
  maxWidth: '420px',
  margin: '50px auto',
  padding: '20px 30px 40px',
  zIndex: 10,
};

const logoContainerStyle = {
  position: 'relative',
  display: 'inline-block',
  marginBottom: '15px',
};

const logoStyle = {
  position: 'relative',
  zIndex: 2,
};

const logoGlowStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60px',
  height: '60px',
  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%)',
  borderRadius: '50%',
  filter: 'blur(10px)',
  zIndex: 1,
};

const titleStyle = {
  margin: 0,
  fontSize: '2.5rem',
  fontWeight: '700',
  color: 'white',
  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
};

const subtitleStyle = {
  marginTop: '8px',
  fontSize: '1rem',
  color: 'rgba(255, 255, 255, 0.8)',
  marginBottom: '15px',
};

const premiumBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  background: 'linear-gradient(45deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
  border: '1px solid rgba(251, 191, 36, 0.3)',
  borderRadius: '20px',
  fontSize: '0.8rem',
  color: '#fbbf24',
  fontWeight: '600',
};

const formOverlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  pointerEvents: 'none',
  zIndex: 1,
};

const formContentStyle = {
  position: 'relative',
  padding: '30px 20px',
  zIndex: 2,
};

const formTitleStyle = {
  marginBottom: '24px',
  fontSize: '1.5rem',
  fontWeight: '600',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '10px',
};

const inputContainerStyle = {
  position: 'relative',
  marginBottom: '20px',
};

const inputIconStyle = {
  position: 'absolute',
  top: '50%',
  left: '14px',
  transform: 'translateY(-50%)',
  color: 'rgba(191, 219, 254, 0.7)',
  zIndex: 2,
};

const togglePasswordStyle = {
  position: 'absolute',
  top: '50%',
  right: '12px',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: 'rgba(191, 219, 254, 0.7)',
  cursor: 'pointer',
  outline: 'none',
  padding: 0,
  zIndex: 2,
};

const errorStyle = {
  marginBottom: '16px',
  padding: '12px',
  backgroundColor: 'rgba(220, 38, 38, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(220, 38, 38, 0.3)',
};

const errorTextStyle = {
  color: '#fca5a5',
  margin: 0,
  fontWeight: '500',
  fontSize: '0.9rem',
};

const buttonOverlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
  opacity: 0.5,
  pointerEvents: 'none',
  zIndex: -1,
};

const buttonContentStyle = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
};

const spinnerStyle = {
  width: '18px',
  height: '18px',
  border: '3px solid rgba(255, 255, 255, 0.5)',
  borderTopColor: 'white',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const infoStyle = {
  marginTop: '16px',
  textAlign: 'center',
};

const infoTextStyle = {
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '0.9rem',
  margin: 0,
};

const footerStyle = {
  marginTop: '30px',
  textAlign: 'center',
};

const footerBrandStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  marginBottom: '8px',
};

const footerBrandTextStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#fbbf24',
};