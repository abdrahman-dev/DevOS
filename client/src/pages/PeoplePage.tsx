import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, ExternalLink, Check, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { profileService } from '../services/profile';
import { friendsService } from '../services/friends';
import { useFriendsStore } from '../store/friendsStore';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useToast } from '../hooks/useToast';
import EmptyState from '../components/ui/EmptyState';
import ToastContainer from '../components/ui/Toast';
import type { UserProfile } from '../services/profile';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function PeoplePage() {
  useRequireAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'search';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const navigate = useNavigate();
  const friends = useFriendsStore((s) => s.friends);
  const pending = useFriendsStore((s) => s.pending);
  const loadFriends = useFriendsStore((s) => s.loadFriends);
  const loadPending = useFriendsStore((s) => s.loadPending);
  const respond = useFriendsStore((s) => s.respond);
  const removeFriend = useFriendsStore((s) => s.remove);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.title = 'People — DevOS';
    loadFriends();
    loadPending();
  }, [loadFriends, loadPending]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await profileService.searchProfiles(q);
      setResults(res.users);
    } catch (err: any) {
      showToast(err.message ?? 'Search failed', 'error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  const handleSendRequest = async (user: UserProfile) => {
    try {
      await friendsService.send(user._id);
      showToast(`Request sent to ${user.name}`, 'success');
    } catch (err: any) {
      showToast(err.message ?? 'Failed to send request', 'error');
    }
  };

  const handleRespond = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      await respond(requestId, action);
      showToast(action === 'accept' ? 'Request accepted' : 'Request rejected', 'success');
    } catch (err: any) {
      showToast(err.message ?? 'Failed to respond', 'error');
    }
  };

  const isFriend = (userId: string) => friends.some((f) => f._id === userId);

  const handleRemoveFriend = async (userId: string) => {
    try {
      await removeFriend(userId);
      showToast('Friend removed', 'info');
    } catch (err: any) {
      showToast(err.message ?? 'Failed to remove friend', 'error');
    }
  };

  const switchTab = (t: string) => setSearchParams(t === 'search' ? {} : { tab: t });

  return (
    <motion.div
      className="people-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <div className="profile-tab-header" style={{ marginBottom: 20 }}>
        <button
          className={`profile-tab-btn${tab === 'search' ? ' active' : ''}`}
          onClick={() => switchTab('search')}
        >
          Search
        </button>
        <button
          className={`profile-tab-btn${tab === 'friends' ? ' active' : ''}`}
          onClick={() => switchTab('friends')}
        >
          Friends ({friends.length})
        </button>
        <button
          className={`profile-tab-btn${tab === 'pending' ? ' active' : ''}`}
          onClick={() => switchTab('pending')}
        >
          Pending {pending.length > 0 && `(${pending.length})`}
        </button>
      </div>

      {tab === 'search' && (
        <>
          <div className="people-search-wrap">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-2)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people by name or username…"
                style={{ paddingLeft: 36, fontSize: 14 }}
              />
            </div>
          </div>

          {loading && <div className="loading-bar" />}

          {query.length === 0 && !loading && (
            <EmptyState message="Search for developers by name or username" />
          )}

          {query.length > 0 && query.length < 2 && !loading && (
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Type at least 2 characters to search.</p>
          )}

          {query.length >= 2 && !loading && results.length === 0 && (
            <EmptyState message={`No users found for '${query}'`} />
          )}

          {results.length > 0 && (
            <div className="user-search-grid">
              {results.map((user) => (
                <div key={user._id} className="user-search-card card-hover">
                  <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: 'var(--accent-subtle)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                    {user.avatar
                      ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : user.name?.[0]?.toUpperCase() ?? '?'
                    }
                  </div>
                  <div className="user-search-info">
                    <div className="user-search-name">{user.name}</div>
                    {user.username && <div className="user-search-username">@{user.username}</div>}
                    {user.bio && <div className="user-search-bio">{user.bio}</div>}
                  </div>
                  <div className="user-search-actions">
                    <button
                      onClick={() => {
                        if (user.username) navigate(`/profile/${user.username}`);
                        else showToast('This user has no public profile yet', 'info');
                      }}
                      style={{ fontSize: 12, padding: '6px 10px', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}
                      className="btn-ghost"
                    >
                      <ExternalLink size={12} />
                    </button>
                    {user._id && (
                      <button
                        className="btn-primary"
                        onClick={() => handleSendRequest(user)}
                        disabled={isFriend(user._id)}
                        style={{ fontSize: 12, padding: '6px 12px', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}
                      >
                        <UserPlus size={13} /> {isFriend(user._id) ? 'Friends' : 'Add'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'friends' && (
        friends.length === 0
          ? <EmptyState message="No friends yet — find developers to connect with" />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {friends.map((friend) => (
                <div key={friend._id} className="user-search-card">
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: 'var(--accent-subtle)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                    {friend.avatar
                      ? <img src={friend.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : friend.name?.[0]?.toUpperCase() ?? '?'
                    }
                  </div>
                  <div className="user-search-info">
                    <div className="user-search-name">{friend.name}</div>
                    {friend.username && <div className="user-search-username">@{friend.username}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn-ghost"
                      onClick={() => {
                        if (friend.username) {
                          navigate(`/profile/${friend.username}`);
                        } else {
                          showToast('This user has no public username yet', 'info');
                        }
                      }}
                      style={{ fontSize: 12, padding: '5px 10px', minHeight: 'auto' }}
                    >
                      View
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleRemoveFriend(friend._id)}
                      style={{ fontSize: 12, padding: '5px 10px', minHeight: 'auto' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
      )}

      {tab === 'pending' && (
        pending.length === 0
          ? <EmptyState message="No pending requests" />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pending.map((req) => (
                <div key={req._id} className="user-search-card">
                  <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: 'var(--accent-subtle)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                    {req.from.avatar
                      ? <img src={req.from.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : req.from.name?.[0]?.toUpperCase() ?? '?'
                    }
                  </div>
                  <div className="user-search-info">
                    <div className="user-search-name">{req.from.name}</div>
                    {req.from.username && <div className="user-search-username">@{req.from.username}</div>}
                  </div>
                  <div className="user-search-actions" style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn-confirm"
                      onClick={() => handleRespond(req._id, 'accept')}
                      style={{ fontSize: 12, padding: '6px 10px', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Check size={13} /> Accept
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleRespond(req._id, 'reject')}
                      style={{ fontSize: 12, padding: '6px 10px', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
