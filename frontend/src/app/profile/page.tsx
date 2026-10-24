"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  FileText,
  KeyRound,
  LogOut,
  MapPin,
  Pencil,
  Save,
  ShieldCheck,
  Smartphone,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  city: string | null;
  state: string | null;
};

const sections = [
  { label: "My Profile", icon: UserRound },
  { label: "Co-Travellers", icon: UsersRound },
  { label: "Logged In Devices", icon: Smartphone },
  { label: "Reset Password", icon: KeyRound },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("My Profile");
const [profile, setProfile] = useState<ProfileData | null>(null);
const [profileLoading, setProfileLoading] = useState(true);
const [profileError, setProfileError] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [saving, setSaving] = useState(false);
const [saveMessage, setSaveMessage] = useState("");

const [formData, setFormData] = useState({
  name: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  nationality: "",
  city: "",
  state: "",
});


  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  
useEffect(() => {
  if (loading || !user) return;

  let cancelled = false;

  async function fetchProfile() {
    setProfileLoading(true);
    setProfileError("");

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const token = localStorage.getItem("voyageai_access_token");

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load your profile. Please try again.");
      }

      const data: ProfileData = await response.json();

      if (!cancelled) {
  setProfile(data);
  setFormData({
    name: data.name ?? "",
    phone: data.phone ?? "",
    date_of_birth: data.date_of_birth ?? "",
    gender: data.gender ?? "",
    nationality: data.nationality ?? "",
    city: data.city ?? "",
    state: data.state ?? "",
  });
}
    } catch (error) {
      if (!cancelled) {
        setProfileError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading your profile."
        );
      }
    } finally {
      if (!cancelled) {
        setProfileLoading(false);
      }
    }
  }

  fetchProfile();

  return () => {
    cancelled = true;
  };
}, [loading, user]);


function validateProfile() {
  if (!formData.name.trim()) {
    return "Full name cannot be empty.";
  }

  const phone = formData.phone.trim();

  if (phone && !/^\+?[0-9\s()-]{7,20}$/.test(phone)) {
    return "Please enter a valid phone number.";
  }

  if (phone && phone.replace(/\D/g, "").length < 7) {
    return "Phone number must contain at least 7 digits.";
  }

  if (formData.date_of_birth) {
    const selectedDate = new Date(
      `${formData.date_of_birth}T00:00:00`
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate > today
    ) {
      return "Date of birth cannot be in the future.";
    }
  }

  return "";
}

