import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useFriendsStore } from '../../store/friendsStore';

interface Props {
  onClose: () => void;
  direction?: 'up' | 'down';
}

export default function UserPopover({ onClose, direction = 'up' }: Props) {
  const logout = useAuthStore((s) => s.logout);
  const friends = useFriendsStore((s) => s.friends);
  const pending = useFriendsStore((s) => s.pending);
  const loadFriends = useFriendsStore((s) => s.loadFriends);
  const loadPending = useFriendsStore((s) => s.loadPending);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFriends();
    loadPending();
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, loadPending]);

  const positionStyle = direction === 'up'
    ? { bottom: 'calc(100% + 8px)', left: 0, right: 0 }
    : { top: 'calc(100% + 8px)', right: 0, minWidth: 200 };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        ...positionStyle,
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 999,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 4, display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => { navigate('/profile'); onClose(); }} className="popover-action-btn">
          <User size={14} /> Profile
        </button>
        <button onClick={() => { navigate('/people?tab=friends'); onClose(); }} className="popover-action-btn">
          <Users size={14} /> Friends
          {friends.length > 0 && (
            <span style={{
              marginLeft: 'auto',
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              fontSize: 10,
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 99,
            }}>
              {friends.length}
            </span>
          )}
        </button>
        <button onClick={() => { navigate('/people'); onClose(); }} className="popover-action-btn">
          <Users size={14} /> Find People
          {pending.length > 0 && (
            <span style={{
              marginLeft: 'auto',
              background: 'var(--danger)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 99,
            }}>
              {pending.length}
            </span>
          )}
        </button>
      </div>
      <div style={{ padding: 4, borderTop: '1.5px solid var(--border)' }}>
        <button
          onClick={() => { logout(); onClose(); }}
          className="popover-action-btn"
          style={{ color: 'var(--danger)' }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}