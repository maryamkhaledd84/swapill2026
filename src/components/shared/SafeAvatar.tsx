import { useEffect, useState } from 'react';
import { getAvatarGradient, getInitials } from '../../utils/avatarColor';

interface SafeAvatarProps {
  name: string;
  src?: string | null;
  /** Pixel size — width and height in px */
  size?: number;
  /** Any extra Tailwind classes appended to the wrapper */
  className?: string;
  /** Optional title attribute (tooltip) */
  title?: string;
}

/**
 * Avatar with a stable fixed box at all times.
 *
 * - Always renders the gradient + initials placeholder as the base layer, so
 *   the box has the right dimensions and a sensible visual even before the
 *   image loads.
 * - When a usable src is provided, the image is overlaid on top. We start
 *   with opacity 0 and fade it in on `load`. If `error` fires, we leave it
 *   hidden so the placeholder underneath remains visible.
 */
export default function SafeAvatar({
  name,
  src,
  size = 64,
  className = '',
  title,
}: SafeAvatarProps) {
  const safeName = (name || 'Member').trim() || 'Member';
  const gradient = getAvatarGradient(safeName);
  const initials = getInitials(safeName);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgErrored, setImgErrored] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    setImgErrored(false);
  }, [src]);

  const isDicebear = !!src && src.includes('dicebear.com');
  const useImage = !!src && !isDicebear && !imgErrored;

  const dimStyle = { width: size, height: size };
  const fontSize = Math.max(11, Math.round(size * 0.36));

  return (
    <div
      title={title || safeName}
      style={dimStyle}
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} border border-white/10 shadow-md overflow-hidden flex-shrink-0 ${className}`}
    >
      <span className="text-white font-semibold leading-none select-none" style={{ fontSize }}>
        {initials}
      </span>

      {useImage && (
        <img
          src={src!}
          alt={safeName}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgErrored(true)}
          style={{
            ...dimStyle,
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 200ms ease',
          }}
          className="absolute inset-0 w-full h-full object-cover rounded-full"
        />
      )}
    </div>
  );
}
