"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import Image from "next/image";
import { LuImageUp } from "react-icons/lu";
import { FiInfo } from "react-icons/fi";

export default function ProfilePage() {
  const { user, loading, refreshSession } = useAuth();

  const fileRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    maritalStatus: "",
    dateOfBirth: "",
    currentJob: "",
    bio: "",
    facebookUrl: "",
    instagramUrl: "",
    githubUrl: "",
    threadsUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    whatsappNumber: "",
    phoneNumber: "",
    otherContactMethod: "",
    contactEmail: "",
    profileVisibility: "public",
    displayFullName: true,
  });

  const [ad, setAd] = useState(null);
  const [adForm, setAdForm] = useState({
    relationshipType: "",
    title: "",
    description: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAd, setSavingAd] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.avatarUrl) {
        let url = user.avatarUrl;

        if (url.startsWith("http://") || url.startsWith("https://")) {
          setAvatarPreview(url);
        } else {
          const cdnBase = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, "");
          setAvatarPreview(`${cdnBase}/relationship/${url.replace(/^\//, "")}`);
        }
      } else {
        setAvatarPreview(null);
      }

      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        maritalStatus: user.maritalStatus || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        currentJob: user.currentJob || "",
        bio: user.bio || "",
        facebookUrl: user.facebookUrl || "",
        instagramUrl: user.instagramUrl || "",

        githubUrl: user.githubUrl || "",
        threadsUrl: user.threadsUrl || "",
        linkedinUrl: user.linkedinUrl || "",
        twitterUrl: user.twitterUrl || "",
        youtubeUrl: user.youtubeUrl || "",

        whatsappNumber: user.whatsappNumber || "",
        phoneNumber: user.phoneNumber || "",

        otherContactMethod: user.otherContactMethod || "",
        contactEmail: user.contactEmail || "",
        profileVisibility: user.profileVisibility || "public",
        displayFullName: user.displayFullName ?? true,
      });

      fetchAd();
    }
  }, [user]);

  async function fetchAd() {
    try {
      const res = await api.get("/ads/me");
      if (res.data.data) {
        setAd(res.data.data);
        setAdForm({
          relationshipType: res.data.data.relationshipType,
          title: res.data.data.title,
          description: res.data.data.description,
        });
      }
    } catch {}
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingAvatar(true);

    const uploadRequest = api.post("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.promise(uploadRequest, {
      loading: "Uploading avatar...",
      success: "Avatar updated successfully",
      error: (err) =>
        err.response?.data?.message || err.message || "Upload failed",
    });

    try {
      const res = await uploadRequest;

      const avatarPath = res?.data?.avatarUrl;
      if (!avatarPath) throw new Error("Invalid avatar response");

      setAvatarPreview(avatarPath);
      refreshSession();
    } finally {
      setUploadingAvatar(false);
    }
  }

  if (loading || !user) return null;

  const isEmailVerified = user?.isEmailVerified === true;

  async function updateProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.patch("/profile", profileForm);
      toast.success("Profile updated successfully");
      refreshSession();
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setSavingProfile(false);
    }
  }

  async function createOrUpdateAd(e) {
    e.preventDefault();
    setSavingAd(true);
    try {
      if (ad) {
        await api.patch("/ads", adForm);
        toast.success("Advertisement updated");
      } else {
        const res = await api.post("/ads", adForm);
        setAd(res.data.data);
        toast.success("Advertisement created");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Ad operation failed");
    } finally {
      setSavingAd(false);
    }
  }

  async function changeStatus(status) {
    try {
      const res = await api.patch("/ads/status", { status });
      setAd(res.data.data);
      toast.success(`Ad ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  }

  const activeStyle =
    "!border-[var(--base-color)] bg-[var(--base-color)]/10 !text-[var(--base-color)]";

  const getStatusClass = (status) => (ad.status === status ? activeStyle : "!text-zinc-700");

  return (
    <section className="py-16 lg:py-24 bg-white">
      <Container className="max-w-7xl">
        <div className="flex items-center w-full justify-between mb-12">
          <h1 className="text-3xl font-bold">Profile & Listing</h1>

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-zinc-200 bg-zinc-50">
            <div className="flex flex-col leading-tight text-right">
              <span className="text-xs text-zinc-500 uppercase tracking-wide">
                Profile Views
              </span>
              <span className="text-xl font-semibold text-[var(--base-color)]">
                {user.profileViewsCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <form onSubmit={updateProfile} className="space-y-8">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileRef.current.click()}
                  className="relative w-32 h-32 rounded-sm overflow-hidden cursor-pointer group"
                >
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="User Avatar"
                      fill
                      sizes="128px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-zinc-500">
                      No Avatar
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
                    <div className="flex items-center flex-col gap-1">
                      <span className="text-3xl">
                        <LuImageUp />
                      </span>
                      {uploadingAvatar ? "Uploading..." : "Change"}
                    </div>
                  </div>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 items-start gap-3 p-4 rounded-md border border-amber-200 bg-amber-50 text-amber-800 max-w-md">
                  <div className="mt-0.5 text-amber-600">
                    <FiInfo size={18} />
                  </div>

                  <p className="text-sm leading-relaxed">
                    Your profile photo will be visible to anyone who visits your
                    profile. If you prefer not to share your personal image, you
                    can keep the default avatar or upload a different one.
                    Profiles with real photos usually gain more trust.
                  </p>
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <h2 className="text-lg font-semibold">Profile Privacy</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  value: "public",
                  label: "Public",
                  desc: "Anyone can view your profile",
                },
                {
                  value: "members",
                  label: "Members Only",
                  desc: "Only logged-in users can view",
                },
                {
                  value: "verified",
                  label: "Verified Only",
                  desc: "Only verified members can view",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl border px-4 py-4 text-sm transition-all ${
                    profileForm.profileVisibility === option.value
                      ? "border-[var(--base-color)] bg-[var(--base-color)]/10 text-[var(--base-color)]"
                      : "border-zinc-200 text-zinc-700 hover:border-[var(--base-color)] hover:text-[var(--base-color)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option.value}
                    checked={profileForm.profileVisibility === option.value}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        profileVisibility: e.target.value,
                      })
                    }
                    className="hidden"
                  />

                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-zinc-600 mt-1">
                    {option.desc}
                  </div>
                </label>
              ))}
            </div>

            <h2 className="text-lg font-semibold">Personal Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={profileForm.firstName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, firstName: e.target.value })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="First Name"
              />
              <input
                value={profileForm.lastName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, lastName: e.target.value })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="Last Name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, username: e.target.value })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="Username"
              />
              <input
                type="date"
                value={profileForm.dateOfBirth}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    dateOfBirth: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
              />
            </div>

            <div>
              <div className="grid grid-cols-3 gap-3">
                {["single", "divorced", "widowed"].map((status) => (
                  <label
                    key={status}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-sm text-center transition-all ${
                      profileForm.maritalStatus === status
                        ? "border-[var(--base-color)] bg-[var(--base-color)]/10 text-[var(--base-color)]"
                        : "border-zinc-200 text-zinc-700 hover:border-[var(--base-color)] hover:text-[var(--base-color)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="maritalStatus"
                      value={status}
                      checked={profileForm.maritalStatus === status}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          maritalStatus: e.target.value,
                        })
                      }
                      className="hidden"
                    />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <input
              value={profileForm.currentJob}
              onChange={(e) =>
                setProfileForm({ ...profileForm, currentJob: e.target.value })
              }
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
              placeholder="Current Job"
            />

            <textarea
              rows={4}
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm({ ...profileForm, bio: e.target.value })
              }
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
              placeholder="About You"
            />

            <h2 className="text-lg font-semibold">Social Links</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={profileForm.facebookUrl}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    facebookUrl: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="Facebook URL"
              />
              <input
                value={profileForm.instagramUrl}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    instagramUrl: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="Instagram URL"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={profileForm.githubUrl}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, githubUrl: e.target.value })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="GitHub URL"
              />
              <input
                value={profileForm.threadsUrl}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, threadsUrl: e.target.value })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="Threads URL"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={profileForm.linkedinUrl}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    linkedinUrl: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="LinkedIn URL"
              />
              <input
                value={profileForm.twitterUrl}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, twitterUrl: e.target.value })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="Twitter / X URL"
              />
            </div>

            {/* <input
              value={profileForm.youtubeUrl}
              onChange={(e) =>
                setProfileForm({ ...profileForm, youtubeUrl: e.target.value })
              }
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
              placeholder="YouTube URL"
            /> */}

            <h2 className="text-lg font-semibold">Contact</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={profileForm.whatsappNumber}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    whatsappNumber: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="WhatsApp Number"
              />
              <input
                value={profileForm.phoneNumber}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    phoneNumber: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="Phone Number"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={profileForm.otherContactMethod}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    otherContactMethod: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="Other Contact Method"
              />
              <input
                value={profileForm.contactEmail}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    contactEmail: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
                placeholder="Contact Email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={profileForm.displayFullName}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      displayFullName: e.target.checked,
                    })
                  }
                />
                Display full name publicly
              </label>
            </div>

            <Button type="submit" variant="brand">
              {savingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </form>

          <form onSubmit={createOrUpdateAd} className="space-y-8">
            <h2 className="text-lg font-semibold">
              {ad
                ? "Update Your Profile Listing"
                : "Create Your Profile Listing"}
            </h2>

            {!isEmailVerified && (
              <div className="flex flex-1 items-start gap-3 p-4 rounded-md border border-red-200 bg-red-50 text-red-800 max-w-full">
                <div className="mt-0.5 text-red-600">
                  <FiInfo size={18} />
                </div>

                <p className="text-sm leading-relaxed">
                  You must verify your email address before you can fully use
                  your profile features. Please check your inbox and complete
                  the verification process to continue.
                </p>
              </div>
            )}

            <div>
              <div className="grid grid-cols-2 gap-3">
                {["long_term", "short_term"].map((type) => (
                  <label
                    key={type}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-sm text-center transition-all ${
                      adForm.relationshipType === type
                        ? "border-[var(--base-color)] bg-[var(--base-color)]/10 text-[var(--base-color)]"
                        : "border-zinc-200 text-zinc-700 hover:border-[var(--base-color)] hover:text-[var(--base-color)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="relationshipType"
                      value={type}
                      checked={adForm.relationshipType === type}
                      onChange={(e) =>
                        setAdForm({
                          ...adForm,
                          relationshipType: e.target.value,
                        })
                      }
                      className="hidden"
                    />
                    {type === "long_term" ? "Long Term" : "Short Term"}
                  </label>
                ))}
              </div>
            </div>

            <input
              value={adForm.title}
              onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
              placeholder="Ad Title"
            />

            <textarea
              rows={5}
              value={adForm.description}
              onChange={(e) =>
                setAdForm({ ...adForm, description: e.target.value })
              }
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none"
              placeholder="Ad Description"
            />

            <Button
              type="submit"
              variant="brand"
              disabled={!isEmailVerified || savingAd}
              className={
                !isEmailVerified ? "!opacity-50 !cursor-not-allowed" : ""
              }
            >
              {savingAd
                ? "Saving..."
                : ad
                  ? "Update Profile Listing"
                  : "Publish Profile Listing"}
            </Button>

            {ad && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-200">
                <Button
                  variant="outline"
                  disabled={!isEmailVerified}
                  onClick={() => isEmailVerified && changeStatus("paused")}
                  className={`border ${getStatusClass("paused")} ${
                    !isEmailVerified ? "!opacity-50 !cursor-not-allowed" : ""
                  }`}
                >
                  Pause
                </Button>

                <Button
                  variant="outline"
                  disabled={!isEmailVerified}
                  onClick={() => isEmailVerified && changeStatus("active")}
                  className={`border ${getStatusClass("active")} ${
                    !isEmailVerified ? "!opacity-50 !cursor-not-allowed" : ""
                  }`}
                >
                  Activate
                </Button>

                <Button
                  variant="outline"
                  disabled={!isEmailVerified}
                  onClick={() => isEmailVerified && changeStatus("deleted")}
                  className={`border ${getStatusClass("deleted")} ${
                    !isEmailVerified ? "!opacity-50 !cursor-not-allowed" : ""
                  }`}
                >
                  Delete
                </Button>
              </div>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}
