import React from 'react';
import { Icons } from '../../components/Icons/Icons';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your application preferences and account settings</p>
      </div>

      <div className="settings-content">
        {/* General Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Icons.Settings />
            <h2>General</h2>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Language</h3>
              <p>Choose your preferred language</p>
            </div>
            <select className="setting-select">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Theme</h3>
              <p>Choose your preferred theme</p>
            </div>
            <select className="setting-select">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <Icons.Bell />
            <h2>Notifications</h2>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Email Notifications</h3>
              <p>Receive updates via email</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Price Alerts</h3>
              <p>Get notified of price changes</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Market News</h3>
              <p>Receive market news updates</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Display Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Icons.Eye />
            <h2>Display</h2>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Currency</h3>
              <p>Default currency for prices</p>
            </div>
            <select className="setting-select">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Timezone</h3>
              <p>Your local timezone</p>
            </div>
            <select className="setting-select">
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">Greenwich Mean Time</option>
            </select>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="settings-section">
          <div className="section-header">
            <Icons.Shield />
            <h2>Privacy & Security</h2>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security</p>
            </div>
            <button className="setting-button secondary">Enable 2FA</button>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Data Export</h3>
              <p>Download your data</p>
            </div>
            <button className="setting-button secondary">Export Data</button>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Change Password</h3>
              <p>Update your account password</p>
            </div>
            <button className="setting-button secondary">Change Password</button>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <div className="section-header">
            <Icons.Info />
            <h2>About</h2>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Version</h3>
              <p>Stock Scope v1.0.0</p>
            </div>
            <span className="setting-badge">Current</span>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Support</h3>
              <p>Get help and contact support</p>
            </div>
            <button className="setting-button secondary">Contact Support</button>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Terms & Privacy</h3>
              <p>Review our terms and privacy policy</p>
            </div>
            <button className="setting-button secondary">View Terms</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;