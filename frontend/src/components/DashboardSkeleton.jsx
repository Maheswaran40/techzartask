
import "./DashboardSkeleton.css";

export default function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      {/* Sidebar */}
      <aside className="sk-sidebar">
        <div className="sk-brand">
          <div className="sk-logo sk-shimmer" />
          <div className="sk-brand-text">
            <div className="sk-line sk-shimmer" />
            <div className="sk-line sk-small sk-shimmer" />
          </div>
        </div>

        <div className="sk-sidebar-label sk-shimmer" />

        <div className="sk-nav-item sk-nav-active">
          <div className="sk-icon sk-shimmer" />
          <div className="sk-nav-text sk-shimmer" />
        </div>

        <div className="sk-nav-item">
          <div className="sk-icon sk-shimmer" />
          <div className="sk-nav-text sk-shimmer" />
        </div>
      </aside>

      {/* Main area */}
      <div className="sk-main">
        {/* Top navbar */}
        <header className="sk-header">
          <div className="sk-header-title">
            <div className="sk-line sk-header-subtitle sk-shimmer" />
            <div className="sk-line sk-header-heading sk-shimmer" />
          </div>

          <div className="sk-user">
            <div className="sk-user-info">
              <div className="sk-line sk-user-name sk-shimmer" />
              <div className="sk-line sk-user-role sk-shimmer" />
            </div>
            <div className="sk-avatar sk-shimmer" />
          </div>
        </header>

        {/* Dashboard content */}
        <main className="sk-content">
          <div className="sk-page-heading">
            <div className="sk-line sk-overview sk-shimmer" />
            <div className="sk-line sk-title sk-shimmer" />
            <div className="sk-line sk-description sk-shimmer" />
          </div>

          <div className="sk-manage-button sk-shimmer" />

          {/* Four statistic cards */}
          <section className="sk-stats">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="sk-stat-card" key={index}>
                <div className="sk-stat-top">
                  <div className="sk-stat-icon sk-shimmer" />
                  <div className="sk-arrow sk-shimmer" />
                </div>

                <div className="sk-line sk-stat-label sk-shimmer" />
                <div className="sk-line sk-stat-number sk-shimmer" />
              </div>
            ))}
          </section>

          {/* Recently added employees */}
          <section className="sk-employees-card">
            <div className="sk-line sk-section-title sk-shimmer" />

            {Array.from({ length: 5 }).map((_, index) => (
              <div className="sk-employee-row" key={index}>
                <div className="sk-employee-avatar sk-shimmer" />

                <div className="sk-employee-details">
                  <div className="sk-line sk-employee-name sk-shimmer" />
                  <div className="sk-line sk-employee-description sk-shimmer" />
                </div>

                <div className="sk-status sk-shimmer" />
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
