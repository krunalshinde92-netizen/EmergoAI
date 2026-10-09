import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const ICONS = {
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6L19 14z" />
      <path d="M5 15l.6 1.8L7.5 17l-1.9.2L5 19l-.6-1.8L2.5 17l1.9-.2L5 15z" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  copy: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  refresh: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  ),
  download: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  warning: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  cpu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  stack: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 011.32-4.24 2.5 2.5 0 011.98-3A2.5 2.5 0 019.5 2zM14.5 2A2.5 2.5 0 0012 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-1.32-4.24 2.5 2.5 0 00-1.98-3A2.5 2.5 0 0014.5 2z" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  lock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  share: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M4 20L21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </svg>
  ),
  plus: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  creditcard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  settings: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  person: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  globe: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  github: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  discord: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
  help: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="12" cy="10" r="1" />
      <path d="M12 7a2 2 0 10-1.5 3.46c-.7.3-1 .8-1 1.54" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  external: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  logout: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  sun: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  moon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ),
  monitor: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  chevrondown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  google: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
};

const EXAMPLE_PROMPTS = [
  { icon: '🛒', text: 'E-commerce platform with cart & payments (MERN)' },
  { icon: '💬', text: 'Real-time chat app with WebSocket & auth' },
  { icon: '📊', text: 'Analytics dashboard with charts & filters' },
  { icon: '📱', text: 'Social media mobile app (React Native)' },
  { icon: '🎯', text: 'Task management with Kanban boards' },
  { icon: '🔐', text: 'SaaS landing page with user subscriptions' },
];

const FEATURES = [
  { icon: 'cpu', color: 'purple', title: 'Powered by Gemini AI', desc: 'State-of-the-art Google Gemini models deliver intelligent, context-aware project architectures.' },
  { icon: 'bolt', color: 'cyan', title: 'Lightning Fast', desc: 'Get complete project blueprints in seconds, not hours. Ship faster with instant scaffolding.' },
  { icon: 'stack', color: 'pink', title: 'Multi-Stack Support', desc: 'From MERN to Next.js, React Native to Python — choose any stack, we handle the rest.' },
  { icon: 'shield', color: 'green', title: 'Best Practices', desc: 'Every generated project follows industry standards for security, scalability, and code quality.' },
  { icon: 'rocket', color: 'orange', title: 'Production Ready', desc: 'Get production-grade code with proper folder structure, error handling, and testing setups.' },
  { icon: 'code', color: 'blue', title: 'Clean Code Output', desc: 'Well-commented, properly formatted code with clear separation of concerns and patterns.' },
];

function renderMarkdownSimple(text) {
  const escapeHtml = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escapeHtml(text)
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`{3}(\w+)?\s*([\s\S]*?)`{3}/g, (_, lang, code) => `<pre><code>${code.trim()}</code></pre>`)
    .replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`)
    .replace(/^\s*---\s*$/gm, '<hr />')
    .replace(/^\d+\.\s(.*$)/gm, (_, content) => `<li>${content}</li>`)
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ol>${match}</ol>`)
    .replace(/^\-\s(.*$)/gm, (_, content) => `<li>${content}</li>`)
    .replace(/^\*\s(.*$)/gm, (_, content) => `<li>${content}</li>`)
    .replace(/(<li>.*<\/li>)(?!<\/[ou]l>)/g, (match) => {
      if (!match.includes('<ol>') && !match.includes('<ul>')) {
        return `<ul>${match}</ul>`;
      }
      return match;
    })
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hosupli]|<code|<pre|<hr)/, '<p>')
    .replace(/(?<![\n>])$/m, '</p>');
}

