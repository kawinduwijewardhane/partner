"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaThreads,
  FaWhatsapp,
  FaPhone,
  FaXTwitter,
} from "react-icons/fa6";
import { MdEmail, MdVerified } from "react-icons/md";
import { HiOutlineShare } from "react-icons/hi";
import ImagePreviewModal from "@/components/ui/ImagePreviewModal";

const SOCIALS = [
  { key: "facebookUrl", label: "Facebook", Icon: FaFacebook },
  { key: "instagramUrl", label: "Instagram", Icon: FaInstagram },
  { key: "twitterUrl", label: "Twitter", Icon: FaXTwitter },
  { key: "linkedinUrl", label: "LinkedIn", Icon: FaLinkedin },
  { key: "githubUrl", label: "GitHub", Icon: FaGithub },
  { key: "threadsUrl", label: "Threads", Icon: FaThreads },
  { key: "youtubeUrl", label: "YouTube", Icon: FaYoutube },
];

export default function PublicPage({ user }) {
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: user.fullName || user.username,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const initials = (user.fullName || user.username || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const activeSocials = SOCIALS.filter((s) => user[s.key]);
  const hasContact = user.contactEmail || user.phoneNumber || user.whatsappLink;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1 space-y-6">
            <div className="border border-zinc-200 rounded-2xl p-6 space-y-5">
              <div
                onClick={() =>
                  user.avatarUrl && setPreviewImage(user.avatarUrl)
                }
                className="relative w-32 h-32 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 cursor-pointer mx-auto"
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-zinc-500">
                    {initials}
                  </div>
                )}
              </div>

              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1 relative group">
                  <h1 className="text-xl font-semibold">
                    {user.fullName || user.username}
                  </h1>

                  {user.verified && (
                    <>
                      <span className="inline-flex items-center justify-center rounded-full text-blue-600">
                        <MdVerified className="text-base" />
                      </span>

                      <div className="absolute top-full mt-2 hidden md:group-hover:block bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                        Trusted & Verified Profile
                      </div>
                    </>
                  )}
                </div>

                <p className="text-sm text-zinc-500">@{user.username}</p>
              </div>

              <div className="text-sm flex flex-wrap items-center justify-center space-x-0.5">
                {user.age && (
                  <p className="bg-fuchsia-200 text-fuchsia-900 px-3 py-[1px] rounded-sm capitalize">
                    {user?.age} yrs
                  </p>
                )}

                {user.maritalStatus && (
                  <p className="bg-emerald-200 text-emerald-900 px-3 py-[1px] rounded-sm capitalize">
                    {user?.maritalStatus}
                  </p>
                )}

                {user.gender && (
                  <p
                    className={`!px-3 !py-[1px] rounded-sm capitalize
                          ${
                            user?.gender === "male"
                              ? "bg-cyan-100 text-cyan-700"
                              : user?.gender === "female"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-purple-100 text-purple-700"
                          }
                        `}
                  >
                    {user?.gender}
                  </p>
                )}
              </div>

              {user.currentJob && (
                <p className="text-sm text-center text-zinc-600">
                  {user.currentJob}
                </p>
              )}

              <button
                onClick={shareProfile}
                className="w-full flex items-center justify-center gap-2 border border-zinc-200 px-4 py-2 rounded-lg text-sm hover:bg-zinc-50 transition"
              >
                <HiOutlineShare className="w-4 h-4" />
                {copied ? "Copied" : "Share Profile"}
              </button>
            </div>

            {user.qrCode && (
              <div className="border border-zinc-200 rounded-2xl p-4 text-center space-y-3">
                <p className="text-xs text-zinc-500">Scan to share profile</p>

                <div
                  onClick={() => setPreviewImage(user.qrCode)}
                  className="cursor-pointer flex justify-center"
                >
                  <div className="w-28 h-28 rounded-xl overflow-hidden border border-zinc-200">
                    <Image
                      src={user.qrCode}
                      alt="QR Code"
                      width={112}
                      height={112}
                      className="object-contain p-2"
                    />
                  </div>
                </div>

                <a
                  href={user.qrCodeDownloadUrl}
                  download
                  className="text-xs border border-zinc-200 px-3 py-1.5 rounded-md hover:bg-zinc-50 transition"
                >
                  Download QR
                </a>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-8">
            {user.bio && (
              <div className="border border-zinc-200 rounded-2xl p-6">
                <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
                  About
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                  {user.bio}
                </p>
              </div>
            )}

            <div className="border border-zinc-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm uppercase tracking-wide text-zinc-500">
                Looking For
              </h2>

              <h3 className="text-lg font-semibold">
                {user.relationshipType === "long_term"
                  ? "Long Term Relationship"
                  : "Short Term Relationship"}
              </h3>

              {user.adTitle && (
                <p className="font-medium text-zinc-700">{user.adTitle}</p>
              )}

              {user.adDescription && (
                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                  {user.adDescription}
                </p>
              )}
            </div>

            {hasContact && (
              <div className="border border-zinc-200 rounded-2xl p-6">
                <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-4">
                  Contact
                </h2>

                <div className="flex flex-wrap gap-3">
                  {user.whatsappLink && (
                    <a
                      href={user.whatsappLink}
                      target="_blank"
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}

                  {user.contactEmail && (
                    <a
                      href={`mailto:${user.contactEmail}`}
                      className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                    >
                      <MdEmail className="w-4 h-4" />
                      Email
                    </a>
                  )}

                  {user.phoneNumber && (
                    <a
                      href={`tel:${user.phoneNumber}`}
                      className="flex items-center gap-2 border border-zinc-200 px-4 py-2 rounded-lg text-sm hover:bg-zinc-50 transition"
                    >
                      <FaPhone className="w-4 h-4" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            )}

            {activeSocials.length > 0 && (
              <div className="border border-zinc-200 rounded-2xl p-6">
                <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-4">
                  Social
                </h2>

                <div className="flex flex-wrap gap-3">
                  {activeSocials.map(({ key, label, Icon }) => (
                    <Link
                      key={key}
                      href={user[key]}
                      target="_blank"
                      className="flex items-center gap-2 border border-zinc-200 px-4 py-2 rounded-lg text-sm hover:bg-zinc-50 transition"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ImagePreviewModal
        src={previewImage}
        alt="Preview"
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
