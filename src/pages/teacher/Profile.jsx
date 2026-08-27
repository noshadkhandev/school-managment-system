import { useState, useEffect } from "react";

const defaultProfile = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  qualification: "",
  photo: "",
};

function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [formData, setFormData] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("teacherProfile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      setFormData(parsed);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("teacherProfile", JSON.stringify(profile));
    }
  }, [profile, loaded]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in Name, Email and Phone");
      return;
    }
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Teacher Profile</h1>
        <p>View and manage your profile information</p>
      </div>

      <div className="profile-card">
        <div className="profile-photo-section">
          <img
            className="profile-photo"
            src={
              (isEditing ? formData.photo : profile.photo) ||
              "https://via.placeholder.com/150?text=Photo"
            }
            alt=""
          />

          {isEditing && (
            <div className="photo-upload">
              <label htmlFor="photoInput" className="photo-upload-btn">
                Change Photo
              </label>
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
            </div>
          )}
        </div>

        <div className="profile-details">
          {!isEditing ? (
            <>
              <div className="profile-field">
                <span className="field-label">Teacher Name</span>
                <span className="field-value">
                  {profile.name || "Not set"}
                </span>
              </div>

              <div className="profile-field">
                <span className="field-label">Email</span>
                <span className="field-value">
                  {profile.email || "Not set"}
                </span>
              </div>

              <div className="profile-field">
                <span className="field-label">Phone</span>
                <span className="field-value">
                  {profile.phone || "Not set"}
                </span>
              </div>

              <div className="profile-field">
                <span className="field-label">Subject</span>
                <span className="field-value">
                  {profile.subject || "Not set"}
                </span>
              </div>

              <div className="profile-field">
                <span className="field-label">Qualification</span>
                <span className="field-value">
                  {profile.qualification || "Not set"}
                </span>
              </div>

              <button className="edit-btn" onClick={handleEditClick}>
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <div className="profile-form-group">
                <label>Teacher Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="profile-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="profile-form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="profile-form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                />
              </div>

              <div className="profile-form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) =>
                    handleChange("qualification", e.target.value)
                  }
                />
              </div>

              <div className="profile-form-buttons">
                <button className="save-btn" onClick={handleSave}>
                  Save Profile
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;