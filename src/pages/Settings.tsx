import React, { useState } from 'react';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useUI } from '@/app/store';
import { Save, Shield, Bell, Globe, Palette, Database, Mail } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { addToast } = useUI();
  const [settings, setSettings] = useState({
    companyName: 'HRMS Pro Inc.',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    emailNotifications: true,
    pushNotifications: true,
    twoFactor: true,
    autoBackup: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    addToast('Settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">System Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your HRMS platform</p>
      </div>

      {/* General */}
      <Card>
        <CardHeader title="General" subtitle="Basic system configuration" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Company Name</label>
              <input className="hrms-input" value={settings.companyName} onChange={e => setSettings(s => ({ ...s, companyName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Timezone</label>
              <select className="hrms-input" value={settings.timezone} onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))}>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader title="Notifications" subtitle="Manage notification preferences" />
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email', icon: <Mail className="w-4 h-4" /> },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications', icon: <Bell className="w-4 h-4" /> },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-background text-muted-foreground">{item.icon}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings[item.key as keyof typeof settings] ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings[item.key as keyof typeof settings] ? 'translate-x-5.5 left-0.5' : 'left-0.5'
                }`} style={{ transform: settings[item.key as keyof typeof settings] ? 'translateX(22px)' : 'translateX(0)' }} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader title="Security" subtitle="Security and access settings" />
        <div className="space-y-4">
          {[
            { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require 2FA for all users', icon: <Shield className="w-4 h-4" /> },
            { key: 'autoBackup', label: 'Automatic Backups', desc: 'Daily automated backups', icon: <Database className="w-4 h-4" /> },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-background text-muted-foreground">{item.icon}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings[item.key as keyof typeof settings] ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform left-0.5" style={{ transform: settings[item.key as keyof typeof settings] ? 'translateX(22px)' : 'translateX(0)' }} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button icon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
