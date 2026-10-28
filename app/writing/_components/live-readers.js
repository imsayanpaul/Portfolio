'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Public browser credentials; never use a secret or service-role key here.
const url = 'https://ubdxfaedqlezdtbglnfo.supabase.co';
const key = 'sb_publishable_he0Dj--RycP8mc4xWZBs4A_1wpQqm6A';

export default function LiveReaders() {
  const [count, setCount] = useState(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    let visitor = crypto.randomUUID();
    try {
      visitor = localStorage.getItem('notes-reader-id') || visitor;
      localStorage.setItem('notes-reader-id', visitor);
    } catch { /* Count this tab independently if storage is blocked. */ }
    const live = ['sayanpaul.in', 'www.sayanpaul.in'].includes(location.hostname);
    const topic = live ? 'notes-readers' : 'notes-readers-preview-' + location.host;
    let channel;
    let disposed = false;
    function disconnect() {
      const previous = channel;
      channel = null;
      if (previous) void client.removeChannel(previous);
    }
    function connect() {
      disconnect();
      setCount(null);
      if (disposed || document.visibilityState !== 'visible') return;
      setUnavailable(false);
      const current = client.channel(topic, { config: { presence: { key: crypto.randomUUID() } } });
      channel = current;
      current.on('presence', { event: 'sync' }, () => {
        if (disposed || channel !== current) return;
        const readers = new Set(Object.values(current.presenceState()).flat().map(entry => entry.reader).filter(value => typeof value === 'string'));
        setCount(readers.size);
        setUnavailable(false);
      }).subscribe(async status => {
        if (disposed || channel !== current) return;
        if (status === 'SUBSCRIBED') {
          const result = await current.track({ reader: visitor });
          if (channel === current && result !== 'ok') { setCount(null); setUnavailable(true); }
        } else if (['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(status)) {
          setCount(null);
          setUnavailable(true);
        }
      });
    }
    const offline = () => { disconnect(); setCount(null); setUnavailable(true); };
    connect();
    document.addEventListener('visibilitychange', connect);
    window.addEventListener('online', connect);
    window.addEventListener('offline', offline);
    window.addEventListener('pagehide', disconnect);
    window.addEventListener('pageshow', connect);
    return () => {
      disposed = true;
      disconnect();
      document.removeEventListener('visibilitychange', connect);
      window.removeEventListener('online', connect);
      window.removeEventListener('offline', offline);
      window.removeEventListener('pagehide', disconnect);
      window.removeEventListener('pageshow', connect);
    };
  }, []);

  return <div className="live-readers mono" data-connected={count !== null} title="Active browsers across all study notes, including you. Hidden tabs are excluded; disconnects can take a moment to update."><span className="reader-dot" aria-hidden="true" /><span>{count === null ? unavailable ? 'Live count unavailable' : 'Connecting to readers…' : `${count} ${count === 1 ? 'person' : 'people'} reading notes now`}</span></div>;
}
