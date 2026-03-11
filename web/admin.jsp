<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Session check — redirect to login if not authenticated
    if (session.getAttribute("admin") == null) {
        response.sendRedirect("login.html");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Admin Dashboard — AI Digital Feedback System">
    <title>Admin Dashboard — AI Feedback</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner"></div>
        <p>Loading dashboard data...</p>
    </div>

    <!-- Dashboard Layout -->
    <div class="dashboard-layout">

        <!-- SIDEBAR -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-logo">
                <h2>AI Feedback</h2>
                <p>Admin Panel</p>
            </div>

            <nav class="sidebar-nav">
                <button class="sidebar-link active" onclick="switchSection('dashboard', this)">
                    <span class="icon">📊</span>
                    Dashboard
                </button>
                <button class="sidebar-link" onclick="switchSection('feedback-table', this)">
                    <span class="icon">📋</span>
                    Feedback Table
                </button>
                <button class="sidebar-link" onclick="switchSection('analytics', this)">
                    <span class="icon">📈</span>
                    Analytics
                </button>
            </nav>

            <div class="sidebar-footer">
                <a href="index.html">
                    <span>←</span>
                    Back to Home
                </a>
                <button onclick="logout()" style="margin-top: 8px;">
                    <span>🚪</span>
                    Logout
                </button>
            </div>
        </aside>

        <!-- Sidebar Overlay for Mobile -->
        <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

        <!-- Mobile Toggle -->
        <button class="mobile-toggle" id="mobileToggle" onclick="toggleSidebar()">☰</button>

        <!-- MAIN CONTENT -->
        <main class="main-content">

            <div class="page-header">
                <div class="page-header-text">
                    <h1 id="pageTitle">Dashboard</h1>
                    <p id="pageDescription">Overview of student feedback and sentiment analysis</p>
                </div>
            </div>

            <!-- ===== Dashboard Section ===== -->
            <section class="dashboard-section active" id="section-dashboard">

                <!-- Metric Cards -->
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-icon">📝</div>
                        </div>
                        <div class="metric-value" id="totalFeedback">0</div>
                        <div class="metric-label">Total Feedback</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-icon">⭐</div>
                        </div>
                        <div class="metric-value" id="avgRating">0.0</div>
                        <div class="metric-label">Average Rating</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-icon">😊</div>
                        </div>
                        <div class="metric-value" id="positivePercent">0%</div>
                        <div class="metric-label">Positive Feedback</div>
                    </div>
                </div>

                <!-- Charts -->
                <div class="charts-grid">
                    <div class="chart-card">
                        <h3>Rating Distribution</h3>
                        <div class="chart-container">
                            <canvas id="ratingChart"></canvas>
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Sentiment Distribution</h3>
                        <div class="chart-container">
                            <canvas id="sentimentChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Recent Feedback Preview -->
                <div class="table-card">
                    <div class="table-header">
                        <h3>Recent Feedback</h3>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Faculty</th>
                                <th>Course</th>
                                <th>Rating</th>
                                <th>Sentiment</th>
                            </tr>
                        </thead>
                        <tbody id="recentTableBody">
                        </tbody>
                    </table>
                    <div class="empty-state" id="recentEmpty" style="display:none;">
                        <div class="empty-icon">📭</div>
                        <p>No feedback submitted yet.</p>
                    </div>
                </div>
            </section>

            <!-- ===== Feedback Table Section ===== -->
            <section class="dashboard-section" id="section-feedback-table">

                <div class="table-card">
                    <div class="table-header">
                        <h3>All Feedback</h3>
                        <div class="table-search">
                            <span class="search-icon">🔍</span>
                            <input type="text" id="tableSearch" placeholder="Search feedback..." oninput="filterTable()">
                        </div>
                    </div>
                    <table class="data-table" id="fullTable">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Faculty</th>
                                <th>Course</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Sentiment</th>
                            </tr>
                        </thead>
                        <tbody id="fullTableBody">
                        </tbody>
                    </table>
                    <div class="empty-state" id="fullEmpty" style="display:none;">
                        <div class="empty-icon">📭</div>
                        <p>No feedback found.</p>
                    </div>
                </div>
            </section>

            <!-- ===== Analytics Section ===== -->
            <section class="dashboard-section" id="section-analytics">

                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-icon">📝</div>
                        </div>
                        <div class="metric-value" id="totalFeedback2">0</div>
                        <div class="metric-label">Total Responses</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-icon">⭐</div>
                        </div>
                        <div class="metric-value" id="avgRating2">0.0</div>
                        <div class="metric-label">Average Rating</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-header">
                            <div class="metric-icon">😊</div>
                        </div>
                        <div class="metric-value" id="positivePercent2">0%</div>
                        <div class="metric-label">Positive Rate</div>
                    </div>
                </div>

                <div class="charts-grid">
                    <div class="chart-card">
                        <h3>Rating Distribution</h3>
                        <div class="chart-container">
                            <canvas id="ratingChart2"></canvas>
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Sentiment Breakdown</h3>
                        <div class="chart-container">
                            <canvas id="sentimentChart2"></canvas>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    </div>

    <script src="js/dashboard.js"></script>
</body>
</html>
