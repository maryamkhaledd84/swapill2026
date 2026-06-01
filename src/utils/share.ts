import toast from 'react-hot-toast';

export interface ShareTarget {
  url: string;
  title?: string;
  text?: string;
}

function legacyCopy(text: string): boolean {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.left = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export async function shareOrCopy(target: ShareTarget): Promise<void> {
  const fullUrl = target.url.startsWith('http')
    ? target.url
    : `${window.location.origin}${target.url.startsWith('/') ? '' : '/'}${target.url}`;

  const payload = { title: target.title, text: target.text, url: fullUrl };

  // Try Web Share API first (mobile / supported desktop)
  if (typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function') {
    try {
      await (navigator as any).share(payload);
      return;
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      // fall through to clipboard
    }
  }

  // Try modern clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Link copied to clipboard');
      return;
    } catch {
      // fall through to legacy copy
    }
  }

  // Legacy fallback for non-secure contexts / older browsers
  if (legacyCopy(fullUrl)) {
    toast.success('Link copied to clipboard');
    return;
  }

  // Last resort: show the link so the user can copy it manually
  toast((t) => `Copy this link: ${fullUrl}`, { duration: 8000 });
}

export function profileShareUrl(userId: string): string {
  return `/profile/${userId}`;
}
