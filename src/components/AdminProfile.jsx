import { useState } from "react";
import {
    User,
    Mail,
    Shield,
    Save,
    Lock,
    CheckCircle,
} from "lucide-react";

import "./AdminProfile.css";

const AdminProfile = () => {
    const [name, setName] = useState(
        localStorage.getItem("adminName") || "Admin"
    );

    const [email, setEmail] = useState(
        localStorage.getItem("adminEmail") || ""
    );

    const [password, setPassword] = useState("");

    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();

        localStorage.setItem("adminName", name);
        localStorage.setItem("adminEmail", email);

        if (password.trim()) {
            localStorage.setItem("adminPassword", password);
        }

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };

    return (
        <div className="admin-profile-page">

            <div className="profile-page-header">
                <div>
                    <span className="profile-label">
                        ADMIN PANEL
                    </span>

                    <h1>My Profile</h1>

                    <p>
                        Manage your administrator profile information.
                    </p>
                </div>
            </div>

            <div className="profile-content">

                <div className="admin-profile-card">

                    <div className="profile-card-top">

                        <div className="profile-avatar-wrapper">

                            <div className="profile-large-avatar">
                                <img
                                    src="/jawad.png"
                                    alt="Admin Profile"
                                />
                            </div>

                        </div>

                        <div className="profile-user-info">

                            <h2>
                                {name || "Admin"}
                            </h2>

                            <p>
                                Administrator
                            </p>

                            <span className="profile-status">
                                <span></span>
                                Active
                            </span>

                        </div>

                    </div>

                    <div className="profile-divider"></div>

                    <form onSubmit={handleSave}>

                        <div className="profile-field">

                            <label>
                                Full Name
                            </label>

                            <div className="profile-input">

                                <User size={18} />

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter your name"
                                />

                            </div>

                        </div>

                        <div className="profile-field">

                            <label>
                                Email Address
                            </label>

                            <div className="profile-input">

                                <Mail size={18} />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                />

                            </div>

                        </div>

                        <div className="profile-field">

                            <label>
                                Role
                            </label>

                            <div className="profile-input disabled">

                                <Shield size={18} />

                                <input
                                    type="text"
                                    value="Administrator"
                                    disabled
                                    readOnly
                                />

                            </div>

                        </div>

                        <div className="profile-field">

                            <label>
                                Password
                            </label>

                            <div className="profile-input">

                                <Lock size={18} />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter new password"
                                />

                            </div>

                            <small>
                                Leave blank if you don't want to
                                change your password.
                            </small>

                        </div>

                        <div className="profile-form-footer">

                            {saved && (
                                <div className="profile-success">
                                    <CheckCircle size={17} />
                                    Profile saved successfully
                                </div>
                            )}

                            <button
                                type="submit"
                                className="profile-save-btn"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>

                        </div>

                    </form>

                </div>

                <div className="profile-side-card">

                    <div className="side-card-icon">
                        <Shield size={21} />
                    </div>

                    <h3>
                        Account Information
                    </h3>

                    <p>
                        Your account has administrator
                        privileges and access to the complete
                        student portal.
                    </p>

                    <div className="account-info-list">

                        <div>
                            <span>
                                Account Type
                            </span>

                            <strong>
                                Administrator
                            </strong>
                        </div>

                        <div>
                            <span>
                                Account Status
                            </span>

                            <strong className="status-active">
                                Active
                            </strong>
                        </div>

                        <div>
                            <span>
                                Access Level
                            </span>

                            <strong>
                                Full Access
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminProfile;
