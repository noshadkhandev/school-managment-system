import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  School,
  Mail,
  Phone,
  CalendarDays,
  Save,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const defaultSettings = {
  schoolName: "My School",
  email: "info@myschool.com",
  phone: "0300-0000000",
  academicYear: "2026-2027",
  term: "First Term",
  address: "",
  principalName: "",
  schoolCode: "",
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem("schoolSettings");

    if (storedSettings) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(storedSettings),
        });
      } catch {
        localStorage.removeItem("schoolSettings");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem("schoolSettings", JSON.stringify(settings));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const resetSettings = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all school settings?"
    );

    if (!confirmed) return;

    setSettings(defaultSettings);
    localStorage.removeItem("schoolSettings");
    setSaved(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <div className="settings-title">
            <div className="settings-title-icon">
              <SettingsIcon size={22} />
            </div>

            <div>
              <h1>School Settings</h1>
              <p>Manage your school information and portal settings.</p>
            </div>
          </div>
        </div>

        {saved && (
          <div className="settings-saved">
            <CheckCircle2 size={17} />
            Settings Saved
          </div>
        )}
      </div>

      <div className="settings-layout">
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon blue">
              <School size={20} />
            </div>

            <div>
              <h2>School Information</h2>
              <p>Basic information about your school.</p>
            </div>
          </div>

          <div className="settings-form">
            <div className="settings-form-group full">
              <label>School Name *</label>

              <div className="settings-input">
                <School size={17} />

                <input
                  name="schoolName"
                  value={settings.schoolName}
                  onChange={handleChange}
                  placeholder="Enter school name"
                />
              </div>
            </div>

            <div className="settings-form-row">
              <div className="settings-form-group">
                <label>School Email *</label>

                <div className="settings-input">
                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    placeholder="school@example.com"
                  />
                </div>
              </div>

              <div className="settings-form-group">
                <label>Phone Number</label>

                <div className="settings-input">
                  <Phone size={17} />

                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    placeholder="0300-0000000"
                  />
                </div>
              </div>
            </div>

            <div className="settings-form-group full">
              <label>School Address</label>

              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                placeholder="Enter complete school address"
                rows="3"
              />
            </div>

            <div className="settings-form-row">
              <div className="settings-form-group">
                <label>Principal / Head Name</label>

                <input
                  name="principalName"
                  value={settings.principalName}
                  onChange={handleChange}
                  placeholder="Enter principal name"
                />
              </div>

              <div className="settings-form-group">
                <label>School Code</label>

                <input
                  name="schoolCode"
                  value={settings.schoolCode}
                  onChange={handleChange}
                  placeholder="e.g. SCH-001"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon purple">
              <CalendarDays size={20} />
            </div>

            <div>
              <h2>Academic Settings</h2>
              <p>Configure your school's academic year.</p>
            </div>
          </div>

          <div className="settings-form">
            <div className="settings-form-group full">
              <label>Academic Year *</label>

              <input
                name="academicYear"
                value={settings.academicYear}
                onChange={handleChange}
                placeholder="2026-2027"
              />
            </div>

            <div className="settings-form-group full">
              <label>Current Term *</label>

              <select
                name="term"
                value={settings.term}
                onChange={handleChange}
              >
                <option>First Term</option>
                <option>Second Term</option>
                <option>Third Term</option>
                <option>Annual</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          type="button"
          className="settings-reset-btn"
          onClick={resetSettings}
        >
          <RotateCcw size={17} />
          Reset
        </button>

        <button
          type="button"
          className="settings-save-btn"
          onClick={saveSettings}
        >
          <Save size={17} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;