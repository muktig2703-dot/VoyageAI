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
  MonitorSmartphone,
  Pencil,
  Save,
  ShieldCheck,
  Smartphone,
  UserRound,
  UsersRound,
  UserPlus,
  Trash2,
  Heart,
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

type CoTraveller = {
  id: string;
  user_id: string;
  name: string;
  relationship: string | null;
  age: number | null;
  gender: string | null;
  created_at: string;
};


type LoginSession = {
  id: string;
  device_name: string;
  created_at: string;
  last_active_at: string;
  is_current: boolean;
};

const sections = [
  { label: "My Profile", icon: UserRound },
  { label: "Co-Travellers", icon: UsersRound },
  { label: "Logged In Devices", icon: Smartphone },
  { label: "Reset Password", icon: KeyRound },
];
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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

const [coTravellers, setCoTravellers] = useState<CoTraveller[]>([]);
const [loadingCoTravellers, setLoadingCoTravellers] = useState(false);
const [coTravellerError, setCoTravellerError] = useState("");
const [showCoTravellerForm, setShowCoTravellerForm] = useState(false);
const [addingCoTraveller, setAddingCoTraveller] = useState(false);
const [newCoTraveller, setNewCoTraveller] = useState({
  name: "",
  relationship: "",
  age: "",
  gender: "",
});

const [editingCoTravellerId, setEditingCoTravellerId] =
  useState<string | null>(null);

const [editCoTraveller, setEditCoTraveller] = useState({
  name: "",
  relationship: "",
  age: "",
  gender: "",
});

const [savingCoTravellerEdit, setSavingCoTravellerEdit] = useState(false);
const [deletingCoTravellerId, setDeletingCoTravellerId] =
  useState<string | null>(null);


const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
const [loadingSessions, setLoadingSessions] = useState(false);
const [sessionsError, setSessionsError] = useState("");
const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
const [sessionMessage, setSessionMessage] = useState("");

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordMessage, setPasswordMessage] = useState("");

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


useEffect(() => {
  if (activeSection !== "Logged In Devices" || loading || !user) {
    return;
  }

  let cancelled = false;

  async function loadSessions() {
    setLoadingSessions(true);
    setSessionsError("");
    setSessionMessage("");

    try {
      const token = localStorage.getItem("voyageai_access_token");

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}/auth/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : "Unable to load your login sessions."
        );
      }

      if (!cancelled) {
        setLoginSessions(data as LoginSession[]);
      }
    } catch (error) {
      if (!cancelled) {
        setSessionsError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading sessions."
        );
      }
    } finally {
      if (!cancelled) {
        setLoadingSessions(false);
      }
    }
  }

  void loadSessions();

  return () => {
    cancelled = true;
  };
}, [activeSection, loading, user]);

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

