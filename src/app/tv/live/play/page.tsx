'use client';

import { ArrowLeft, ExternalLink, Radio } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

import TVVirtualRemote from '@/components/tv/TVVirtualRemote';

function TVLivePlayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPanel, setShowPanel] = useState(true);
  const originalUrl = useMemo(() => `/live?${new URLSearchParams(searchParams.toString()).toString()}`, [searchParams]);

  return (
    <main className='fixed inset-0 overflow-hidden bg-black text-white' onMouseMove={() => setShowPanel(true)}>
      <iframe src={originalUrl} title='TV 直播播放器' className='h-full w-full border-0 bg-black' allow='autoplay; fullscreen; picture-in-picture' allowFullScreen />
      <div className={`absolute left-6 right-6 top-6 flex items-center justify-between transition-opacity duration-300 ${showPanel ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={() => router.back()} className='flex cursor-pointer items-center gap-3 rounded-2xl bg-black/70 px-5 py-4 text-2xl font-black outline-none backdrop-blur transition hover:bg-white/15 tv-focusable'>
          <ArrowLeft className='h-7 w-7' /> 返回频道
        </button>
        <div className='flex items-center gap-3 rounded-2xl bg-black/70 px-5 py-4 text-xl font-bold backdrop-blur'><Radio className='h-6 w-6 text-rose-400' /> TV 全屏直播页</div>
      </div>
      <div className={`absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 rounded-3xl bg-black/75 p-4 backdrop-blur transition-opacity duration-300 ${showPanel ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={() => setShowPanel(false)} className='cursor-pointer rounded-2xl bg-white/10 px-6 py-4 text-xl font-bold outline-none hover:bg-white/20 tv-focusable'>隐藏浮层</button>
        <a href={originalUrl} className='flex cursor-pointer items-center gap-2 rounded-2xl bg-rose-600 px-6 py-4 text-xl font-black outline-none hover:bg-rose-500 tv-focusable'><ExternalLink className='h-6 w-6' /> 原直播页</a>
      </div>
      <TVVirtualRemote />
    </main>
  );
}

export default function TVLivePlayPage() {
  return <Suspense fallback={null}><TVLivePlayClient /></Suspense>;
}
