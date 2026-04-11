import React, { useState } from 'react';
import Card from '@/components/common/Card';
import { CardHeader } from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useAuth, useUI } from '@/app/store';
import {
  Mail, Phone, MapPin, Briefcase, Calendar, Building2,
  Edit3, Save, Shield, Clock, Award,
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { auth } = useAuth();
  const { addToast } = useUI();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    phone: '+1 (555) 101-2003',
    location: 'San Francisco, CA',
    bio: 'Passionate about building great products and leading high-performing teams.',
    emergencyContact: 'John Chen — +1 (555) 999-0001',
  });

  const user = auth.user;

  const handleSave = () => {
    setEditing(false);
    addToast('Profile updated successfully', 'success');
  };

  const infoItems = [
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: user?.email || 'N/A' },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: profile.phone, editable: true, field: 'phone' },
    { icon: <Building2 className="w-4 h-4" />, label: 'Department', value: user?.department || 'N/A' },
    { icon: <Briefcase className="w-4 h-4" />, label: 'Position', value: user?.position || 'N/A' },
    { icon: <MapPin className="w-4 h-4" />, label: 'Location', value: profile.location, editable: true, field: 'location' },
    { icon: <Shield className="w-4 h-4" />, label: 'Role', value: user?.role || 'N/A' },
    { icon: <Calendar className="w-4 h-4" />, label: 'Joined', value: 'March 15, 2021' },
    { icon: <Clock className="w-4 h-4" />, label: 'Employee ID', value: user?.id || 'N/A' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Header */}
      <Card>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.avatar || user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
              <Badge variant="success" dot>Active</Badge>
            </div>
            <p className="text-muted-foreground mt-1">{user?.position} · {user?.department}</p>
            {!editing && (
              <p className="text-sm text-muted-foreground mt-2 max-w-lg">{profile.bio}</p>
            )}
            {editing && (
              <textarea
                className="hrms-input mt-2 max-w-lg resize-none"
                rows={2}
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              />
            )}
          </div>
          <Button
            variant={editing ? 'primary' : 'outline'}
            size="sm"
            icon={editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            onClick={editing ? handleSave : () => setEditing(true)}
          >
            {editing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Personal Information" />
          <div className="space-y-4">
            {infoItems.slice(0, 4).map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  {editing && item.editable ? (
                    <input
                      className="hrms-input mt-0.5 py-1"
                      value={profile[item.field as keyof typeof profile]}
                      onChange={e => setProfile(p => ({ ...p, [item.field!]: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Work Information" />
          <div className="space-y-4">
            {infoItems.slice(4).map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  {editing && item.editable ? (
                    <input
                      className="hrms-input mt-0.5 py-1"
                      value={profile[item.field as keyof typeof profile]}
                      onChange={e => setProfile(p => ({ ...p, [item.field!]: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Emergency Contact & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Emergency Contact" />
          {editing ? (
            <input
              className="hrms-input"
              value={profile.emergencyContact}
              onChange={e => setProfile(p => ({ ...p, emergencyContact: e.target.value }))}
            />
          ) : (
            <p className="text-sm text-foreground">{profile.emergencyContact}</p>
          )}
        </Card>

        <Card>
          <CardHeader title="Skills & Certifications" />
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Agile', 'Leadership'].map(skill => (
              <span key={skill} className="px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-medium border border-primary/10">
                {skill}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
