import g1 from '@/assets/test.png';
import g2 from '@/assets/test.png';
import g3 from '@/assets/test.png';


const photos = [
  { src: g1, alt: 'Banda em formação durante desfile cívico', span: 'md:col-span-2 md:row-span-2' },
  { src: g2, alt: 'Detalhe de uniforme e instrumentos de sopro', span: '' },
  { src: g3, alt: 'Baterista marcando o ritmo da marcha', span: 'md:col-span-2' },

];

export function Gallery() {
  return (
    <section id="galeria" className="py-16 sm:py-24">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Galeria
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Momentos que <span className="text-gradient">marcam</span>.
          </h2>
        </div>

        <div className="mt-8 grid auto-rows-[140px] grid-cols-2 gap-2 sm:mt-12 sm:auto-rows-[180px] sm:gap-3 md:grid-cols-4 md:auto-rows-[200px]">
          {photos.map((p, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-2xl ${p.span}`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
