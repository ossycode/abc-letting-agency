import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="ABC Lettings"
      className="inline-flex items-center space-x-2"
    >
      <span className="font-display text-md sm:text-2xl font-extrabold tracking-wide text-slate-200">
        ABC Lettings
      </span>
    </Link>
  );
};
