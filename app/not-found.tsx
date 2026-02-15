export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center magenta-gradient glass text-white">
      <h1 className="text-7xl font-extrabold magenta-text mb-4 drop-shadow-lg">
        404
      </h1>
      <p className="text-2xl font-semibold mb-8">Page Not Found</p>
      <a
        href="/"
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold shadow-2xl hover:from-pink-500 hover:to-fuchsia-500 transition-colors text-lg"
      >
        Go Home
      </a>
    </div>
  );
}
