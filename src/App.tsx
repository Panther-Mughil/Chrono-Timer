import { useEffect, useState } from 'react';
import { useStore } from './store';
import { Plus, Timer as TimerIcon, Store, Play, Pause, Square, Trash2, Hexagon, Maximize2, Minimize2 } from 'lucide-react';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import './App.css';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

function App() {
  const { activeTab, setActiveTab, coins, tick, timers, addTimer, removeTimer, updateTimerStatus, resetTimer, unlockedItems, unlockItem } = useStore();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newTimerName, setNewTimerName] = useState('Focus');
  const [newTimerDuration, setNewTimerDuration] = useState('25');
  const [isMiniMode, setIsMiniMode] = useState(false);
  const [miniTimerId, setMiniTimerId] = useState<string | null>(null);

  const toggleMiniMode = async (timerId?: string) => {
    try {
      const appWindow = getCurrentWindow();
      if (!isMiniMode && timerId) {
        await appWindow.setMinSize(new LogicalSize(320, 240));
        await appWindow.setSize(new LogicalSize(320, 240));
        await appWindow.setAlwaysOnTop(true);
        setMiniTimerId(timerId);
        setIsMiniMode(true);
      } else {
        await appWindow.setAlwaysOnTop(false);
        await appWindow.setMinSize(new LogicalSize(400, 600));
        await appWindow.setSize(new LogicalSize(800, 700));
        setMiniTimerId(null);
        setIsMiniMode(false);
      }
    } catch (e) {
      if (!isMiniMode && timerId) {
        setMiniTimerId(timerId);
        setIsMiniMode(true);
      } else {
        setMiniTimerId(null);
        setIsMiniMode(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const handleAddTimer = () => {
    const duration = parseInt(newTimerDuration) * 60;
    if (duration > 0) {
      addTimer(duration, newTimerName);
    }
    setAddModalOpen(false);
    setNewTimerName('Focus');
    setNewTimerDuration('25');
  };

  if (isMiniMode && miniTimerId) {
    const timer = timers.find(t => t.id === miniTimerId);
    if (!timer) return <div className="app-container" style={{padding: '24px', color: 'var(--text-secondary)'}}>Timer missing. <button onClick={() => toggleMiniMode()} className="buy-btn">Go Back</button></div>;
    return (
      <div className="mini-mode-container" data-tauri-drag-region>
        <div className="timer-card mini-card" style={{ width: '100%', border: 'none', boxShadow: 'none' }}>
          <div className="timer-header">
            <h3 className="timer-name">{timer.name}</h3>
            <button className="icon-btn" onClick={() => toggleMiniMode()} title="Restore Window">
              <Maximize2 size={16} />
            </button>
          </div>
          <div className="timer-time" style={{ fontSize: '3rem' }}>
            {formatTime(timer.remaining)}
          </div>
          <div className="timer-controls">
            {timer.status === 'running' ? (
              <button className="control-btn active" onClick={() => updateTimerStatus(timer.id, 'paused')}>
                <Pause size={18} fill="currentColor" />
              </button>
            ) : (
              <button className="control-btn" onClick={() => updateTimerStatus(timer.id, 'running')}>
                <Play size={18} fill="currentColor" />
              </button>
            )}
            <button className="control-btn" onClick={() => resetTimer(timer.id)}>
              <Square size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'timer' && (
          timers.length === 0 ? (
            <div className="empty-state">
              No active timers
            </div>
          ) : (
            <div className="timer-grid">
              {timers.map(timer => (
                <div key={timer.id} className="timer-card">
                  <div className="timer-header">
                    <h3 className="timer-name">{timer.name}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" onClick={() => toggleMiniMode(timer.id)} title="Mini Mode (Always on Top)">
                        <Minimize2 size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => removeTimer(timer.id)} title="Delete Timer">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
            }
            </div>
          )
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
            ].map(item => {
              const isUnlocked = unlockedItems.includes(item.id);
              return (
              <div key={item.id} className={`shop-item ${isUnlocked ? 'unlocked' : ''}`}>
                <div className="shop-item-img">{item.icon}</div>
                <div className="shop-item-title">{item.name}</div>
                <div className="shop-item-price">
                  <Hexagon size={14} /> {item.price}
                </div>
                <button 
                  className="buy-btn" 
                  disabled={isUnlocked || coins < item.price}
                  onClick={() => unlockItem(item.id, item.price)}
                >
                  {isUnlocked ? 'Owned' : (coins >= item.price ? 'Unlock' : 'Locked')}
                </button>
              </div>
            )})}
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
