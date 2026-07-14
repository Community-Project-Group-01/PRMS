import React, { useState } from "react";
import { FiEdit2, FiSave, FiX, FiMail, FiUser, FiLock, FiShield } from "react-icons/fi";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useAppContext } from "../../context/AppContext";
import { emailValidator } from "../../utils/validator";
import toast from "react-hot-toast";

const Profile = () => {
  const { userDetails, api, refreshUser, loading } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const inputClass =
    "w-full border border-primary rounded-lg p-2 transition duration-150 focus:outline-none focus:ring-1 focus:ring-primary-dark focus:border-primary-dark";

  const startEditing = () => {
    setFormData({
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!emailValidator(formData.email)) newErrors.email = "Valid email is required.";

    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = { name: formData.name, email: formData.email };
      if (formData.password) payload.password = formData.password;

      const res = await api.post("/api/admin/update", payload);
      toast.success(res.data?.message || "Profile updated successfully");
      await refreshUser();
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="large" variant="primary" showText text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-8">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
                {userDetails?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userDetails?.name}</h2>
                <p className="text-white/90">{userDetails?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {userDetails?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {!editing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiUser className="text-primary" /> Full Name
                    </p>
                    <p className="text-lg text-gray-800 font-semibold">
                      {userDetails?.name || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiMail className="text-primary" /> Email Address
                    </p>
                    <p className="text-lg text-gray-800 font-semibold">
                      {userDetails?.email || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <FiShield className="text-primary" /> Role
                    </p>
                    <p className="text-lg text-gray-800 font-semibold capitalize">
                      {userDetails?.role || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    variant="primary"
                    size="medium"
                    className="bg-primary hover:bg-primary-dark flex items-center gap-2"
                    onClick={startEditing}>
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-primary-dark">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block mb-1 text-primary-dark">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FiLock className="text-primary" /> Change Password (optional)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-primary-dark">New Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        className={inputClass}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-primary-dark">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={inputClass}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="medium"
                    className="flex items-center gap-2"
                    onClick={() => setEditing(false)}
                    disabled={saving}>
                    <FiX className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="medium"
                    className="bg-primary hover:bg-primary-dark flex items-center gap-2"
                    loading={saving}>
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
