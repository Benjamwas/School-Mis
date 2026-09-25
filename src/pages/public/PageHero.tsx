import React from 'react';

export function PageHero({ eyebrow, title, intro, image }: {eyebrow: string;title: string;intro: string;image?: string;}) {
  return (
    <section className="bg-forest-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold-300">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-[34px] sm:text-[46px] leading-[1.08]">{title}</h1>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-forest-100/90">{intro}</p>
        </div>
        {image && <img src={image} alt="" className="w-full aspect-[16/10] object-cover rounded-card" />}
      </div>
    </section>);

}