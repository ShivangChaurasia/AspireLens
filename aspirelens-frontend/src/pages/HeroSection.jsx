import Login from "./Login.jsx";

export default function HeroSection() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-20 py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto text-center">

        {/* Eyebrow/badge - creates hierarchy */}
        <div className="inline-block mb-6">
          <span className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-semibold rounded-full text-sm md:text-base shadow-lg">
            🚀 Intelligent Exploration
          </span>
        </div>

        {/* Main heading - high contrast */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="block text-gray-900">See the World Through</span>
          <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
            a Smarter Lens
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
          <span className="font-semibold text-gray-900">AspireLens</span> helps you explore, map, and understand your surroundings with clarity and purpose.
          <br />
          <span className="text-lg md:text-xl text-gray-600 italic mt-2 block">
            Discover smarter. Act faster. Live better.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a href="/Login"><button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto">
            Evalute Your Career
          </button></a>
        </div>

        {/* Stats/Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="text-3xl text-blue-600 mb-2">🧭</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Smart Navigation</h3>
            <p className="text-gray-600">Intuitive mapping with AI-powered insights</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100">
            <div className="text-3xl text-amber-600 mb-2">⚡</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Real-Time Analysis</h3>
            <p className="text-gray-600">Process information instantly for faster decisions</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-cyan-100">
            <div className="text-3xl text-cyan-600 mb-2">🎯</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Purpose-Driven</h3>
            <p className="text-gray-600">Tools designed with your goals in mind</p>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-200">
          <p className="text-gray-500 text-sm md:text-base mb-6">Trusted by forward-thinking individuals and teams</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <div className="text-gray-700 font-semibold">Explorers</div>
            <div className="text-gray-700 font-semibold">Researchers</div>
            <div className="text-gray-700 font-semibold">Educators</div>
            <div className="text-gray-700 font-semibold">Analysts</div>
            <div className="text-gray-700 font-semibold">Creators</div>
          </div>
        </div>

      </div>
    </section>
    )

}