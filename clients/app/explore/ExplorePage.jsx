"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import Image from "next/image";
import api from "@/lib/api";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { FiSearch, FiUsers, FiFilter, FiX } from "react-icons/fi";
import { MdVerified } from "react-icons/md";

export default function ExplorePage() {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    gender: "all",
    min_age: "",
    max_age: "",
    marital_status: "",
    relationship_type: "",
    job: "",
    verified: false,
    keyword: "",
    sort: "newest",
  });

  useEffect(() => {
    fetchAds(true);
  }, []);
  useEffect(() => {
  const delay = setTimeout(() => {
    fetchAds(true);
  }, 400); // debounce 400ms

  return () => clearTimeout(delay);
}, [filters.keyword]);

  async function fetchAds(reset = false) {
    if (reset) setInitialLoading(true);
    setLoading(true);

    try {
      const params = {
        gender: filters.gender,
        min_age: filters.min_age || undefined,
        max_age: filters.max_age || undefined,
        marital_status: filters.marital_status || undefined,
        relationship_type: filters.relationship_type || undefined,
        job: filters.job || undefined,
        verified: filters.verified ? "true" : undefined,
        keyword: filters.keyword || undefined,
        sort: filters.sort,
        cursor: reset ? undefined : nextCursor,
        limit: 10,
      };

      const res = await api.get("/search", { params });

      if (reset) {
        setItems(res.data.items);
      } else {
        setItems((prev) => [...prev, ...res.data.items]);
      }

      setNextCursor(res.data.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setShowFilters(false);
    }
  }

  function handleChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function applyFilters() {
    fetchAds(true);
  }

  return (
    <section className="py-10 bg-white min-h-screen relative">
      <Container className="max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Explore Profiles</h1>
            <p className="text-sm text-zinc-600 mt-1">
              Discover active relationship listings.
            </p>
          </div>

          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 w-auto rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none hover:bg-zinc-50"
          >
            <FiFilter />
            Filters
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchAds(true);
          }}
          className="flex items-center gap-2 border border-zinc-200 rounded-xl px-4 py-3 bg-zinc-50"
        >
          <FiSearch className="text-zinc-400" />
          <input
            type="text"
            placeholder="Search title or description..."
            value={filters.keyword}
            onChange={(e) => handleChange("keyword", e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </form>

        <div
          className={`fixed inset-0 z-50 md:hidden transition ${
            showFilters ? "visible" : "invisible"
          }`}
        >
          <div
            onClick={() => setShowFilters(false)}
            className={`absolute inset-0 bg-black/40 transition ${
              showFilters ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`absolute left-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto transition-transform duration-300 ${
              showFilters ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg">Filters</h2>
              <FiX
                size={20}
                className="cursor-pointer"
                onClick={() => setShowFilters(false)}
              />
            </div>

            <FilterFields
              filters={filters}
              handleChange={handleChange}
              applyFilters={applyFilters}
              setShowFilters={setShowFilters}
              isDesktop
              loading={loading}
            />
          </div>
        </div>

        {showFilters && (
          <div className="hidden md:block border border-zinc-200 rounded-xl p-6 bg-white shadow-sm relative">
            <FilterFields
              filters={filters}
              handleChange={handleChange}
              applyFilters={applyFilters}
              setShowFilters={setShowFilters}
              isDesktop
              loading={loading}
            />
          </div>
        )}

        {initialLoading && (
          <div className="text-center py-16 text-zinc-500">
            Loading profiles...
          </div>
        )}

        {!initialLoading && items.length === 0 && (
          <div className="flex flex-col items-center py-20 text-zinc-500">
            <FiUsers size={40} className="mb-4 opacity-60" />
            <h3 className="font-semibold text-lg">No profiles found</h3>
            <p className="text-sm mt-2">
              Try adjusting filters or search keyword.
            </p>
          </div>
        )}

        <div className="space-y-5 md:hidden">
          {items.map((item, index) => (
            <Link
              key={index}
              href={`/user/${item?.username}`}
              className="flex gap-4 p-4 rounded-xl border border-zinc-200"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-100">
                {item?.avatarUrl && (
                  <Image
                    src={item?.avatarUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-sm">
                    {item?.fullName || `@${item?.username}`}
                  </h3>
                  {item?.verified && (
                    <div className="relative group flex items-center">
                      <span className="inline-flex items-center justify-center text-blue-600">
                        <MdVerified className="text-md" />
                      </span>

                      <div className="absolute top-full mt-1 hidden md:group-hover:block bg-zinc-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow">
                        Verified Profile
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-sm flex items-center space-x-0.5">
                  <p className="bg-fuchsia-200 text-fuchsia-900 px-1 rounded-sm capitalize">
                    {item?.age} yrs
                  </p>

                  <p className="bg-emerald-200 text-emerald-900 px-1 rounded-sm capitalize">
                    {item?.maritalStatus}
                  </p>
                  <p
                    className={`!px-3 !py-[1px] rounded-sm capitalize
                          ${
                            item?.gender === "male"
                              ? "bg-cyan-100 text-cyan-700"
                              : item?.gender === "female"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-purple-100 text-purple-700"
                          }
                        `}
                  >
                    {item?.gender}
                  </p>
                </div>
                <p className="text-xs font-semibold space-x-0.5 text-zinc-600 capitalize">
                  {item?.currentJob}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <Link
              key={index}
              href={`/user/${item?.username}`}
              className="border border-zinc-200 rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <div className="flex w-full items-center gap-4 p-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-100 shrink-0">
                  {item?.avatarUrl && (
                    <Image
                      src={item?.avatarUrl}
                      alt={item?.username}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold">
                      {item?.fullName || `@${item?.username}`}
                    </h3>
                    {item?.verified && (
                      <div className="relative group flex items-center">
                        <span className="inline-flex items-center justify-center text-blue-600">
                          <MdVerified className="text-md" />
                        </span>

                        <div className="absolute top-full mt-1 right-1 hidden md:group-hover:block bg-zinc-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow z-50">
                          Trusted & Verified Profile
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-sm flex items-center space-x-0.5">
                    <p className="bg-fuchsia-200 text-fuchsia-900 px-3 py-[1px] rounded-sm capitalize">
                      {item?.age} yrs
                    </p>

                    <p className="bg-emerald-200 text-emerald-900 px-3 py-[1px] rounded-sm capitalize">
                      {item?.maritalStatus}
                    </p>
                    <p
                      className={`!px-3 !py-[1px] rounded-sm capitalize
                          ${
                            item?.gender === "male"
                              ? "bg-cyan-100 text-cyan-700"
                              : item?.gender === "female"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-purple-100 text-purple-700"
                          }
                        `}
                    >
                      {item?.gender}
                    </p>
                  </div>
                  <p className="text-sm font-normal space-x-0.5 text-zinc-600 capitalize">
                    {item?.currentJob}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FilterFields({
  filters,
  handleChange,
  applyFilters,
  setShowFilters,
  isDesktop = false,
  loading = false,
}) {
  return (
    <div
      className={`grid gap-4 ${isDesktop ? "md:grid-cols-3" : "grid-cols-1"}`}
    >
      <select
        value={filters.gender}
        onChange={(e) => handleChange("gender", e.target.value)}
        className="w-auto rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
      >
        <option value="all">All Genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <input
        type="number"
        placeholder="Min Age"
        value={filters.min_age}
        onChange={(e) => handleChange("min_age", e.target.value)}
        className="w-auto rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
      />

      <input
        type="number"
        placeholder="Max Age"
        value={filters.max_age}
        onChange={(e) => handleChange("max_age", e.target.value)}
        className="w-auto rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
      />

      <select
        value={filters.marital_status}
        onChange={(e) => handleChange("marital_status", e.target.value)}
        className="w-auto rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
      >
        <option value="">Marital Status</option>
        <option value="single">Single</option>
        <option value="divorced">Divorced</option>
        <option value="widowed">Widowed</option>
      </select>

      <select
        value={filters.relationship_type}
        onChange={(e) => handleChange("relationship_type", e.target.value)}
        className="w-auto rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
      >
        <option value="">Relationship Type</option>
        <option value="long_term">Long Term</option>
        <option value="short_term">Short Term</option>
      </select>

      <input
        type="text"
        placeholder="Current Job"
        value={filters.job}
        onChange={(e) => handleChange("job", e.target.value)}
        className="w-auto rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
      />

      <select
        value={filters.sort}
        onChange={(e) => handleChange("sort", e.target.value)}
        className="w-auto rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="age_asc">Age ↑</option>
        <option value="age_desc">Age ↓</option>
        <option value="recently_updated">Recently Updated</option>
      </select>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.verified}
          onChange={(e) => handleChange("verified", e.target.checked)}
        />
        Verified Only
      </label>

      <div className="md:col-span-3 flex items-center justify-end gap-2">
        <Button
          variant="brand"
          onClick={applyFilters}
          className="md:w-auto w-full"
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply Filters"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(false)}
          className="md:w-auto w-full"
          disabled={loading}
        >
          <FiX size={18} />
        </Button>
      </div>
    </div>
  );
}
