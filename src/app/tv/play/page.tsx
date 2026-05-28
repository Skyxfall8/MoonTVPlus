'use client';

import { ArrowLeft, ExternalLink, Layers, Maximize2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

import TVVirtualRemote from '@/components/tv/TVVirtualRemote';

function TVPlayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showControls, setShowControls] = useState(true);

  const originalUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return `/play?${params.toString()}`;
  }, [searchParams]);

  return (
    <main className='fixed inset-0 overflow-hidden bg-black text-white' onMouseMove={() => setShowControls(true)}>
      <iframe src={originalUrl} title='TV 播放器' className='h-full w-full border-0 bg-black' allow='autoplay; fullscreen; picture-in-picture' allowFullScreen />
      <div className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className='absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/85 to-transparent' />
        <div className='absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 to-transparent' />
      </div>
      <div className={`absolute left-6 right-6 top-6 flex items-center justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={() => router.back()} className='flex cursor-pointer items-center gap-3 rounded-2xl bg-black/70 px-5 py-4 text-2xl font-black outline-none backdrop-blur transition hover:bg-white/15 tv-focusable'>
          <ArrowLeft className='h-7 w-7' /> 返回
        </button>
        <div className='flex items-center gap-3 rounded-2xl bg-black/70 px-5 py-4 text-xl font-bold text-slate-200 backdrop-blur'>
          <Maximize2 className='h-6 w-6 text-rose-400' /> TV 全屏播放页
        </div>
      </div>
      <div className={`absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-3xl bg-black/75 p-4 backdrop-blur transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={() => setShowControls(false)} className='flex cursor-pointer items-center gap-2 rounded-2xl bg-white/10 px-6 py-4 text-xl font-bold outline-none hover:bg-white/20 tv-focusable'>
          <Layers className='h-6 w-6' /> 隐藏浮层
        </button>
        <a href={originalUrl} className='flex cursor-pointer items-center gap-2 rounded-2xl bg-rose-600 px-6 py-4 text-xl font-black outline-none hover:bg-rose-500 tv-focusable'>
          <ExternalLink className='h-6 w-6' /> 原播放页
        </a>
      </div>
      <TVVirtualRemote />
    </main>
  );
}

export default function TVPlayPage() {
  return <Suspense fallback={null}><TVPlayClient /></Suspense>;
}
