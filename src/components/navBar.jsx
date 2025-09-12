import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { usePopup } from "./PopupContext";

const categories = [
  {
    label: "Shop All",
    to: "/shop-all",
  },
  {
    label: "About Us",
    to: "/about-us",
  },
  {
    label: "Blog",
    to: "/Blogs",
  },
  {
    label: "Contact Us",
    to: "/contact-us",
  },
  // {
  //   label: "Shop By Age",
  //   to: "/age",
  //   mega: [
  //     {
  //       title: "Babies (0–12m)",
  //       items: [
  //         { label: "Rattles", to: "/age/baby/rattles" },
  //         { label: "Soft Toys", to: "/age/baby/soft-toys" },
  //         { label: "Teethers", to: "/age/baby/teethers" },
  //       ],
  //     },
  //     {
  //       title: "Toddlers (1–3y)",
  //       items: [
  //         { label: "Ride‑ons", to: "/age/toddler/rideons" },
  //         { label: "Stack & Sort", to: "/age/toddler/stack" },
  //         { label: "Musical Toys", to: "/age/toddler/music" },
  //       ],
  //     },
  //     {
  //       title: "Kids (4–7y)",
  //       items: [
  //         { label: "STEM Kits", to: "/age/kids/stem" },
  //         { label: "Crafts", to: "/age/kids/crafts" },
  //         { label: "Puzzles", to: "/age/kids/puzzles" },
  //       ],
  //     },
  //     {
  //       title: "Big Kids (8y+)",
  //       items: [
  //         { label: "Robotics", to: "/age/bigkids/robotics" },
  //         { label: "Board Games", to: "/age/bigkids/boardgames" },
  //         { label: "Outdoor", to: "/age/bigkids/outdoor" },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "Pretend Play",
  //   to: "/pretend-play",
  //   list: [
  //     { label: "Kitchens & Food", to: "/pretend-play/kitchen" },
  //     { label: "Dollhouses & Dolls", to: "/pretend-play/dolls" },
  //     { label: "Dress‑up", to: "/pretend-play/dress-up" },
  //     { label: "Tool Sets", to: "/pretend-play/tools" },
  //   ],
  // },
  // {
  //   label: "Learning Toys",
  //   to: "/learning",
  //   list: [
  //     { label: "Alphabet & Numbers", to: "/learning/alphabet" },
  //     { label: "Building & Blocks", to: "/learning/blocks" },
  //     { label: "Science & STEM", to: "/learning/stem" },
  //     { label: "Montessori", to: "/learning/montessori" },
  //   ],
  // },
  // {
  //   label: "Trains & Vehicles",
  //   to: "/vehicles",
  //   list: [
  //     { label: "Wooden Trains", to: "/vehicles/trains" },
  //     { label: "Cars & Trucks", to: "/vehicles/cars" },
  //     { label: "Construction", to: "/vehicles/construction" },
  //     { label: "Remote Control", to: "/vehicles/rc" },
  //   ],
  // },
  // {
  //   label: "Gross motors & kids furniture",
  //   to: "/furniture",
  //   list: [
  //     { label: "Study Tables", to: "/furniture/tables" },
  //     { label: "Play Gyms", to: "/furniture/play-gyms" },
  //     { label: "Slides & Swings", to: "/furniture/slides" },
  //     { label: "Storage", to: "/furniture/storage" },
  //   ],
  // },
  // {
  //   label: "Other",
  //   to: "/other",
  //   list: [
  //     { label: "Party & Gifts", to: "/other/party" },
  //     { label: "Books", to: "/other/books" },
  //     { label: "Backpacks", to: "/other/backpacks" },
  //     { label: "Sale", to: "/other/sale" },
  //   ],
  // },
];

