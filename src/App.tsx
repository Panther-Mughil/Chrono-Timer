import { useEffect, useState } from 'react';
import { useStore } from './store';
import { Moon, Sun, Plus, Timer as TimerIcon, Store, Play, Pause, Square, Trash2, Hexagon } from 'lucide-react';
import './App.css';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

function App() {
  const { theme, toggleTheme, activeTab, setActiveTab, coins, tick, timers, addTimer, removeTimer, updateTimerStatus, resetTimer } = useStore();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newTimerName, setNewTimerName] = useState('Focus');
  const [newTimerDuration, setNewTimerDuration] = useState('25');

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAddTimer = () => {
    const duration = parseInt(newTimerDuration) * 60;
    if (duration > 0) {
      addTimer(duration, newTimerName);
    }
    setAddModalOpen(false);
    setNewTimerName('Focus');
    setNewTimerDuration('25');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Chrono</h1>
        <div className="header-actions">
          <div className="coin-display">
            <Hexagon size={16} strokeWidth={2.5} />
            <span>{coins}</span>
          </div>
          <button className="icon-btn" onClick={() => setAddModalOpen(true)} title="Add Timer">
            <Plus size={20} />
          </button>
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'timer' && (
          <div className="timer-list">
            {timers.length === 0 ? (
              <div className="empty-state">
                No active timers
              </div>
            ) : (
              timers.map(timer => (
                <div key={timer.id} className="timer-card">
                  <div className="timer-header">
                    <h3 className="timer-name">{timer.name}</h3>
                    <button className="icon-btn" onClick={() => removeTimer(timer.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="timer-time">
                    {formatTime(timer.remaining)}
                  </div>
                  <div className="timer-controls">
                    {timer.status === 'running' ? (
                      <button className="control-btn active" onClick={() => updateTimerStatus(timer.id, 'paused')}>
                        <Pause size={20} fill="currentColor" />
                      </button>
                    ) : (
                      <button className="control-btn" onClick={() => updateTimerStatus(timer.id, 'running')}>
                        <Play size={20} fill="currentColor" />
                      </button>
                    )}
                    <button className="control-btn" onClick={() => resetTimer(timer.id)}>
                      <Square size={18} fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="shop-grid">
            {[
              { id: 1, name: 'Bronze Trophy', price: 10, icon: '🏆' },
              { id: 2, name: 'Silver Badge', price: 50, icon: '🥈' },
              { id: 3, name: 'Gold Crown', price: 100, icon: '👑' },
              { id: 4, name: 'Diamond Gem', price: 500, icon: '💎' },
              { id: 5, name: 'Rocket Ship', price: 1000, icon: '🚀' },
              { id: 6, name: 'Zen Master', price: 5000, icon: '🧘' },
            ].map(item => (
              <div key={item.id} className="shop-item">
                <div className="shop-item-img">{item.icon}</div>
                <div className="shop-item-title">{item.name}</div>
                <div className="shop-item-price">
                  <Hexagon size={14} /> {item.price}
                </div>
                <button className="buy-btn" disabled={coins < item.price}>
                  {coins >= item.price ? 'Unlock' : 'Locked'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'timer' ? 'active' : ''}`} onClick={() => setActiveTab('timer')}>
          <TimerIcon size={18} />
          <span>Timer</span>
        </button>
        <div className="nav-separator" />
        <button className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
          <Store size={18} />
          <span>Shop</span>
        </button>
      </nav>

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{margin: 0, fontSize: '1.1rem', fontWeight: 600}}>Create Timer</h3>
            <input 
              type="text" 
              placeholder="Timer Name (e.g., Focus)" 
              value={newTimerName} 
              onChange={e => setNewTimerName(e.target.value)} 
            />
            <input 
              type="number" 
              placeholder="Duration in minutes" 
              value={newTimerDuration} 
              onChange={e => setNewTimerDuration(e.target.value)}
              min="1"
            />
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setAddModalOpen(false)}>Cancel</button>
              <button className="btn primary" onClick={handleAddTimer}>Add Timer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