useEffect(() => {
  if (activeSection !== "Co-Travellers" || loading || !user) {
    return;
  }

  let cancelled = false;

  async function loadCoTravellers() {
    setLoadingCoTravellers(true);
    setCoTravellerError("");

    try {
      const token = localStorage.getItem("voyageai_access_token");

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      const response = await fetch(`${API_URL}/co-travellers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Failed to load co-travellers. Please try again."
        );
      }

      const data: CoTraveller[] = await response.json();

      if (!cancelled) {
        setCoTravellers(data);
      }
    } catch (error) {
      if (!cancelled) {
        setCoTravellerError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading co-travellers."
        );
      }
    } finally {
      if (!cancelled) {
        setLoadingCoTravellers(false);
      }
    }
  }

  loadCoTravellers();

  return () => {
    cancelled = true;
  };
}, [activeSection, loading, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <p className="text-sm text-slate-500">Loading your profile...</p>
      </main>
    );
  }

  
async function handleAddCoTraveller(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const name = newCoTraveller.name.trim();

  if (!name) {
    setCoTravellerError("Please enter your co-traveller's name.");
    return;
  }

  const ageValue = newCoTraveller.age.trim();
  const age = ageValue === "" ? null : Number(ageValue);

  if (
    age !== null &&
    (!Number.isInteger(age) || age < 0 || age > 120)
  ) {
    setCoTravellerError("Please enter a valid age between 0 and 120.");
    return;
  }

  setAddingCoTraveller(true);
  setCoTravellerError("");

  try {
    const token = localStorage.getItem("voyageai_access_token");

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const payload = {
      name,
      relationship: newCoTraveller.relationship || null,
      age,
      gender: newCoTraveller.gender || null,
    };

    const response = await fetch(`${API_URL}/co-travellers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        typeof data?.detail === "string"
          ? data.detail
          : "Unable to add co-traveller. Please try again."
      );
    }

    setCoTravellers((previous) => [data as CoTraveller, ...previous]);

    setNewCoTraveller({
      name: "",
      relationship: "",
      age: "",
      gender: "",
    });

    setShowCoTravellerForm(false);
    setCoTravellerError("");
  } catch (error) {
    setCoTravellerError(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setAddingCoTraveller(false);
  }
}


function startEditingCoTraveller(companion: CoTraveller) {
  setEditingCoTravellerId(companion.id);
  setEditCoTraveller({
    name: companion.name,
    relationship: companion.relationship ?? "",
    age: companion.age == null ? "" : String(companion.age),
    gender: companion.gender ?? "",
  });
  setCoTravellerError("");
}

async function handleUpdateCoTraveller(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (!editingCoTravellerId) return;

  const name = editCoTraveller.name.trim();

  if (!name) {
    setCoTravellerError("Please enter your co-traveller's name.");
    return;
  }

  const ageValue = editCoTraveller.age.trim();
  const age = ageValue === "" ? null : Number(ageValue);

  if (
    age !== null &&
    (!Number.isInteger(age) || age < 0 || age > 120)
  ) {
    setCoTravellerError("Please enter a valid age between 0 and 120.");
    return;
  }

  setSavingCoTravellerEdit(true);
  setCoTravellerError("");

  try {
    const token = localStorage.getItem("voyageai_access_token");

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const response = await fetch(
      `${API_URL}/co-travellers/${editingCoTravellerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          relationship: editCoTraveller.relationship || null,
          age,
          gender: editCoTraveller.gender || null,
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        typeof data?.detail === "string"
          ? data.detail
          : "Unable to update co-traveller."
      );
    }

    setCoTravellers((previous) =>
      previous.map((companion) =>
        companion.id === editingCoTravellerId
          ? (data as CoTraveller)
          : companion
      )
    );

    setEditingCoTravellerId(null);
    setCoTravellerError("");
  } catch (error) {
    setCoTravellerError(
      error instanceof Error
        ? error.message
        : "Something went wrong while updating."
    );
  } finally {
    setSavingCoTravellerEdit(false);
  }
}

async function handleDeleteCoTraveller(companionId: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this co-traveller?"
  );

  if (!confirmed) return;

  setDeletingCoTravellerId(companionId);
  setCoTravellerError("");

  try {
    const token = localStorage.getItem("voyageai_access_token");

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const response = await fetch(
      `${API_URL}/co-travellers/${companionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      throw new Error(
        typeof data?.detail === "string"
          ? data.detail
          : "Unable to delete co-traveller."
      );
    }

    setCoTravellers((previous) =>
      previous.filter((companion) => companion.id !== companionId)
    );

    if (editingCoTravellerId === companionId) {
      setEditingCoTravellerId(null);
    }
  } catch (error) {
    setCoTravellerError(
      error instanceof Error
        ? error.message
        : "Something went wrong while deleting."
    );
  } finally {
    setDeletingCoTravellerId(null);
  }
}


async function handleRevokeSession(sessionId: string) {
  const confirmed = window.confirm(
    "Sign out this device? It will no longer be able to use this login session."
  );

  if (!confirmed) return;

  setRevokingSessionId(sessionId);
  setSessionsError("");
  setSessionMessage("");

  try {
    const token = localStorage.getItem("voyageai_access_token");

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const response = await fetch(
      `${API_URL}/auth/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      throw new Error(
        typeof data?.detail === "string"
          ? data.detail
          : "Unable to sign out this device."
      );
    }

    setLoginSessions((previous) =>
      previous.filter((session) => session.id !== sessionId)
    );

    setSessionMessage("The selected device has been signed out.");
  } catch (error) {
    setSessionsError(
      error instanceof Error
        ? error.message
        : "Something went wrong while signing out the device."
    );
  } finally {
    setRevokingSessionId(null);
  }
}


const handleChangePassword = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
  setPasswordMessage("");

  if (newPassword !== confirmPassword) {
    setPasswordMessage("New passwords do not match.");
    return;
  }

  if (newPassword.length < 8) {
    setPasswordMessage(
      "Your new password must be at least 8 characters long."
    );
    return;
  }

  try {
    const token = localStorage.getItem("voyageai_access_token");

    const response = await fetch(
      `${API_URL}/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.detail || "Unable to change password."
      );
    }

    setPasswordMessage("Password changed successfully! 🔐");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    setPasswordMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  }
};

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
                
{activeSection === "Co-Travellers" ? (
  <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          My Co-Travellers
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage the people you plan to travel with.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        onClick={() => setShowCoTravellerForm(true)}
      >
        <UserPlus size={18} />
        Add Co-Traveller
      </button>
    </div>

    
{showCoTravellerForm && (
  <form
    onSubmit={handleAddCoTraveller}
    className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm"
  >
    <div className="mb-5">
      <h3 className="text-lg font-bold text-slate-900">
        Add a Co-Traveller
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Enter the details of your friend or family member.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Full Name *
        </label>
        <input
          required
          maxLength={120}
          value={newCoTraveller.name}
          onChange={(event) =>
            setNewCoTraveller((previous) => ({
              ...previous,
              name: event.target.value,
            }))
          }
          placeholder="Enter full name"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Relationship
        </label>
        <select
          value={newCoTraveller.relationship}
          onChange={(event) =>
            setNewCoTraveller((previous) => ({
              ...previous,
              relationship: event.target.value,
            }))
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Select relationship</option>
          <option value="Friend">Friend</option>
          <option value="Family">Family</option>
          <option value="Sibling">Sibling</option>
          <option value="Parent">Parent</option>
          <option value="Partner">Partner</option>
          <option value="Colleague">Colleague</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Age
        </label>
        <input
          type="number"
          min={0}
          max={120}
          step={1}
          value={newCoTraveller.age}
          onChange={(event) =>
            setNewCoTraveller((previous) => ({
              ...previous,
              age: event.target.value,
            }))
          }
          placeholder="Enter age"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Gender
        </label>
        <select
          value={newCoTraveller.gender}
          onChange={(event) =>
            setNewCoTraveller((previous) => ({
              ...previous,
              gender: event.target.value,
            }))
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Prefer not to specify</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    {coTravellerError && (
      <p
        role="alert"
        className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {coTravellerError}
      </p>
    )}

    <div className="mt-6 flex flex-wrap justify-end gap-3">
      <button
        type="button"
        disabled={addingCoTraveller}
        onClick={() => {
          setShowCoTravellerForm(false);
          setCoTravellerError("");
        }}
        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={addingCoTraveller}
        className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {addingCoTraveller ? "Adding..." : "Save Co-Traveller"}
      </button>
    </div>
  </form>
)}

    {loadingCoTravellers ? (
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-8 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="text-sm text-slate-600">
          Loading your co-travellers...
        </p>
      </div>
    ) : coTravellerError ? (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm text-red-700">{coTravellerError}</p>
        <button
          type="button"
          onClick={() => setActiveSection("My Profile")}
          className="mt-3 text-sm font-semibold text-indigo-700 hover:underline"
        >
          Return to My Profile
        </button>
      </div>
    ) : coTravellers.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 px-6 py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
          <UsersRound size={30} />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          Your travel circle starts here!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Add your friends or family so you can keep their travel details
          organised in one place.
        </p>
        <button
          type="button"
          onClick={() => setShowCoTravellerForm(true)}
          className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Add your first co-traveller
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {coTravellers.map((companion) => (
          <div
            key={companion.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700">
                <UsersRound size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-slate-900">
                  {companion.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {companion.relationship || "Travel companion"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {companion.age != null && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  {companion.age} years
                </span>
              )}
              {companion.gender && (
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  {companion.gender}
                </span>
              )}
              
<div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
  <button
    type="button"
    onClick={() => startEditingCoTraveller(companion)}
    disabled={
      savingCoTravellerEdit ||
      deletingCoTravellerId !== null
    }
    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
  >
    <Pencil size={15} />
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDeleteCoTraveller(companion.id)}
    disabled={
      deletingCoTravellerId === companion.id ||
      savingCoTravellerEdit
    }
    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
  >
    <Trash2 size={15} />
    {deletingCoTravellerId === companion.id
      ? "Deleting..."
      : "Delete"}
  </button>
</div>
{editingCoTravellerId === companion.id && (
  <form
    onSubmit={handleUpdateCoTraveller}
    className="mt-4 space-y-4 rounded-xl bg-indigo-50/60 p-4"
  >
    <h4 className="font-semibold text-slate-800">
      Edit {companion.name}
    </h4>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Full Name *
      </label>
      <input
        required
        maxLength={120}
        value={editCoTraveller.name}
        onChange={(event) =>
          setEditCoTraveller((previous) => ({
            ...previous,
            name: event.target.value,
          }))
        }
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Relationship
      </label>
      <select
        value={editCoTraveller.relationship}
        onChange={(event) =>
          setEditCoTraveller((previous) => ({
            ...previous,
            relationship: event.target.value,
          }))
        }
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
      >
        <option value="">Select relationship</option>
        <option value="Friend">Friend</option>
        <option value="Family">Family</option>
        <option value="Sibling">Sibling</option>
        <option value="Parent">Parent</option>
        <option value="Partner">Partner</option>
        <option value="Colleague">Colleague</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Age
      </label>
      <input
        type="number"
        min={0}
        max={120}
        step={1}
        value={editCoTraveller.age}
        onChange={(event) =>
          setEditCoTraveller((previous) => ({
            ...previous,
            age: event.target.value,
          }))
        }
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Gender
      </label>
      <select
        value={editCoTraveller.gender}
        onChange={(event) =>
          setEditCoTraveller((previous) => ({
            ...previous,
            gender: event.target.value,
          }))
        }
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
      >
        <option value="">Prefer not to specify</option>
        <option value="Female">Female</option>
        <option value="Male">Male</option>
        <option value="Non-binary">Non-binary</option>
        <option value="Other">Other</option>
      </select>
    </div>

    {coTravellerError && (
      <p role="alert" className="text-sm text-red-600">
        {coTravellerError}
      </p>
    )}

    <div className="flex flex-wrap gap-2">
      <button
        type="submit"
        disabled={savingCoTravellerEdit}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {savingCoTravellerEdit ? "Saving..." : "Save Changes"}
      </button>

      <button
        type="button"
        disabled={savingCoTravellerEdit}
        onClick={() => {
          setEditingCoTravellerId(null);
          setCoTravellerError("");
        }}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  </form>
)}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
) : (
  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
    
{activeSection === "Logged In Devices" ? (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Logged In Devices
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Review the login sessions associated with your account.
      </p>
    </div>

    {sessionMessage && (
      <div
        role="status"
        className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
      >
        {sessionMessage}
      </div>
    )}

    {sessionsError && (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {sessionsError}
      </div>
    )}

    {loadingSessions ? (
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-8 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="text-sm text-slate-600">
          Loading your devices...
        </p>
      </div>
    ) : !sessionsError && loginSessions.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-8 text-center">
        <MonitorSmartphone
          size={36}
          className="mx-auto mb-3 text-indigo-600"
        />
        <h3 className="font-semibold text-slate-800">
          No active sessions found
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Sign in again if you expected to see a device here.
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {loginSessions.map((session) => (
          <div
            key={session.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700">
                  <MonitorSmartphone size={23} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {session.device_name || "Unknown device"}
                    </h3>

                    {session.is_current && (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        This device
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Signed in:{" "}
                    {new Date(session.created_at).toLocaleString()}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Last active:{" "}
                    {new Date(session.last_active_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {!session.is_current && (
                <button
                  type="button"
                  disabled={revokingSessionId !== null}
                  onClick={() => handleRevokeSession(session.id)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {revokingSessionId === session.id
                    ? "Signing out..."
                    : "Sign out"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

) : activeSection === "Reset Password" ? (
  <div className="mx-auto max-w-xl space-y-6 text-left">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Reset Password
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Choose a new password to keep your VoyageAI account secure.
      </p>
    </div>

    <form onSubmit={handleChangePassword} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Current Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter current password"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          New Password
        </label>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Confirm New Password
        </label>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Enter new password again"
        />
      </div>

      {passwordMessage && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${
            passwordMessage.includes("successfully")
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {passwordMessage}
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700"
      >
        Update Password
      </button>
    </form>
  </div>
) : (
  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
    <p className="text-slate-500">This section is coming soon.</p>
  </div>
)}
  </div>
)}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}