function AuthModal({ isOpen, onClose, initialMode = 'signin', onLogin }) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !formData.name) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const name = mode === 'signup' ? formData.name : formData.email.split('@')[0];
      const user = {
        email: formData.email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        credits: 10.0,
        workspace: `${name.charAt(0).toUpperCase() + name.slice(1)}'s Project`,
      };
      localStorage.setItem('emergo_user', JSON.stringify(user));
      onLogin(user);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-backdrop" />
      <div className="modal-container glass-strong fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>{ICONS.close}</button>

        <div className="modal-header">
          <div className="modal-logo-icon">
            <img src="/emergo%20AI%20logo.jpeg" alt="Emergo AI" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => { setMode('signin'); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          <h2 className="modal-title">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="modal-subtitle">
            {mode === 'signin'
              ? 'Sign in to continue to Emergo AI'
              : 'Start building with AI-powered project generation'}
          </p>
        </div>

        <button className="social-btn">
          {ICONS.google}
          <span>Continue with Google</span>
        </button>

        <div className="modal-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === 'signup' && (
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <div className="input-wrap">
                <span className="input-icon">{ICONS.user}</span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">{ICONS.mail}</span>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <span className="input-icon">{ICONS.lock}</span>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {mode === 'signin' && (
            <div className="form-options">
              <label className="remember-check">
                <input type="checkbox" />
                <span className="checkmark" />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn btn-primary modal-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" />
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="modal-footer">
          <span className="modal-footer-text">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            type="button"
            className="modal-switch-btn"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
          >
            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileDropdown({ user, isOpen, onClose, onLogout, theme, setTheme }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const MENU_ITEMS = [
    { icon: ICONS.creditcard, label: 'Manage Plan' },
    { icon: ICONS.person, label: 'Account Settings' },
    { icon: ICONS.globe, label: 'Language' },
    { icon: ICONS.github, label: 'Connect to Github', external: true },
    { icon: ICONS.discord, label: 'Community', external: true },
    { icon: ICONS.help, label: 'Help Center', external: true },
  ];

  const shortName = user.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="profile-dropdown glass-strong slide-up" ref={dropdownRef} style={{ transformOrigin: 'top right' }}>
      <div className="pd-email-header">{user.email}</div>

      <div className="pd-workspace-card">
        <div className="pd-workspace-avatar" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #10b981 100%)' }}>
          {shortName}
        </div>
        <div className="pd-workspace-info">
          <div className="pd-workspace-name">{user.workspace}</div>
          <div className="pd-workspace-meta">Owner • 1 member</div>
        </div>
        <button className="pd-share-btn">{ICONS.share}</button>
      </div>

      <div className="pd-credits-card">
        <div className="pd-credits-row">
          <div className="pd-credits-label">
            Credits
            <span className="pd-info-icon">{ICONS.info}</span>
          </div>
          <div className="pd-credits-value">
            <span className="pd-credits-plus">{ICONS.plus}</span>
            {user.credits.toFixed(2)}
          </div>
        </div>
        <button className="pd-upgrade-btn">
          Upgrade {ICONS.star}
        </button>
      </div>

      <div className="pd-menu">
        {MENU_ITEMS.map((item, i) => (
          <button key={i} className="pd-menu-item">
            <span className="pd-menu-icon">{item.icon}</span>
            <span className="pd-menu-label">{item.label}</span>
            {item.external && <span className="pd-menu-ext">{ICONS.external}</span>}
          </button>
        ))}
      </div>

      <div className="pd-footer">
        <button className="pd-logout-btn" onClick={onLogout}>
          <span>{ICONS.logout}</span>
          <span>Logout</span>
        </button>

        <div className="pd-theme-switcher">
          <button
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            title="Light"
          >
            {ICONS.sun}
          </button>
          <button
            className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
            onClick={() => setTheme('system')}
            title="System"
          >
            {ICONS.monitor}
          </button>
          <button
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            title="Dark"
          >
            {ICONS.moon}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('emergo_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
    setProfileOpen(false);
  };

  const handleLogin = (u) => {
    setUser(u);
    setAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('emergo_user');
    setUser(null);
    setProfileOpen(false);
  };

  const shortName = user
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/generate', { prompt });
      if (res.data.success) {
        setResponse(res.data.result);
      } else {
        setError(res.data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error generating project structure. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (text) => setPrompt(text);

  const handleCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { console.error('Copy failed:', e); }
  };

  const handleDownload = () => {
    if (!response) return;
    const blob = new Blob([response], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-blueprint.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setPrompt('');
    setResponse('');
    setError('');
  };

  return (
    <div className={`app-container theme-${theme}`}>
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="aurora-orb aurora-orb-4" />
      </div>
      <div className="grid-overlay" />

      <nav className="app-navbar">
        <div className="navbar-left">
          <div className="logo-icon breathe-logo">
            <img src="/emergo%20AI%20logo.jpeg" alt="Emergo AI Logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>
          <div className="navbar-brand">Emergo<span className="brand-gradient">AI</span></div>
        </div>
        <div className="navbar-right">
          {user && (
            <div className="navbar-credits" onClick={() => setProfileOpen(p => !p)} style={{ cursor: 'pointer' }}>
              <span className="nc-plus">{ICONS.plus}</span>
              <div className="nc-value">{user?.credits?.toFixed ? user.credits.toFixed(2) : '10.00'}</div>
            </div>
          )}

          {!user ? (
            <button className="btn btn-primary" onClick={() => openAuth('signup')} style={{ padding: '11px 24px', fontSize: '14px', height: '44px', gap: '8px' }}>
              {ICONS.sparkles}
              Get Started
            </button>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                className="profile-avatar-btn"
                onClick={() => setProfileOpen(p => !p)}
              >
                <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' }}>
                  {shortName}
                </div>
                <span className="avatar-chevron">{ICONS.chevrondown}</span>
              </button>

              <ProfileDropdown
                user={user}
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
              />
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        onLogin={handleLogin}
      />

      <main className="app-main">
        <section className="hero-section">
          <div className="hero-badge fade-in">
            <span className="hero-badge-icon">{ICONS.sparkles}</span>
            Powered by Google Gemini 3.8 AI
          </div>

          <h1 className="hero-title slide-up">
            <span className="hero-title-line">Describe your idea,</span>
            <span className="hero-title-line gradient-text">we build the blueprint.</span>
          </h1>

          <p className="hero-subtitle slide-up" style={{ animationDelay: '0.15s' }}>
            Transform a simple prompt into a complete, production-ready software project architecture.
            Tech stack, directory structure, APIs, database schema — all generated instantly.
          </p>

          <div className="hero-stats slide-up" style={{ animationDelay: '0.3s' }}>
            
          </div>
        </section>

        <section className="generator-section">
          <div className="generator-card">
            <div className="generator-inner">
              <form onSubmit={handleGenerate}>
                <div className="prompt-label">
                  <div className="prompt-label-left">
                    <span className="prompt-label-icon">{ICONS.document}</span>
                    Project Description
                  </div>
                  <div className="prompt-count">{prompt.length} / 2000</div>
                </div>

                <textarea
                  className="prompt-textarea"
                  rows="5"
                  maxLength={2000}
                  placeholder="Describe the software you want to build. Example: A full-stack e-commerce dashboard with product listings, admin panel, user authentication, and Stripe payment integration using the MERN stack..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />

                <div className="example-prompts">
                  {EXAMPLE_PROMPTS.map((ex, i) => (
                    <button
                      type="button"
                      key={i}
                      className="example-chip"
                      onClick={() => handleExampleClick(ex.text)}
                    >
                      <span className="example-chip-icon">{ex.icon}</span>
                      {ex.text}
                    </button>
                  ))}
                </div>

                <div className="generate-actions">
                  <div className="generate-options">
                    <div className="option-select">
                      {ICONS.layers}
                      <span>Auto Stack</span>
                    </div>
                    <div className="option-select">
                      {ICONS.bolt}
                      <span>Detailed Mode</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary generate-btn"
                    disabled={loading || !prompt.trim()}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" />
                        Generating...
                      </>
                    ) : (
                      <>
                        {ICONS.zap}
                        Generate Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="features-head">
            <div className="features-eyebrow">Why Emergo AI</div>
            <h2 className="features-title">
              Everything you need to<span className="gradient-text"> ship faster</span>
            </h2>
            <p className="features-desc">
              Built by developers, for developers. Skip the boilerplate and focus on what matters — building great products.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div
                className="feature-card glass slide-up"
                key={i}
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <div className={`feature-icon ${f.color}`}>{ICONS[f.icon]}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="ownership-section">
          <div className="ownership-inner glass">
            <div className="ownership-lock">
              {ICONS.lock}
            </div>
            <div className="ownership-text">
              You Own Everything You Build. <span className="ownership-ip">The IP's Yours.</span>
            </div>
          </div>
        </section>

        <footer className="app-footer">
          <p className="footer-text">
            Built with <span>♥</span> by developers, for developers · Powered by Google Gemini AI
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