const TopNavBar = ({ cartCount = 0 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setShowPopup } = usePopup();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleQuickOpen = () => setShowPopup(true);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all ${scrolled ? "bg-white backdrop-blur" : "bg-white"
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* ROW: grid keeps logo perfectly centered */}
          <div className="grid h-16 grid-cols-3 items-center gap-3">
            {/* LEFT: search (md+) or menu (mobile) */}
            <div className="flex items-center">
              {/* Mobile menu */}
              <button
                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <FiMenu className="text-xl" />
              </button>

              {/* Desktop search */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 w-80 focus-within:ring-2 focus-within:ring-violet-300"
                role="search"
              >
                <FiSearch className="text-violet-800" aria-hidden />
                <input
                  name="q"
                  type="search"
                  placeholder="Search our store"
                  className="w-full bg-transparent text-sm placeholder-slate-400 focus:outline-none"
                />
              </form>
            </div>

            {/* CENTER: logo — always centered */}
            <div className="justify-self-center">
              <Link to="/" aria-label="Kiddies Kingdom home">
                <img
                  src="/kk_logo.webp"
                  alt="Kiddies Kingdom"
                  className="block h-10 w-auto md:h-14"
                />
              </Link>
            </div>

            {/* RIGHT: quick shop btn (align end) */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleQuickOpen}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-violet-200 px-4 py-2 text-sm font-medium text-[#d8a298] hover:bg-violet-50"
                title="Quick Shop"
              >
                <FiSearch />
                Quick Shop
              </button>
            </div>
          </div>
        </div>
        {/* Category strip */}
        <nav
          aria-label="Categories"
          className="border-t border-amber-100 bg-[#fff2ea]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ul className="hidden h-12 items-center justify-center gap-6 md:flex">
              <li className="flex items-stretch">
                <Link
                  to="/"
                  className="flex items-center text-base font-medium text-[#d8a298]"
                >
                  Home
                </Link>
              </li>

              {categories.map((cat) => (
                <li key={cat.label} className="group relative flex items-stretch">
                  <Link
                    to={cat.to}
                    className="flex items-center gap-1 text-base font-medium text-[#d8a298]"
                  >
                    {cat.label}
                    {(cat.mega || cat.list) && (
                      <FiChevronDown className="mt-px text-[18px]" />
                    )}
                  </Link>

                  {/* underline on active/hover */}
                  <span className="pointer-events-none absolute -bottom-[10px] h-[3px] w-0 bg-[#d8a298] transition-all duration-300 group-hover:w-10" />

                  {/* Mega menu */}
                  {cat.mega && (
                    <div className="invisible absolute left-0 top-full z-40 w-[780px] translate-y-2 rounded-lg border border-amber-100 bg-amber-50 p-5 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {cat.mega.map((col) => (
                          <div key={col.title}>
                            <p className="mb-2 text-sm font-bold text-[#d8a298]">{col.title}</p>
                            <ul className="space-y-1.5">
                              {col.items.map((i) => (
                                <li key={i.label}>
                                  <Link
                                    to={i.to}
                                    className="text-sm text-violet-800 hover:text-[#d8a298]"
                                  >
                                    {i.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Simple dropdown */}
                  {cat.list && (
                    <div className="invisible absolute left-0 top-full z-40 w-64 translate-y-2 rounded-lg border border-amber-100 bg-amber-50 p-3 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="space-y-1">
                        {cat.list.map((i) => (
                          <li key={i.label}>
                            <Link
                              to={i.to}
                              className="block rounded-md px-3 py-2 text-sm text-violet-800 hover:bg-white hover:text-[#d8a298]"
                            >
                              {i.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[85%] max-w-sm transform bg-white shadow-xl transition-transform md:hidden ${open ? "translate-x-0" : "-translate-x-full"
          }`}
        role="dialog"
        aria-label="Mobile Menu"
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <img src="/kk_logo.webp" alt="Kiddies Kingdom" className="h-7" />
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="mb-3 flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
            <FiSearch className="text-violet-800" />
            <input
              name="q"
              type="search"
              placeholder="Search our store"
              className="w-full bg-transparent text-sm placeholder-slate-400 focus:outline-none"
            />
          </form>

          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 font-medium text-[#d8a298] hover:bg-violet-50"
            >
              Home
            </Link>

            {categories.map((cat) => {
              const hasChildren = (cat.mega && cat.mega.length > 0) || (cat.list && cat.list.length > 0);

              // 1) SIMPLE LINK (no children) ➜ direct Link
              if (!hasChildren) {
                return (
                  <Link
                    key={cat.label}
                    to={cat.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 font-medium text-[#d8a298] hover:bg-violet-50"
                  >
                    {cat.label}
                  </Link>
                );
              }

              // 2) DROPDOWN (has children) ➜ details/summary
              const items = cat.mega ? cat.mega.flatMap((c) => c.items) : cat.list;

              return (
                <details key={cat.label} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 font-medium text-[#d8a298] hover:bg-violet-50">
                    {cat.label}
                    <FiChevronDown className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pl-3">
                    {items.map((i) => (
                      <Link
                        key={i.label}
                        to={i.to}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-violet-800 hover:bg-amber-50"
                      >
                        {i.label}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </nav>

        </div>
      </aside>

      {/* spacer */}
      <div className="h-16 md:h-[112px]" />
    </>
  );
};

export default TopNavBar;
