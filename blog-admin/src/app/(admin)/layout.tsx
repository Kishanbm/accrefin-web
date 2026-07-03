'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, LogOut, Plus, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('admin_session='));
    if (!hasCookie) {
      window.location.href = '/admin/login';
    }
  }, []);

  // Persist collapse state across page loads
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      localStorage.setItem('sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  const isActive = (path: string) => {
    if (path === '/admin-blog' && pathname === '/') return true;
    if (path !== '/admin-blog' && pathname.startsWith(path)) return true;
    return false;
  };

  const blogItems = [
    { href: '/admin-blog', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/posts/new', icon: <Plus size={20} />, label: 'New Post' },
    { href: '/banners', icon: <Image size={20} />, label: 'Sidebar Banners' },
  ];

  const settingsItems = [
    { href: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <html lang="en">
      <body>
        <div className="admin-layout">
          {/* Sidebar */}
          <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 0 16px', margin: '0 16px 20px', minHeight: 'auto', height: 'auto', overflow: 'visible' }}>
              {collapsed ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#1d4ed8', borderRadius: '8px', fontWeight: 800, color: 'white', fontSize: '14px' }}>
                  A
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>Accrefin</span>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button */}
            <button
              className="sidebar-collapse-btn"
              onClick={toggleCollapse}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Nav Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 0 24px' }}>
              {/* Blog Group */}
              <div>
                {!collapsed && (
                  <div style={{ padding: '0 20px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)' }}>
                    Blog
                  </div>
                )}
                <ul className="nav-menu">
                  {blogItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
                        style={{ paddingLeft: collapsed ? '12px' : '32px' }}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Settings Group */}
              <div>
                {collapsed && <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 16px 16px' }}></div>}
                <ul className="nav-menu">
                  {settingsItems.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
                        style={{ paddingLeft: collapsed ? '12px' : '32px' }}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom: Logout */}
            <div style={{ marginTop: 'auto' }}>
              <ul className="nav-menu">
                <li>
                  <button
                    onClick={() => { window.location.href = '/admin/logout'; }}
                    className="nav-item"
                    style={{ color: '#ef4444', background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
                    title={collapsed ? 'Logout' : undefined}
                  >
                    <span className="nav-icon"><LogOut size={20} /></span>
                    {!collapsed && <span className="nav-label">Logout</span>}
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="main-content">
            <header className="topbar">
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                Blog Management System
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Admin User</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  A
                </div>
              </div>
            </header>
            
            <div className="page-container">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
