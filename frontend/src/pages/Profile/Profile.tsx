import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/Icons/Icons';
import Loader from '../../components/Loader/Loader';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, updateProfile, updatePreferences } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isPreferencesEditing, setIsPreferencesEditing] = useState(false);
  
  // Edit form state for user profile
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
    country: '',
    timezone: ''
  });

  // Edit form state for preferences
  const [preferencesForm, setPreferencesForm] = useState<{
    defaultCurrency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'CAD' | 'AUD';
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    notifications: {
      priceAlerts: boolean;
      portfolioUpdates: boolean;
      marketNews: boolean;
      emailNotifications: boolean;
    }
  }>({
    defaultCurrency: 'USD',
    riskTolerance: 'moderate',
    investmentExperience: 'beginner',
    notifications: {
      priceAlerts: true,
      portfolioUpdates: true,
      marketNews: false,
      emailNotifications: true
    }
  });

  // Initialize edit form when user data loads
  useEffect(() => {
    if (user && user.id) {
      console.log('Profile: User data updated:', user); // Debug log
      
      // Ensure preferences exist before accessing them
      const safePreferences = user.preferences || {
        defaultCurrency: 'USD',
        watchlist: [],
        portfolios: [],
        notifications: {
          priceAlerts: true,
          portfolioUpdates: true,
          marketNews: false,
          emailNotifications: true
        },
        riskTolerance: 'moderate',
        investmentExperience: 'beginner'
      };
      
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        bio: (user as any).bio || '',
        dateOfBirth: (user as any).dateOfBirth || '',
        country: (user as any).country || '',
        timezone: (user as any).timezone || ''
      });
      
      setPreferencesForm({
        defaultCurrency: safePreferences.defaultCurrency || 'USD',
        riskTolerance: safePreferences.riskTolerance || 'moderate',
        investmentExperience: safePreferences.investmentExperience || 'beginner',
        notifications: {
          priceAlerts: safePreferences.notifications?.priceAlerts ?? true,
          portfolioUpdates: safePreferences.notifications?.portfolioUpdates ?? true,
          marketNews: safePreferences.notifications?.marketNews ?? false,
          emailNotifications: safePreferences.notifications?.emailNotifications ?? true
        }
      });
    }
  }, [user]);

  // Show loading state only when actually loading and no user data
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <Loader size="large" text="Loading profile..." />
        </div>
      </div>
    );
  }

  // Safeguard: If user object is missing essential fields, show error
  if (!user.id || !user.email) {
    console.error('Profile: User object is corrupted:', user);
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <p>Error loading profile. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvatarInitials = () => {
    return `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      phone: (user as any).phone || '',
      bio: (user as any).bio || '',
      dateOfBirth: (user as any).dateOfBirth || '',
      country: (user as any).country || '',
      timezone: (user as any).timezone || ''
    });
  };

  const handleSave = async () => {
    try {
      // Only send fields that are part of the User model
      const profileData = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        username: editForm.username,
        email: editForm.email
      };
      
      console.log('Profile: Sending update data:', profileData);
      await updateProfile(profileData);
      console.log('Profile: Update completed, current user:', user);
      
      // Re-initialize form with updated user data after save
      // Add a small delay to ensure state has updated
      setTimeout(() => {
        if (user) {
          setEditForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            username: user.username || '',
            email: user.email || '',
            phone: (user as any).phone || '',
            bio: (user as any).bio || '',
            dateOfBirth: (user as any).dateOfBirth || '',
            country: (user as any).country || '',
            timezone: (user as any).timezone || ''
          });
        }
      }, 100);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      phone: (user as any).phone || '',
      bio: (user as any).bio || '',
      dateOfBirth: (user as any).dateOfBirth || '',
      country: (user as any).country || '',
      timezone: (user as any).timezone || ''
    });
  };

  const handlePreferencesEdit = () => {
    setIsPreferencesEditing(true);
  };

  const handlePreferencesSave = async () => {
    try {
      await updatePreferences(preferencesForm);
      setIsPreferencesEditing(false);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handlePreferencesCancel = () => {
    setIsPreferencesEditing(false);
    
    // Ensure preferences exist before accessing them
    const safePreferences = user?.preferences || {
      defaultCurrency: 'USD',
      watchlist: [],
      portfolios: [],
      notifications: {
        priceAlerts: true,
        portfolioUpdates: true,
        marketNews: false,
        emailNotifications: true
      },
      riskTolerance: 'moderate',
      investmentExperience: 'beginner'
    };
    
    setPreferencesForm({
      defaultCurrency: safePreferences.defaultCurrency || 'USD',
      riskTolerance: safePreferences.riskTolerance || 'moderate',
      investmentExperience: safePreferences.investmentExperience || 'beginner',
      notifications: {
        priceAlerts: safePreferences.notifications?.priceAlerts ?? true,
        portfolioUpdates: safePreferences.notifications?.portfolioUpdates ?? true,
        marketNews: safePreferences.notifications?.marketNews ?? false,
        emailNotifications: safePreferences.notifications?.emailNotifications ?? true
      }
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: Icons.User },
    { id: 'preferences', label: 'Preferences', icon: Icons.Settings },
    { id: 'subscription', label: 'Subscription', icon: Icons.Dollar },
    { id: 'activity', label: 'Activity', icon: Icons.Chart }
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" />
              ) : (
                <span className="avatar-initials">{getAvatarInitials()}</span>
              )}
            </div>
            <div className="profile-header-info">
              <h1 className="profile-name">
                {user.firstName} {user.lastName}
              </h1>
              <p className="profile-username">@{user.username}</p>
              <div className="profile-badges">
                <span className={`badge ${user.isEmailVerified ? 'verified' : 'unverified'}`}>
                  {user.isEmailVerified ? <Icons.Check /> : <Icons.X />}
                  {user.isEmailVerified ? 'Verified' : 'Unverified'}
                </span>
                <span className="badge role">
                  <Icons.Lock />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="profile-header-actions">
            {!isEditing ? (
              <button className="edit-button" onClick={handleEdit}>
                <Icons.Settings />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="save-button" 
                  onClick={handleSave}
                >
                  <Icons.Check />
                  Save
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  <Icons.X />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="profile-tab-content">
          {activeTab === 'personal' && (
            <div className="tab-panel">
              <div className="section-header">
                <h2>Personal Information</h2>
                <p>Manage your personal details and account information</p>
              </div>
              
              <div className="info-grid">
                <div className="info-card">
                  <label>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="edit-input"
                    />
                  ) : (
                    <div className="info-value">{user.firstName}</div>
                  )}
                </div>

                <div className="info-card">
                  <label>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="edit-input"
                    />
                  ) : (
                    <div className="info-value">{user.lastName}</div>
                  )}
                </div>

                <div className="info-card">
                  <label>Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="edit-input"
                    />
                  ) : (
                    <div className="info-value">@{user.username}</div>
                  )}
                </div>

                <div className="info-card">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="edit-input"
                    />
                  ) : (
                    <div className="info-value">
                      <span>{user.email}</span>
                      {!user.isEmailVerified && (
                        <button className="verify-email-btn">Verify Email</button>
                      )}
                    </div>
                  )}
                </div>

                <div className="info-card">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="edit-input"
                      placeholder="+1234567890"
                    />
                  ) : (
                    <div className="info-value">{(user as any).phone || 'Not provided'}</div>
                  )}
                </div>

                <div className="info-card">
                  <label>Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="edit-input"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="info-value">{(user as any).bio || 'No bio provided'}</div>
                  )}
                </div>

                <div className="info-card">
                  <label>Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editForm.dateOfBirth}
                      onChange={(e) => setEditForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="edit-input"
                    />
                  ) : (
                    <div className="info-value">
                      {(user as any).dateOfBirth ? new Date((user as any).dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="info-card">
                  <label>Country</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                      className="edit-input"
                      placeholder="United States"
                    />
                  ) : (
                    <div className="info-value">{(user as any).country || 'Not provided'}</div>
                  )}
                </div>

                <div className="info-card">
                  <label>Timezone</label>
                  {isEditing ? (
                    <select
                      value={editForm.timezone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, timezone: e.target.value }))}
                      className="edit-input"
                    >
                      <option value="">Select Timezone</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Asia/Shanghai">Shanghai (CST)</option>
                    </select>
                  ) : (
                    <div className="info-value">{(user as any).timezone || 'Not provided'}</div>
                  )}
                </div>

                <div className="info-card">
                  <label>User ID</label>
                  <div className="info-value code">{user.id}</div>
                </div>

                <div className="info-card">
                  <label>Last Login</label>
                  <div className="info-value">
                    <Icons.Clock />
                    {formatDate(user.lastLogin)}
                  </div>
                </div>

                <div className="info-card">
                  <label>Member Since</label>
                  <div className="info-value">
                    <Icons.Clock />
                    {formatDate(user.createdAt)}
                  </div>
                </div>

                <div className="info-card">
                  <label>Last Updated</label>
                  <div className="info-value">
                    <Icons.Clock />
                    {formatDate(new Date().toISOString())}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="tab-panel">
              <div className="section-header">
                <h2>Preferences & Settings</h2>
                <p>Customize your trading and notification preferences</p>
                <div className="section-actions">
                  {!isPreferencesEditing ? (
                    <button className="edit-button" onClick={handlePreferencesEdit}>
                      <Icons.Settings />
                      Edit Preferences
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button 
                        className="save-button" 
                        onClick={handlePreferencesSave}
                      >
                        <Icons.Check />
                        Save
                      </button>
                      <button className="cancel-button" onClick={handlePreferencesCancel}>
                        <Icons.X />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="preferences-sections">
                <div className="preference-section">
                  <h3>Trading Preferences</h3>
                  <div className="preference-grid">
                    <div className="preference-item">
                      <label>Default Currency</label>
                      {isPreferencesEditing ? (
                        <select 
                          className="preference-select" 
                          value={preferencesForm.defaultCurrency}
                          onChange={(e) => setPreferencesForm(prev => ({ ...prev, defaultCurrency: e.target.value as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'CAD' | 'AUD' }))}
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="JPY">JPY - Japanese Yen</option>
                          <option value="INR">INR - Indian Rupee</option>
                          <option value="CAD">CAD - Canadian Dollar</option>
                          <option value="AUD">AUD - Australian Dollar</option>
                        </select>
                      ) : (
                        <div className="preference-value">{user.preferences?.defaultCurrency || 'USD'}</div>
                      )}
                    </div>

                    <div className="preference-item">
                      <label>Risk Tolerance</label>
                      {isPreferencesEditing ? (
                        <select 
                          className="preference-select" 
                          value={preferencesForm.riskTolerance}
                          onChange={(e) => setPreferencesForm(prev => ({ ...prev, riskTolerance: e.target.value as 'conservative' | 'moderate' | 'aggressive' }))}
                        >
                          <option value="conservative">Conservative</option>
                          <option value="moderate">Moderate</option>
                          <option value="aggressive">Aggressive</option>
                        </select>
                      ) : (
                        <div className="preference-value">{user.preferences?.riskTolerance || 'moderate'}</div>
                      )}
                    </div>

                    <div className="preference-item">
                      <label>Investment Experience</label>
                      {isPreferencesEditing ? (
                        <select 
                          className="preference-select" 
                          value={preferencesForm.investmentExperience}
                          onChange={(e) => setPreferencesForm(prev => ({ ...prev, investmentExperience: e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert' }))}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      ) : (
                        <div className="preference-value">{user.preferences?.investmentExperience || 'beginner'}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="preference-section">
                  <h3>Notification Settings</h3>
                  <div className="notification-toggles">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <Icons.Check />
                        <div>
                          <span>Price Alerts</span>
                          <p>Get notifications when stocks hit target prices</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isPreferencesEditing ? preferencesForm.notifications.priceAlerts : (user.preferences?.notifications?.priceAlerts ?? true)}
                        onChange={(e) => isPreferencesEditing && setPreferencesForm(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, priceAlerts: e.target.checked } 
                        }))}
                        className="toggle-switch"
                        disabled={!isPreferencesEditing}
                      />
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <Icons.Check />
                        <div>
                          <span>Portfolio Updates</span>
                          <p>Get notifications about your portfolio performance</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isPreferencesEditing ? preferencesForm.notifications.portfolioUpdates : (user.preferences?.notifications?.portfolioUpdates ?? true)}
                        onChange={(e) => isPreferencesEditing && setPreferencesForm(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, portfolioUpdates: e.target.checked } 
                        }))}
                        className="toggle-switch"
                        disabled={!isPreferencesEditing}
                      />
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <Icons.Check />
                        <div>
                          <span>Market News</span>
                          <p>Receive important market news and updates</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isPreferencesEditing ? preferencesForm.notifications.marketNews : (user.preferences?.notifications?.marketNews ?? false)}
                        onChange={(e) => isPreferencesEditing && setPreferencesForm(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, marketNews: e.target.checked } 
                        }))}
                        className="toggle-switch"
                        disabled={!isPreferencesEditing}
                      />
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <Icons.Email />
                        <div>
                          <span>Email Notifications</span>
                          <p>Receive market updates and alerts via email</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isPreferencesEditing ? preferencesForm.notifications.emailNotifications : (user.preferences?.notifications?.emailNotifications ?? true)}
                        onChange={(e) => isPreferencesEditing && setPreferencesForm(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, emailNotifications: e.target.checked } 
                        }))}
                        className="toggle-switch"
                        disabled={!isPreferencesEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="tab-panel">
              <div className="section-header">
                <h2>Subscription & Billing</h2>
                <p>Manage your subscription plan and billing information</p>
              </div>

              <div className="subscription-content">
                <div className="current-plan">
                  <div className="plan-header">
                    <h3>Current Plan</h3>
                    <span className={`plan-badge ${user.subscription.plan}`}>
                      {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)}
                    </span>
                  </div>
                  <div className="plan-details">
                    <div className="plan-info">
                      <Icons.Dollar />
                      <div>
                        <span>Subscription Status</span>
                        <p>{user.subscription.isActive ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                    <div className="plan-info">
                      <Icons.Clock />
                      <div>
                        <span>Start Date</span>
                        <p>{formatDate(user.subscription.startDate)}</p>
                      </div>
                    </div>
                    <div className="plan-info">
                      <Icons.Clock />
                      <div>
                        <span>End Date</span>
                        <p>{formatDate(user.subscription.endDate)}</p>
                      </div>
                    </div>
                  </div>
                  {user.subscription.plan === 'free' && (
                    <button className="upgrade-button">
                      <Icons.TrendingUp />
                      Upgrade to Premium
                    </button>
                  )}
                </div>

                <div className="api-usage">
                  <h3>API Usage</h3>
                  <div className="usage-stats">
                    <div className="usage-item">
                      <span>Requests Used</span>
                      <span>0</span>
                    </div>
                    <div className="usage-item">
                      <span>Monthly Limit</span>
                      <span>1,000</span>
                    </div>
                    <div className="usage-item">
                      <span>Last Reset</span>
                      <span>{formatDate(new Date().toISOString())}</span>
                    </div>
                  </div>
                  <div className="usage-bar">
                    <div className="usage-progress" style={{ width: '0%' }}></div>
                  </div>
                  <p className="usage-text">
                    0% of monthly limit used
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="tab-panel">
              <div className="section-header">
                <h2>Account Activity</h2>
                <p>View your recent account activity and security information</p>
              </div>

              <div className="activity-content">
                <div className="activity-stats">
                  <div className="stat-card">
                    <Icons.Chart />
                    <div>
                      <span>Total Logins</span>
                      <p>0</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Icons.TrendingUp />
                    <div>
                      <span>Watchlist Items</span>
                      <p>{user.preferences.watchlist.length}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Icons.Dollar />
                    <div>
                      <span>Portfolios</span>
                      <p>{user.preferences.portfolios.length}</p>
                    </div>
                  </div>
                </div>

                <div className="security-section">
                  <h3>Security Information</h3>
                  <div className="security-items">
                    <div className="security-item">
                      <Icons.Lock />
                      <div>
                        <span>Account Security</span>
                        <p>Your account is secured with encrypted password</p>
                      </div>
                      <button className="change-password-btn">Change Password</button>
                    </div>
                    <div className="security-item">
                      <Icons.Email />
                      <div>
                        <span>Email Verification</span>
                        <p>{user.isEmailVerified ? 'Email verified' : 'Email not verified'}</p>
                      </div>
                      {!user.isEmailVerified && (
                        <button className="verify-button">Verify Now</button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="danger-section">
                  <h3>Danger Zone</h3>
                  <div className="danger-item">
                    <div>
                      <span>Delete Account</span>
                      <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button 
                      className="delete-account-btn"
                      onClick={() => {
                        const password = prompt('Enter your password to confirm account deletion:');
                        if (password) {
                          // Here you would call the delete account API
                          console.log('Delete account with password:', password);
                        }
                      }}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;