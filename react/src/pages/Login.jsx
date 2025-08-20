import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Waves, Star, Sparkles, Shield, Code, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../components/useDarkMode.js';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLoginMutation } from '../services/apiSlice';

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

  const { login } = useAuth();
  const [apiLogin, { isLoading: isApiLoading }] = useLoginMutation();

  // Dynamic styles based on dark mode
  const getContainerStyle = () => ({
    position: 'fixed', // fixed edirik ki, scroll olmasın
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: '100vh',
    height: '100vh', // tam ekran hündürlüyü
    background: isDarkMode
      ? 'linear-gradient(135deg, #1f2937, #111827)'
      : 'linear-gradient(135deg, #3b82f6, #2563eb)',
    overflow: 'hidden', // scroll olmasın
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: 'white',
  });

  const getBackgroundElementStyle1 = () => ({
    position: 'absolute',
    width: 'clamp(200px, 40vw, 400px)', // responsive ölçü
    height: 'clamp(200px, 40vw, 400px)',
    background: isDarkMode
      ? 'radial-gradient(circle at center, rgba(75, 85, 99, 0.3), transparent 70%)'
      : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 70%)',
    borderRadius: '50%',
    top: '-50px',
    left: '-50px',
    filter: 'blur(70px)',
  });

  const getBackgroundElementStyle2 = () => ({
    position: 'absolute',
    width: 'clamp(200px, 40vw, 400px)', // responsive ölçü
    height: 'clamp(200px, 40vw, 400px)',
    background: isDarkMode
      ? 'radial-gradient(circle at center, rgba(55, 65, 81, 0.4), transparent 70%)'
      : 'radial-gradient(circle at center, rgba(191, 219, 254, 0.3), transparent 70%)',
    borderRadius: '50%',
    bottom: '-60px',
    right: '-50px',
    filter: 'blur(50px)',
  });

  const getBrandContainerStyle = () => ({
    marginBottom: 'clamp(20px, 4vw, 30px)', // responsive margin
    textAlign: 'center',
    background: isDarkMode
      ? 'rgba(55, 65, 81, 0.3)'
      : 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: 'clamp(20px, 4vw, 30px) clamp(15px, 3vw, 20px)', // responsive padding
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
    padding: 'clamp(10px, 2.5vw, 12px) clamp(10px, 2.5vw, 12px) clamp(10px, 2.5vw, 12px) clamp(35px, 8vw, 40px)', // responsive padding
    borderRadius: '8px',
    border: isDarkMode
      ? '1.5px solid rgba(75, 85, 99, 0.5)'
      : '1.5px solid rgba(255, 255, 255, 0.2)',
    background: isDarkMode
      ? 'rgba(55, 65, 81, 0.4)'
      : 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // responsive font size
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  });

  const getButtonStyle = () => ({
    position: 'relative',
    width: '100%',
    padding: 'clamp(12px, 3vw, 14px)', // responsive padding
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', // responsive font size
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
    marginBottom: 'clamp(12px, 3vw, 15px)', // responsive margin
    padding: 'clamp(12px, 3vw, 15px)', // responsive padding
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
    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', // responsive font size
    color: isHovered ? '#fff' : 'rgba(255, 255, 255, 0.4)',
    transition: 'color 0.3s ease',
    cursor: 'default'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // API login cəhdi
      const result = await apiLogin({ username, password }).unwrap();
      
      console.log('Backend response:', result); // Debug üçün
      
      // Backend cavabı yoxlayırıq
      if (result && result.role) {
        // API login uğurlu
        const userData = {
          username: username, // Frontend-dən gələn username
          role: result.role, // Backend-dən gələn role
          id: result.id || null, // Əgər varsa
          ...result // Bütün backend cavabını əlavə edirik
        };
        
        console.log('User data for navigation:', userData); // Debug üçün
        
        login(userData, result.token || 'temp-token'); // Token yoxdursa temporary token
        setFoundUser(userData);
        setSuccess(true);
        setIsLoading(false);
        return;
      } else {
        setError('Giriş uğursuz oldu. Zəhmət olmasa məlumatları yoxlayın.');
        setIsLoading(false);
      }
    } catch (apiError) {
      console.error('API login xətası:', apiError);
      
      if (apiError.status === 401) {
        setError('İstifadəçi adı və ya şifrə yanlışdır.');
      } else if (apiError.status === 403) {
        setError('Giriş icazəsi yoxdur.');
      } else if (apiError.status === 500) {
        setError('Server xətası. Zəhmət olmasa sonra cəhd edin.');
      } else {
        setError('Giriş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      }
      
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (success && foundUser) {
      console.log('Navigation triggered:', { success, foundUser }); // Debug üçün
      setTimeout(() => {
        console.log('Navigating to:', foundUser.role); // Debug üçün
        // API-dən gələn role-a əsaslanan navigation
        if (foundUser.role === 'admin' || foundUser.role === 'ADMIN') {
          console.log('Going to dashboard');
          navigate('/dashboard');
        } else if (foundUser.role === 'courier' || foundUser.role === 'COURIER') {
          console.log('Going to courier panel');
          navigate('/courier');
        } else {
          console.log('Going to my-orders');
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
          top: 'clamp(15px, 3vw, 20px)', // responsive top
          right: 'clamp(15px, 3vw, 20px)', // responsive right
          padding: 'clamp(10px, 2.5vw, 12px)', // responsive padding
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

      <div style={mainContainerStyle} className="main-container">
        {/* Main Brand Container */}
        <div style={getBrandContainerStyle()} className="brand-container">
          <div style={logoContainerStyle}>
            <div style={logoStyle}>
              <Waves size={40} color="white" />
            </div>
            <div style={logoGlowStyle}></div>
          </div>
          <h1 style={titleStyle} className="title">SuMan</h1>
          <p style={subtitleStyle} className="subtitle">Su idarə etmə sistemi</p>

          {/* Premium Badge */}
          <div style={premiumBadgeStyle}>
            <Star size={16} />
            <span>Premium Solution</span>
          </div>
        </div>

        <div style={getFormContainerStyle()} className="form-container">
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
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .main-container {
            margin: 20px auto;
            padding: 15px 20px 30px;
          }
          
          .form-container {
            padding: 20px 15px;
          }
          
          .brand-container {
            padding: 20px 15px;
          }
        }
        
        @media (max-width: 480px) {
          .main-container {
            margin: 15px auto;
            padding: 10px 15px 25px;
          }
          
          .form-container {
            padding: 15px 10px;
          }
          
          .brand-container {
            padding: 15px 10px;
          }
          
          .title {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 0.85rem;
          }
        }
        
        /* Landscape orientation for mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .main-container {
            margin: 10px auto;
            padding: 10px 20px 20px;
          }
          
          .brand-container {
            margin-bottom: 15px;
            padding: 15px 20px;
          }
          
          .form-container {
            padding: 15px 20px;
          }
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
  maxWidth: 'clamp(320px, 90vw, 420px)', // responsive max width
  width: '90vw', // responsive width
  margin: 'clamp(20px, 5vh, 50px) auto', // responsive margin
  padding: 'clamp(15px, 3vw, 20px) clamp(20px, 4vw, 30px) clamp(30px, 6vw, 40px)', // responsive padding
  zIndex: 10,
};

const logoContainerStyle = {
  position: 'relative',
  display: 'inline-block',
  marginBottom: 'clamp(10px, 2.5vw, 15px)', // responsive margin
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
  width: 'clamp(40px, 12vw, 60px)', // responsive width
  height: 'clamp(40px, 12vw, 60px)', // responsive height
  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%)',
  borderRadius: '50%',
  filter: 'blur(10px)',
  zIndex: 1,
};

const titleStyle = {
  margin: 0,
  fontSize: 'clamp(2rem, 8vw, 2.5rem)', // responsive font size
  fontWeight: '700',
  color: 'white',
  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
};

const subtitleStyle = {
  marginTop: 'clamp(6px, 1.5vw, 8px)', // responsive margin
  fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', // responsive font size
  color: 'rgba(255, 255, 255, 0.8)',
  marginBottom: 'clamp(12px, 3vw, 15px)', // responsive margin
};

const premiumBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'clamp(4px, 1.5vw, 6px)', // responsive gap
  padding: 'clamp(4px, 1.5vw, 6px) clamp(8px, 2.5vw, 12px)', // responsive padding
  background: 'linear-gradient(45deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
  border: '1px solid rgba(251, 191, 36, 0.3)',
  borderRadius: '20px',
  fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)', // responsive font size
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
  padding: 'clamp(20px, 5vw, 30px) clamp(15px, 3vw, 20px)', // responsive padding
  zIndex: 2,
};

const formTitleStyle = {
  marginBottom: 'clamp(16px, 4vw, 24px)', // responsive margin
  fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', // responsive font size
  fontWeight: '600',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 'clamp(8px, 2vw, 10px)', // responsive gap
};

const inputContainerStyle = {
  position: 'relative',
  marginBottom: 'clamp(16px, 4vw, 20px)', // responsive margin
};

const inputIconStyle = {
  position: 'absolute',
  top: '50%',
  left: 'clamp(10px, 2.5vw, 14px)', // responsive left
  transform: 'translateY(-50%)',
  color: 'rgba(191, 219, 254, 0.7)',
  zIndex: 2,
};

const togglePasswordStyle = {
  position: 'absolute',
  top: '50%',
  right: 'clamp(8px, 2.5vw, 12px)', // responsive right
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
  marginTop: 'clamp(20px, 5vw, 30px)', // responsive margin
  textAlign: 'center',
};

const footerBrandStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(6px, 1.5vw, 8px)', // responsive gap
  marginBottom: 'clamp(6px, 1.5vw, 8px)', // responsive margin
};

const footerBrandTextStyle = {
  fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', // responsive font size
  fontWeight: '600',
  color: '#fbbf24',
};