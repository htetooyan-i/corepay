"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteRequest, get, patch } from "@/lib/api";
import type { User } from "@/types/User";

import { AccountSections } from "./accountSections";
import { DeleteAccountDialog } from "./passwordDialogs";
import { ProfileSection } from "./profileSection";
import type { PasswordForm, ProfileForm } from "./settingsTypes";

const emptyProfile: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

const emptyPassword: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SettingsForm() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyProfile);
  const [currentPassword, setCurrentPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(emptyPassword);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfilePasswordModalOpen, setIsProfilePasswordModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await get<User>("/users/me");
        setUser(response);
        setForm({
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          phoneNumber: response.phoneNumber,
        });
      } catch {
        setError("We couldn't load your profile. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, []);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
    setError("");
  };

  const updatePasswordField = (field: keyof PasswordForm, value: string) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setCurrentPassword("");
    setError("");
    setIsProfilePasswordModalOpen(true);
  };

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (!currentPassword) {
      setError("Enter your current password to update your personal information.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      await patch(`/users/${user.id}`, { ...form, currentPassword });
      setUser((current) => (current ? { ...current, ...form } : current));
      setCurrentPassword("");
      setIsProfilePasswordModalOpen(false);
      setMessage("Your personal information has been updated.");
      setIsEditing(false);
    } catch {
      setError("We couldn't save your changes. Please check your details and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError("Enter your current password, new password, and confirmation to change your password.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Your new password and confirmation do not match.");
      return;
    }

    setIsPasswordSaving(true);
    setError("");
    setMessage("");
    try {
      await patch(`/users/${user.id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(emptyPassword);
      setIsPasswordModalOpen(false);
      setMessage("Your password has been updated.");
    } catch {
      setError("We couldn't change your password. Check your current password and try again.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const openDeleteDialog = () => {
    setDeletePassword("");
    setError("");
    setIsDeleteModalOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeletePassword("");
    setError("");
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || isDeleting) return;
    if (!deletePassword) {
      setError("Enter your current password to delete your account.");
      return;
    }

    setIsDeleting(true);
    setError("");
    try {
      await deleteRequest(`/users/${user.id}`, { data: { currentPassword: deletePassword } });
      document.cookie = "jwt=; Path=/; Max-Age=0; SameSite=Lax";
      router.replace("/auth/login");
    } catch {
      setError("We couldn't delete your account. Check your password and try again.");
      setIsDeleting(false);
    }
  };

  const closePasswordDialog = () => {
    setIsPasswordModalOpen(false);
    setPasswordForm(emptyPassword);
    setError("");
  };

  const closeProfilePasswordDialog = () => {
    setIsProfilePasswordModalOpen(false);
    setCurrentPassword("");
    setError("");
  };

  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_0.65fr]">
      <ProfileSection
        form={form}
        user={user}
        error={error}
        message={message}
        isLoading={isLoading}
        isEditing={isEditing}
        isSaving={isSaving}
        isPasswordSaving={isPasswordSaving}
        isPasswordModalOpen={isPasswordModalOpen}
        isProfilePasswordModalOpen={isProfilePasswordModalOpen}
        currentPassword={currentPassword}
        passwordForm={passwordForm}
        onFieldChange={updateField}
        onPasswordFieldChange={updatePasswordField}
        onSubmit={handleSubmit}
        onProfileSave={handleProfileSave}
        onPasswordSubmit={handlePasswordSubmit}
        onEdit={() => { setIsEditing(true); setCurrentPassword(""); setMessage(""); setError(""); }}
        onCancel={() => { setForm(user ?? emptyProfile); setCurrentPassword(""); setIsEditing(false); setError(""); setMessage(""); }}
        onOpenPassword={() => { setPasswordForm(emptyPassword); setMessage(""); setError(""); setIsPasswordModalOpen(true); }}
        onClosePassword={closePasswordDialog}
        onCloseProfilePassword={closeProfilePasswordDialog}
        onCurrentPasswordChange={(value) => { setCurrentPassword(value); setError(""); }}
      />
      <AccountSections email={form.email} isLoading={isLoading} isDeleting={isDeleting} hasUser={Boolean(user)} onDelete={openDeleteDialog} />
      {isDeleteModalOpen && <DeleteAccountDialog currentPassword={deletePassword} error={error} isDeleting={isDeleting} onChange={(value) => { setDeletePassword(value); setError(""); }} onSubmit={handleDelete} onClose={closeDeleteDialog} />}
    </div>
  );
}
