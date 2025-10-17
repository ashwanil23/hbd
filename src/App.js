import React, { useState, useEffect } from 'react';

export default function BirthdayWebsite() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState({ name: '', message: '' });
  const [showWishForm, setShowWishForm] = useState(false);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Set birthday date - CUSTOMIZE THIS
  const birthdayDate = new Date('2025-10-17T00:00:00');

  // Sample photos - Replace with actual image URLs
  const photos = [
    { url: 'https://drive.google.com/drive/u/4/folders/1nMdFTf_q6XL6msCibEnxaMCYN3_dAwJJ', caption: 'Amazing memories!' },
    { url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800', caption: 'Fun times together' },
    { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800', caption: 'Unforgettable moments' },
    { url: 'https://images.unsplash.com/photo-1531956531700-e4b9e30b6e1b?w=800', caption: 'Best friends forever' },
  ];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = birthdayDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setShowConfetti(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

// Fetch existing wishes from backend
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/wishes`)
        .then((res) => res.json())
        .then((data) => setWishes(data))
        .catch((err) => console.error("Error fetching wishes:", err));
  }, []);

  const handleSubmitWish = async () => {
    if (newWish.name && newWish.message) {
      try {
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/wishes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWish),
        });

        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/wishes`);
        const data = await res.json();
        setWishes(data);

        setNewWish({ name: '', message: '' });
        setShowWishForm(false);
        triggerConfetti();
      } catch (err) {
        console.error("Error saving wish:", err);
      }
    }
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const balloon = {
          id: Date.now() + i,
          left: Math.random() * 80 + 10,
          color: ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#ec4899'][Math.floor(Math.random() * 5)]
        };
        setBalloons(prev => [...prev, balloon]);
      }, i * 800);
    }

    setTimeout(() => {
      setGameActive(false);
      setBalloons([]);
    }, 10000);
  };

  const popBalloon = (id) => {
    setScore(prev => prev + 10);
    setBalloons(prev => prev.filter(b => b.id !== id));
    triggerConfetti();
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % photos.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + photos.length) % photos.length);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffd89b 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    floatingHearts: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    },
    heart: {
      position: 'absolute',
      fontSize: '20px',
      opacity: 0.2,
      animation: 'pulse 3s infinite',
    },
    confettiDot: {
      position: 'absolute',
      width: '8px',
      height: '8px',
      backgroundColor: '#fbbf24',
      borderRadius: '50%',
      animation: 'ping 2s infinite',
    },
    header: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      padding: '48px 16px',
    },
    title: {
      fontSize: '4rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
      animation: 'bounce 2s infinite',
    },
    subtitle: {
      fontSize: '1.5rem',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    section: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '896px',
      margin: '0 auto 64px',
      padding: '0 16px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    sectionTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    countdownGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      textAlign: 'center',
    },
    countdownBox: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '24px',
    },
    countdownNumber: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
    },
    countdownLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      textTransform: 'uppercase',
      fontSize: '0.875rem',
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '384px',
      objectFit: 'cover',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    },
    imageCaption: {
      position: 'absolute',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '9999px',
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(255, 255, 255, 0.3)',
      border: 'none',
      borderRadius: '50%',
      padding: '12px 16px',
      fontSize: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    dots: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px',
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    button: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      fontWeight: 'bold',
      padding: '16px 24px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.3s',
    },
    modal: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px',
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '448px',
      width: '100%',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6b7280',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      marginBottom: '16px',
      fontSize: '1rem',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      marginBottom: '16px',
      fontSize: '1rem',
      height: '128px',
      resize: 'none',
      boxSizing: 'border-box',
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
      color: 'white',
      fontWeight: 'bold',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    wishesContainer: {
      maxHeight: '384px',
      overflowY: 'auto',
      marginTop: '16px',
    },
    wishCard: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
    },
    wishName: {
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
    },
    wishMessage: {
      color: 'rgba(255, 255, 255, 0.9)',
    },
    gameContainer: {
      position: 'relative',
      height: '256px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    scoreDisplay: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
    },
    balloon: {
      position: 'absolute',
      bottom: 0,
      width: '48px',
      height: '64px',
      borderRadius: '50%',
      cursor: 'pointer',
      border: 'none',
      fontSize: '2rem',
      transition: 'transform 0.2s',
      animation: 'balloonFloat 3s ease-in-out',
    },
    footer: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      padding: '48px 16px',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    secretButton: {
      marginTop: '16px',
      opacity: 0,
      transition: 'opacity 0.3s',
      background: 'none',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '0.75rem',
      cursor: 'pointer',
    },
  };

  return (
      <div style={styles.container}>
        <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes balloonFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-300px); }
        }
        button:hover { transform: scale(1.05); }
        .secret-button:hover { opacity: 1 !important; }
      `}</style>

        {/* Confetti Effect */}
        {showConfetti && (
            <div style={styles.floatingHearts}>
              {[...Array(50)].map((_, i) => (
                  <div
                      key={i}
                      style={{
                        ...styles.confettiDot,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                  />
              ))}
            </div>
        )}

        {/* Floating hearts */}
        <div style={styles.floatingHearts}>
          {[...Array(20)].map((_, i) => (
              <div
                  key={i}
                  style={{
                    ...styles.heart,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
              >
                ❤️
              </div>
          ))}
        </div>

        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>🎉 Happy Birthday!
            Ckiku🎂</h1>
          <p style={styles.subtitle}>A special celebration for someone amazing!</p>
        </header>

        {/* Countdown Section */}
        <section style={styles.section}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              🎁 Countdown to the Big Day
            </h2>
            <div style={styles.countdownGrid}>
              {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} style={styles.countdownBox}>
                    <div style={styles.countdownNumber}>{value}</div>
                    <div style={styles.countdownLabel}>{unit}</div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Gallery */}
        <section style={styles.section}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              📷 Memory Lane
            </h2>
            <div style={styles.imageContainer}>
              <img
                  src={photos[currentImage].url}
                  alt={photos[currentImage].caption}
                  style={styles.image}
              />
              <div style={styles.imageCaption}>
                {photos[currentImage].caption}
              </div>
              <button
                  onClick={prevImage}
                  style={{ ...styles.navButton, left: '16px' }}
              >
                ←
              </button>
              <button
                  onClick={nextImage}
                  style={{ ...styles.navButton, right: '16px' }}
              >
                →
              </button>
            </div>
            <div style={styles.dots}>
              {photos.map((_, idx) => (
                  <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      style={{
                        ...styles.dot,
                        background: idx === currentImage ? 'white' : 'rgba(255, 255, 255, 0.3)',
                      }}
                  />
              ))}
            </div>
          </div>
        </section>

        {/* Birthday Wishes */}
        <section style={styles.section}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              💬 Birthday Wishes
            </h2>

            <button
                onClick={() => setShowWishForm(true)}
                style={styles.button}
            >
              ✨ Leave a Birthday Wish
            </button>

            {showWishForm && (
                <div style={styles.modal} onClick={() => setShowWishForm(false)}>
                  <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowWishForm(false)}
                        style={styles.closeButton}
                    >
                      ×
                    </button>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                      Send Your Wishes 💌
                    </h3>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={newWish.name}
                        onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Your birthday message..."
                        value={newWish.message}
                        onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
                        style={styles.textarea}
                    />
                    <button onClick={handleSubmitWish} style={styles.submitButton}>
                      Send Wish 🎁
                    </button>
                  </div>
                </div>
            )}

            <div style={styles.wishesContainer}>
              {wishes.length === 0 ? (
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '32px 0' }}>
                    Be the first to leave a birthday wish!
                  </p>
              ) : (
                  wishes.map((wish) => (
                      <div key={wish.id} style={styles.wishCard}>
                        <p style={styles.wishName}>{wish.name}</p>
                        <p style={styles.wishMessage}>{wish.message}</p>
                      </div>
                  ))
              )}
            </div>
          </div>
        </section>

        {/* Easter Egg Game */}
        <section style={styles.section}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              ✨ Pop the Balloons!
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginBottom: '16px' }}>
              Click to start the game and pop as many balloons as you can!
            </p>

            {!gameActive ? (
                <button
                    onClick={startGame}
                    style={{ ...styles.button, background: '#fbbf24', color: '#1f2937' }}
                >
                  🎈 Start Game
                </button>
            ) : (
                <div style={styles.gameContainer}>
                  <div style={styles.scoreDisplay}>Score: {score}</div>
                  {balloons.map((balloon) => (
                      <button
                          key={balloon.id}
                          onClick={() => popBalloon(balloon.id)}
                          style={{
                            ...styles.balloon,
                            left: `${balloon.left}%`,
                            background: balloon.color,
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        🎈
                      </button>
                  ))}
                </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Made with ❤️ for an amazing person</p>
          <p style={{ fontSize: '0.875rem' }}>Wishing you the happiest birthday filled with love, laughter, and joy!</p>

          <button
              onClick={triggerConfetti}
              style={styles.secretButton}
              className="secret-button"
          >
            🎁 Secret Confetti
          </button>
        </footer>
      </div>
  );
}