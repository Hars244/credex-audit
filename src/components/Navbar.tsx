export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">₿</span>
          </div>
          <span className="font-bold text-white text-lg">SpendScan</span>
          <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
            by Credex
          </span>
        </a>
        <a
          href="https://credex.rocks"
          target="_blank"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Get AI credits cheaper →
        </a>
      </div>
    </nav>
  );
}