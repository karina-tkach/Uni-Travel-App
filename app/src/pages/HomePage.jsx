export default function HomePage() {
    return (
        <section className="relative w-full h-[90vh] flex items-center justify-start">
            <img
                src="/train.jpg"
                alt="Train Travel"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 mx-10">
            <div className="
        bg-white/20
        backdrop-blur-xl
        p-16
        rounded-3xl
        text-center
        shadow-xl
      ">
                <h1 className="text-white text-5xl md:text-5xl font-light leading-snug tracking-widest">
                    Друзі, квитки і<br />
                    пригоди —<br />
                    усе на UniTravel
                </h1>
            </div>
                <a href="/offers"
                    className="
    mt-6
    bg-[#345185]
    hover:bg-[#2b416c]
    text-white
    px-6 py-3
    rounded-xl
    transition
    text-2xl
    font-thin
    inline-block
  "
                >
                    Почни подорож зараз
                </a>
            </div>
        </section>
    );
}
