'use client';

import { Loader2, Radio } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import TVLayout from '@/components/tv/TVLayout';

type LiveSource = { key: string; name: string };
type LiveChannel = { id: string; name: string; group?: string; logo?: string };

export default function TVLivePage() {
  const router = useRouter();
  const [sources, setSources] = useState<LiveSource[]>([]);
  const [source, setSource] = useState<string>('');
  const [channels, setChannels] = useState<LiveChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/live/sources')
      .then((r) => r.json())
      .then((data) => {
        const list = data.data || [];
        setSources(list);
        if (list[0]?.key) setSource(list[0].key);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!source) return;
    setLoading(true);
    fetch(`/api/live/channels?source=${encodeURIComponent(source)}`)
      .then((r) => r.json())
      .then((data) => setChannels(data.data || []))
      .finally(() => setLoading(false));
  }, [source]);

  const groups = useMemo(() => Array.from(new Set(channels.map((c) => c.group || '其他'))).slice(0, 12), [channels]);

  return (
    <TVLayout>
      <section className='rounded-[42px] border border-white/10 bg-slate-950/70 p-10 shadow-2xl shadow-black/60'>
        <div className='flex items-center gap-4'>
          <Radio className='h-14 w-14 text-rose-500' />
          <div>
            <h1 className='text-6xl font-black'>直播</h1>
            <p className='mt-2 text-2xl text-slate-300'>选择频道后进入全屏直播播放页，频道列表作为播放层弹出。</p>
          </div>
        </div>
        <div className='mt-8 flex gap-4 overflow-x-auto px-4 py-4 [scrollbar-width:none]'>
          {sources.map((item) => (
            <button key={item.key} onClick={() => setSource(item.key)} className={`cursor-pointer rounded-2xl px-6 py-4 text-2xl font-bold outline-none transition tv-focusable ${source === item.key ? 'bg-rose-600 text-white' : 'bg-white/8 text-slate-200 hover:bg-white/12'}`}>{item.name}</button>
          ))}
        </div>
      </section>

      {loading ? <div className='mt-16 flex justify-center gap-4 text-2xl text-slate-300'><Loader2 className='h-8 w-8 animate-spin' />正在加载频道...</div> : (
        <div className='mt-10 grid grid-cols-[280px_1fr] gap-6'>
          <aside className='rounded-[32px] border border-white/10 bg-white/[0.04] p-4'>
            {groups.map((group) => <div key={group} className='rounded-2xl px-5 py-4 text-2xl font-bold text-slate-200'>{group}</div>)}
          </aside>
          <section className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            {channels.slice(0, 80).map((channel) => (
              <button key={channel.id} onClick={() => router.push(`/tv/live/play?source=${encodeURIComponent(source)}&id=${encodeURIComponent(channel.id)}`)} className='flex min-h-28 cursor-pointer items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-left outline-none transition hover:bg-white/12 tv-focusable'>
                {channel.logo ? <img src={channel.logo} alt='' className='h-14 w-14 rounded-xl object-contain' /> : <Radio className='h-12 w-12 text-rose-400' />}
                <div><div className='line-clamp-1 text-2xl font-black'>{channel.name}</div><div className='mt-1 text-lg text-slate-400'>{channel.group || '直播频道'}</div></div>
              </button>
            ))}
          </section>
        </div>
      )}
    </TVLayout>
  );
}
