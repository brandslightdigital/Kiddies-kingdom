import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiStar,
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiBox,
  FiLayers,
  FiCalendar,
  FiMaximize,
  FiDroplet,
  FiPackage,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import ProductEnquiryForm from "./ProductEnquiryForm";

/* ---------------- Helpers ---------------- */

const formatINR = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      })
    : n;

const discountPct = (mrp, price) =>
  mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

const Stars = ({ value = 0 }) => {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} className={i < full ? "fill-amber-300" : ""} />
      ))}
    </div>
  );
};

/* ---------------- SpecGrid (Product Details) ---------------- */

const SpecGrid = ({ specs = [] }) => {
  const iconMap = {
    material: FiBox,
    "recommended age": FiCalendar,
    "included pieces": FiLayers,
    "tray size": FiMaximize,
    color: FiDroplet,
    packaging: FiPackage,
    care: FiRefreshCw,
    "what's not included": FiAlertCircle,
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h3 className="text-slate-900">Product Details</h3>
      </div>

      {/* Responsive auto-fit grid */}
      <dl className="grid gap-3 p-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        {specs.map((s, i) => {
          const Icon = iconMap[s.label?.toLowerCase?.()] || null;
          return (
            <div
              key={i}
              className="group h-full rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm transition hover:bg-white hover:shadow"
            >
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
                <span className="truncate">{s.label}</span>
              </dt>
              <dd className="mt-1.5 min-w-0 text-sm leading-snug text-slate-900 break-words">
                {s.value}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

/* ---------------- Related Slider ---------------- */

const RelatedSlider = ({ items = [] }) => {
  const ref = React.useRef(null);
  const scrollBy = (dx) =>
    ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  if (!items.length) return null;

  return (
    <section className="mt-14">
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] text-slate-900">Related products</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-320)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-800"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => scrollBy(320)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-800"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="mt-4 flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p) => (
          <Link
            key={p.id}
            to={p.url}
            className="min-w-[240px] max-w-[240px] rounded-2xl border border-slate-200 bg-white"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100">
              <img
                src={p.thumbnail || p.image}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-3">
              <div className="line-clamp-2 text-sm text-slate-900">
                {p.title}
              </div>
              <div className="mt-2 text-slate-800">{formatINR(p.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

/* ---------------- Main Page ---------------- */

/* ---------------- Main Page ---------------- */
export default function ProductDetail() {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [state, setState] = useState("loading");
  const [selImg, setSelImg] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  // Modal state for enquiry
  const [showModal, setShowModal] = useState(false);

  const handleEnquiry = () => {
    setShowEnquiryModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close enquiry modal
  };

  const handleWhatsApp = () => {
    const message = `Hi, I have an enquiry about the product: ${product.title}.`;
    const whatsappURL = `https://wa.me/919877047723?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank"); // Open WhatsApp in a new tab
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/data.json", { cache: "no-store" });
        const json = await res.json();
        if (mounted) {
          setData(Array.isArray(json) ? json : []);
          setState("idle");
        }
      } catch (e) {
        console.error(e);
        setState("error");
      }
    })();
    return () => (mounted = false);
  }, []);

  const product = useMemo(
    () => data.find((p) => p.slug === slug || p.url?.endsWith(slug)),
    [data, slug]
  );

  const related = useMemo(() => {
    if (!product) return [];
    const relIds = new Set(product.related || []);
    return data.filter((p) => relIds.has(p.id));
  }, [data, product]);

  if (state === "loading") {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-16">
        <div className="h-64 animate-pulse rounded-2xl bg-[#faf7f2]" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-16">
        <p className="text-slate-600">Product not found.</p>
      </main>
    );
  }

  const imgs = product.gallery?.length
    ? product.gallery
    : [product.thumbnail || product.image];
  const pct = discountPct(product.mrp, product.price);

  return (
    <main className="bg-[#FFFDFB]">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-16">
        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-500">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          <span>/</span>{" "}
          <Link to="/shop-all" className="hover:underline">
            Shop
          </Link>{" "}
          <span>/</span> <span className="text-slate-800">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* Left: sticky images */}
          <div className="lg:sticky lg:top-20 self-start">
            <div className="grid grid-cols-[70px_1fr] gap-4">
              {/* thumbnails */}
              <div className="flex flex-col gap-3">
                {imgs.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setSelImg(i)}
                    className={`overflow-hidden rounded-xl ring-1 ring-slate-200 ${
                      i === selImg ? " outline-2 outline-violet-400" : ""
                    }`}
                  >
                    <img src={src} alt="" className="h-16 w-16 object-cover" />
                  </button>
                ))}
              </div>

              {/* main image */}
              <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white">
                <div className="aspect-[4/3] sm:aspect-[4/3]">
                  <img
                    src={imgs[selImg]}
                    alt={product.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div className="lg:min-h-[70vh]">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
              {product.category}
            </span>

            <h1 className="text-[28px] md:text-[34px] leading-tight text-slate-900">
              {product.title}
            </h1>

            {/* rating + reviews + stock */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2">
                <Stars value={product.rating} />
                <span className="text-slate-700">
                  {Number(product.rating || 0).toFixed(1)}
                </span>
                <span className="text-slate-500">
                  ({product.reviews} reviews)
                </span>
              </span>
              <span className="mx-2 hidden sm:inline-block text-slate-300">
                |
              </span>
              <span className="inline-flex items-center gap-2 text-slate-600">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    product.inStock ? "bg-[#4F9F5B]" : "bg-slate-300"
                  }`}
                />
                {product.inStock ? "In stock" : "Out of stock"}
              </span>
            </div>

            {/* price row */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="text-2xl font-semibold text-slate-900">
                {formatINR(product.price)}
              </div>
              {product.mrp && product.mrp > product.price && (
                <>
                  <div className="text-lg text-slate-500 line-through">
                    {formatINR(product.mrp)}
                  </div>
                  <span className="rounded-full bg-[#EAF4F2] px-3 py-1 text-sm text-[#276D55] ring-1 ring-[#CDE7E1]">
                    {pct}% OFF
                  </span>
                </>
              )}
            </div>

            {/* info stripe */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
              <div className="inline-flex items-center gap-2">
                <FiTruck /> {product.shipInfo || "Fast shipping across India"}
              </div>
              <div className="inline-flex items-center gap-2">
                <FiShield /> {product.warranty || "Quality checked"}
              </div>
            </div>

            {/* badges */}
            {product.badges?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
            ) : null}

            {/* short description */}
            {product.shortDescription && (
              <p className="mt-5 text-slate-700">{product.shortDescription}</p>
            )}

            {/* highlights */}
            {product.highlights?.length ? (
              <div className="mt-6">
                <h3 className="text-slate-900">Highlights</h3>
                <ul className="mt-2 space-y-2 text-slate-700">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FiCheckCircle className="mt-0.5 text-[#6FB08B]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Product Details: new SpecGrid */}
            {product.specifications?.length ? (
              <SpecGrid specs={product.specifications} />
            ) : null}

            {/* Buttons: Enquiry and WhatsApp */}
            <div className="mt-8 flex flex-wrap gap-5 ">
              {/* Enquiry Button */}
              <button
                onClick={handleEnquiry}
                className="inline-flex items-center justify-center rounded-xl bg-[#ef927d] px-8 py-4 text-white text-lg font-semibold transition-all duration-300 ease-in-out transform hover:bg-[#c6634d] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#6B63C8] focus:ring-opacity-50"
              >
                Enquire about this product
              </button>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center rounded-xl border border-[#ef927d] px-8 py-4 text-lg font-semibold text-[#4CAF50] transition-all duration-300 ease-in-out transform hover:bg-[#ef927d] hover:text-[#ffff] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-50"
              >
                WhatsApp us
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        <RelatedSlider items={related} />
      </section>
      <ProductEnquiryForm
        product={product}
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />
    </main>
  );
}
