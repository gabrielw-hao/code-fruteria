import React from 'react';

/**
 * AboutPanel displays information about the application.
 */

const containerStyle: React.CSSProperties = {
  padding: 24,
  color: '#e0e0e0',
  fontFamily: 'monospace',
};

const headingStyle: React.CSSProperties = {
  color: '#fff',
  fontWeight: 700,
  fontSize: 22,
  margin: 0,
};

const bodyStyle: React.CSSProperties = {
  marginTop: 12,
};

const AboutPanel: React.FC = () => (
  <section style={containerStyle}>
    <h2 style={headingStyle}>About</h2>
    <div style={bodyStyle}>
      <p>
        Welcome to <b>fruteria</b>!<br />
        This is a playful trading app for fruit, built with React.
        <br />
        Drag panels from the sidebar to explore features.
        <br />
        <br />
        <i>Made with 🍌 and ❤️</i>
      </p>
    </div>
  </section>
);

export default AboutPanel;
