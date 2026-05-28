'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { addSearchHistory, getSearchHistory } from '@/lib/db.client';

import TVLayout from '@/components/tv/TVLayout';

const hot = ['庆余年', '流浪地球', '繁花', '甄嬛传', '鬼灭之刃', '歌手', '三体', '权力的游戏'];

export default function TVSearchPage() {
  const [keyword, setKeyword] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    getSearchHistory().then(setHistory).catch(() => setHistory([]));
  }, []);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const q = keyword.trim();
    if (q) {
      addSearchHistory(q).catch(() => undefined);
      router.push(`/tv/play?title=${encodeURIComponent(q)}`);
    }
  };

  return (
    <TVLayout>
      <section className='mx-auto max-w-6xl rounded-[42px] border border-white/10 bg-slate-950/70 p-10 shadow-2xl shadow-black/60'>
        <h1 className='text-6xl font-black'>搜索</h1>
        <p className='mt-4 text-2xl text-slate-300'>输入片名后直接进入 TV 全屏播放页，后续可接入屏幕键盘。</p>
        <form onSubmit={submit} className='mt-10 flex gap-4'>
          <label className='sr-only' htmlFor='tv-search'>搜索片名</label>
          <input
            id='tv-search'
            autoFocus
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='输入电影、剧集、动漫、综艺名称'
            className='h-20 flex-1 rounded-3xl border border-white/10 bg-white/10 px-8 text-3xl text-white outline-none placeholder:text-slate-500 focus:border-rose-500 tv-focusable'
          />
          <button type='submit' className='flex h-20 cursor-pointer items-center gap-3 rounded-3xl bg-rose-600 px-10 text-3xl font-black text-white outline-none transition hover:bg-rose-500 tv-focusable'>
            <Search className='h-9 w-9' /> 搜索
          </button>
        </form>
      </section>
      {history.length > 0 && (
        <section className='mx-auto mt-12 max-w-6xl'>
          <h2 className='text-4xl font-black'>搜索历史</h2>
          <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
            {history.slice(0, 20).map((item) => (
              <button key={item} onClick={() => router.push(`/tv/play?title=${encodeURIComponent(item)}`)} className='cursor-pointer rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-5 text-2xl font-bold text-white outline-none transition hover:bg-white/12 tv-focusable'>
                {item}
              </button>
            ))}
          </div>
        </section>
      )}
      <section className='mx-auto mt-12 max-w-6xl'>
        <h2 className='text-4xl font-black'>热门搜索</h2>
        <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
          {hot.map((item) => (
            <button key={item} onClick={() => router.push(`/tv/play?title=${encodeURIComponent(item)}`)} className='cursor-pointer rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-5 text-2xl font-bold text-white outline-none transition hover:bg-white/12 tv-focusable'>
              {item}
            </button>
          ))}
        </div>
      </section>
    </TVLayout>
  );
}
