// Single source of truth for avatar gradient colors so the same person
// shows the same color everywhere in the app.

const GRADIENTS = [
  'from-purple-500 to-violet-600',
  'from-blue-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-green-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-sky-600',
  'from-red-500 to-rose-600',
  'from-teal-500 to-cyan-600',
];

export function getAvatarGradient(seed?: string | null): string {
  const safe = (seed || 'Member').trim() || 'Member';
  let hash = 0;
  for (let i = 0; i < safe.length; i++) {
    hash = (hash * 31 + safe.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

export function getInitials(name?: string | null): string {
  const safe = (name || 'Member').trim();
  return safe
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