async function handleSaveProfile() {
  setSaveMessage("");

  const validationError = validateProfile();

  if (validationError) {
    setSaveMessage(validationError);
    return;
  }

  setSaving(true);

  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const token = localStorage.getItem("voyageai_access_token");

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const payload = {
      ...formData,
      date_of_birth: formData.date_of_birth || null,
    };

    const response = await fetch(`${API_URL}/profile/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        typeof data.detail === "string"
          ? data.detail
          : "Unable to save your profile."
      );
    }

    setProfile(data);
    setFormData({
      name: data.name ?? "",
      phone: data.phone ?? "",
      date_of_birth: data.date_of_birth ?? "",
      gender: data.gender ?? "",
      nationality: data.nationality ?? "",
      city: data.city ?? "",
      state: data.state ?? "",
    });

    setIsEditing(false);
    setSaveMessage("Your profile has been saved successfully!");
  } catch (error) {
    setSaveMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong while saving."
    );
  } finally {
    setSaving(false);
  }
}
  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <p className="text-sm text-slate-500">Loading your profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-slate-900">
      <header className="border-b border-indigo-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-purple-700"
          >
            <ArrowLeft size={18} />
            Back to VoyageAI
          </button>

          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="flex items-center gap-2 rounded-xl border border-indigo-100 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-7">
          <p className="text-sm font-medium text-indigo-600">
            YOUR ACCOUNT
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Account settings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your profile and travel preferences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-indigo-100 bg-white p-3 shadow-sm">
            <p className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              My account
            </p>

            {sections.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveSection(label)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  activeSection === label
                    ? "bg-indigo-50 font-semibold text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                <ChevronRight size={15} />
              </button>
            ))}
          </aside>

          <section className="min-w-0 rounded-2xl border border-indigo-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <h2 className="text-xl font-bold">{activeSection}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {activeSection === "My Profile"
                  ? "Your personal information and contact details."
                  : "This account section will be available in a later step."}
              </p>
            </div>

            

            {activeSection === "My Profile" ? (
              profileLoading ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Loading your personal information...
                </div>
              ) : profileError ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-red-600">{profileError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Try again
                  </button>
                </div>
              ) : profile ? (
                <div className="space-y-7 p-6 sm:p-8">
                  

<section>
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <UserRound size={19} className="text-indigo-600" />
      <h3 className="font-semibold">General Information</h3>
    </div>

    {!isEditing && (
      <button
        onClick={() => {
          setSaveMessage("");
          setFormData({
            name: profile.name ?? "",
            phone: profile.phone ?? "",
            date_of_birth: profile.date_of_birth ?? "",
            gender: profile.gender ?? "",
            nationality: profile.nationality ?? "",
            city: profile.city ?? "",
            state: profile.state ?? "",
          });
          setIsEditing(true);
        }}
        className="flex items-center gap-2 rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
      >
        <Pencil size={15} />
        Edit Profile
      </button>
    )}
  </div>

  {isEditing ? (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Full name
        </label>
        <input
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full rounded-xl border border-indigo-100 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Email address
        </label>
        <input
          value={profile.email}
          readOnly
          className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
        />
        <p className="mt-1 text-xs text-slate-400">
          Email cannot be changed here.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Phone number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          className="w-full rounded-xl border border-indigo-100 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Date of birth
        </label>
        <input
          type="date"
          value={formData.date_of_birth}
          onChange={(e) =>
            setFormData({ ...formData, date_of_birth: e.target.value })
          }
          className="w-full rounded-xl border border-indigo-100 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Gender
        </label>
        <select
          value={formData.gender}
          onChange={(e) =>
            setFormData({ ...formData, gender: e.target.value })
          }
          className="w-full rounded-xl border border-indigo-100 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Select gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Nationality
        </label>
        <input
          value={formData.nationality}
          onChange={(e) =>
            setFormData({ ...formData, nationality: e.target.value })
          }
          className="w-full rounded-xl border border-indigo-100 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter nationality"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          City
        </label>
        <input
          value={formData.city}
          onChange={(e) =>
            setFormData({ ...formData, city: e.target.value })
          }
          className="w-full rounded-xl border border-indigo-100 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter city"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          State
        </label>
        <input
          value={formData.state}
          onChange={(e) =>
            setFormData({ ...formData, state: e.target.value })
          }
          className="w-full rounded-xl border border-indigo-100 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter state"
        />
      </div>
    </div>
  ) : (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <div>
        <p className="text-xs uppercase text-slate-400">Full name</p>
        <p className="mt-1 font-semibold">{profile.name || "Not provided"}</p>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Email address</p>
        <p className="mt-1 break-all font-semibold">{profile.email || "Not provided"}</p>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Phone number</p>
        <p className="mt-1 font-semibold">{profile.phone || "Not provided"}</p>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Date of birth</p>
        <p className="mt-1 font-semibold">{profile.date_of_birth || "Not provided"}</p>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Gender</p>
        <p className="mt-1 font-semibold">{profile.gender || "Not provided"}</p>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Nationality</p>
        <p className="mt-1 font-semibold">{profile.nationality || "Not provided"}</p>
      </div>
    </div>
  )}
</section>

{isEditing && (
  <div className="flex flex-wrap items-center gap-3">
    <button
      onClick={handleSaveProfile}
      disabled={saving}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Save size={16} />
      {saving ? "Saving..." : "Save Changes"}
    </button>

    <button
      onClick={() => {
        setFormData({
          name: profile.name ?? "",
          phone: profile.phone ?? "",
          date_of_birth: profile.date_of_birth ?? "",
          gender: profile.gender ?? "",
          nationality: profile.nationality ?? "",
          city: profile.city ?? "",
          state: profile.state ?? "",
        });
        setIsEditing(false);
        setSaveMessage("");
      }}
      disabled={saving}
      className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
    >
      Cancel
    </button>
  </div>
)}


{saveMessage && (
  <p
    role="status"
    aria-live="polite"
    className={`rounded-xl border px-4 py-3 text-sm ${
      saveMessage.includes("successfully")
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-red-200 bg-red-50 text-red-700"
    }`}
  >
    {saveMessage}
  </p>
)}
                  <div className="border-t border-slate-100" />

                  
<section>
  <div className="mb-5 flex items-center gap-2">
    <MapPin size={19} className="text-indigo-600" />
    <h3 className="font-semibold">Address Details</h3>
  </div>

  {isEditing ? (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          City
        </label>
        <input
          value={formData.city}
          onChange={(e) =>
            setFormData({ ...formData, city: e.target.value })
          }
          className="w-full rounded-xl border border-indigo-100 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter city"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          State
        </label>
        <input
          value={formData.state}
          onChange={(e) =>
            setFormData({ ...formData, state: e.target.value })
          }
          className="w-full rounded-xl border border-indigo-100 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter state"
        />
      </div>
    </div>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <p className="text-xs uppercase text-slate-400">City</p>
        <p className="mt-1 font-semibold">
          {profile.city || "Not provided"}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase text-slate-400">State</p>
        <p className="mt-1 font-semibold">
          {profile.state || "Not provided"}
        </p>
      </div>
    </div>
  )}
</section>

                  <div className="border-t border-slate-100" />

                  <section>
                    <div className="mb-4 flex items-center gap-2">
                      <ShieldCheck size={19} className="text-indigo-600" />
                      <h3 className="font-semibold">Account Information</h3>
                    </div>

                    <p className="text-sm leading-6 text-slate-500">
                      Your profile is linked to your VoyageAI account. Your
                      name and email are displayed from your current sign-in.
                    </p>
                  </section>
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  No profile information is available.
                </div>
              )
            ) : (
              <div className="p-8 text-center">
                {activeSection === "Co-Travellers" && (
                  <UsersRound className="mx-auto text-indigo-500" size={32} />
                )}

                {activeSection === "Logged In Devices" && (
                  <Smartphone className="mx-auto text-indigo-500" size={32} />
                )}

                {activeSection === "Reset Password" && (
                  <KeyRound className="mx-auto text-indigo-500" size={32} />
                )}

                <p className="mt-3 font-semibold">{activeSection}</p>
                <p className="mt-2 text-sm text-slate-500">
                  We'll build this feature separately.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}