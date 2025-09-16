import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Typography, Switch, Icon } from 'antd';

// Styles
const popoverContainerStyle: React.CSSProperties = {
  minWidth: 280,
  padding: 28,
  background: '#232634',
  borderRadius: 14,
  boxShadow: '0 4px 32px rgba(0,0,0,0.45)',
  textAlign: 'center',
  color: '#f5f6fa',
  border: '1px solid #2e3244',
  position: 'relative',
};

const logoutButtonStyle: React.CSSProperties = {
  background: '#e74c3c',
  borderColor: '#e74c3c',
  color: '#fff',
  fontWeight: 500,
  borderRadius: 8,
};

const cancelButtonStyle: React.CSSProperties = {
  marginTop: 10,
  background: 'transparent',
  border: '1px solid #35394a',
  color: '#b0b4c1',
  borderRadius: 8,
};

const dividerStyle: React.CSSProperties = {
  margin: '20px 0 16px 0',
  borderTop: '1px solid #35394a',
};

const themeSwitchStyle: React.CSSProperties = {
  marginLeft: 8,
  marginTop: 16,
  display: 'inline-block',
};

// Add these props to the component's props type/interface:
interface UserProfileProps {
  onLogout: () => void;
  onThemeToggle?: () => void;
  theme?: 'dark' | 'light';
}

interface UserPopoverProps {
  userInfo: { name: string; email: string };
  onLogout: () => void;
  onCancel: () => void;
  onThemeToggle?: () => void;
  theme?: 'dark' | 'light';
}

// Update the component signature:
const UserProfile: React.FC<UserProfileProps> = ({
  onLogout,
  onThemeToggle,
  theme,
}) => {
  const [visible, setVisible] = useState(false);

  // You can fetch/display real user info here if available
  const userInfo = {
    name: 'User',
    email: 'user@email.com',
  };

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  const UserPopover: React.FC<UserPopoverProps> = ({
    userInfo,
    onLogout,
    onCancel,
    onThemeToggle,
    theme,
  }) => (
    <div style={popoverContainerStyle}>
      <Typography.Text strong style={{ fontSize: 18, color: '#f5f6fa' }}>
        {userInfo.name}
      </Typography.Text>
      <br />
      <Typography.Text
        type='secondary'
        style={{ fontSize: 14, color: '#b0b4c1' }}
      >
        {userInfo.email}
      </Typography.Text>
      <div style={dividerStyle} />
      <div style={{ marginBottom: 16, fontSize: 15, color: '#b0b4c1' }}>
        Do you want to log out?
      </div>
      <Button
        type='primary'
        block
        style={logoutButtonStyle}
        onClick={() => {
          onCancel();
          onLogout();
        }}
      >
        Log out
      </Button>
      <Button block style={cancelButtonStyle} onClick={onCancel}>
        Cancel
      </Button>
      {onThemeToggle && (
        <div style={themeSwitchStyle}>
          <Switch
            checkedChildren={<Icon type='check' />}
            unCheckedChildren={<Icon type='close' />}
            checked={theme === 'dark'}
            onChange={onThemeToggle}
            defaultChecked
          />
          <span style={{ marginLeft: 8, color: '#b0b4c1', fontSize: 14 }}>
            {theme === 'dark' ? 'Light' : 'Dark'} Theme
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div
      className='top-bar'
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* ...existing code for left/middle of top bar... */}
      <div style={{ marginLeft: 'auto' }}>
        <Button
          shape='circle'
          icon='user'
          onClick={handleOpen}
          style={{
            background: '#232634',
            border: '1px solid #35394a',
            color: '#b0b4c1',
          }}
        />
      </div>
      {visible &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              zIndex: 100,
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(23, 25, 34, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onClick={handleClose}
          >
            <div
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <UserPopover
                userInfo={userInfo}
                onLogout={onLogout}
                onCancel={handleClose}
                onThemeToggle={onThemeToggle}
                theme={theme}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default UserProfile;
