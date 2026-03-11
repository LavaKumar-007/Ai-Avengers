/**
 * dashboard.js — Admin Dashboard: Fetch data, render charts, populate tables
 */

let feedbackData = [];
let ratingChart = null;
let sentimentChart = null;
let ratingChart2 = null;
let sentimentChart2 = null;

// ===== Initialize Dashboard =====
document.addEventListener('DOMContentLoaded', () => {
    fetchFeedbackData();
});

// ===== Fetch Feedback Data =====
async function fetchFeedbackData() {
    try {
        const response = await fetch('submitFeedback', {
            method: 'GET',
            credentials: 'same-origin'
        });

        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }

        feedbackData = await response.json();
        renderDashboard();
    } catch (error) {
        console.error('Failed to fetch feedback data:', error);
        hideLoading();
    }
}

// ===== Render Dashboard =====
function renderDashboard() {
    updateMetrics();
    renderCharts();
    populateRecentTable();
    populateFullTable();
    hideLoading();
}

// ===== Hide Loading Overlay =====
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
    }
}

// ===== Update Metric Cards =====
function updateMetrics() {
    const total = feedbackData.length;
    const avgRating = total > 0
        ? (feedbackData.reduce((sum, fb) => sum + fb.rating, 0) / total).toFixed(1)
        : '0.0';
    const positiveCount = feedbackData.filter(fb => fb.sentiment === 'Positive').length;
    const positivePercent = total > 0 ? Math.round((positiveCount / total) * 100) : 0;

    // Dashboard section metrics
    animateCounter('totalFeedback', total);
    animateDecimal('avgRating', parseFloat(avgRating));
    animateCounter('positivePercent', positivePercent, '%');

    // Analytics section metrics
    animateCounter('totalFeedback2', total);
    animateDecimal('avgRating2', parseFloat(avgRating));
    animateCounter('positivePercent2', positivePercent, '%');
}

// ===== Smooth Counter Animation =====
function animateCounter(elementId, target, suffix = '') {
    const el = document.getElementById(elementId);
    if (!el) return;

    let current = 0;
    const duration = 1000;
    const startTime = performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target + suffix;
        }
    }

    requestAnimationFrame(tick);
}

// ===== Decimal Counter Animation =====
function animateDecimal(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let current = 0;
    const duration = 1000;
    const startTime = performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = (eased * target).toFixed(1);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target.toFixed(1);
        }
    }

    requestAnimationFrame(tick);
}

// ===== Render Charts =====
function renderCharts() {
    // Rating distribution data
    const ratingCounts = [0, 0, 0, 0, 0];
    feedbackData.forEach(fb => {
        if (fb.rating >= 1 && fb.rating <= 5) {
            ratingCounts[fb.rating - 1]++;
        }
    });

    // Sentiment distribution data
    const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    feedbackData.forEach(fb => {
        if (sentimentCounts.hasOwnProperty(fb.sentiment)) {
            sentimentCounts[fb.sentiment]++;
        }
    });

    // Chart.js default styling
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 13;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;

    // ===== Rating Bar Chart (Dashboard) =====
    const ratingCtx = document.getElementById('ratingChart');
    if (ratingCtx) {
        if (ratingChart) ratingChart.destroy();
        ratingChart = new Chart(ratingCtx, {
            type: 'bar',
            data: {
                labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                datasets: [{
                    label: 'Responses',
                    data: ratingCounts,
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(234, 179, 8, 0.7)',
                        'rgba(34, 197, 94, 0.7)',
                        'rgba(79, 70, 229, 0.7)'
                    ],
                    borderColor: [
                        'rgba(239, 68, 68, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(234, 179, 8, 1)',
                        'rgba(34, 197, 94, 1)',
                        'rgba(79, 70, 229, 1)'
                    ],
                    borderWidth: 1.5,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1200, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#6B7280' },
                        grid: { color: 'rgba(0,0,0,0.04)' }
                    },
                    x: {
                        ticks: { color: '#6B7280' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // ===== Sentiment Doughnut Chart (Dashboard) =====
    const sentimentCtx = document.getElementById('sentimentChart');
    if (sentimentCtx) {
        if (sentimentChart) sentimentChart.destroy();
        sentimentChart = new Chart(sentimentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [{
                    data: [sentimentCounts.Positive, sentimentCounts.Neutral, sentimentCounts.Negative],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1200, easing: 'easeOutQuart' },
                cutout: '62%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 18, font: { size: 12, weight: 500 } }
                    }
                }
            }
        });
    }

    // ===== Analytics Section Charts =====
    const ratingCtx2 = document.getElementById('ratingChart2');
    if (ratingCtx2) {
        if (ratingChart2) ratingChart2.destroy();
        ratingChart2 = new Chart(ratingCtx2, {
            type: 'bar',
            data: {
                labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                datasets: [{
                    label: 'Responses',
                    data: ratingCounts,
                    backgroundColor: 'rgba(79, 70, 229, 0.6)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1.5,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1200, easing: 'easeOutQuart' },
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#6B7280' },
                        grid: { color: 'rgba(0,0,0,0.04)' }
                    },
                    x: {
                        ticks: { color: '#6B7280' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    const sentimentCtx2 = document.getElementById('sentimentChart2');
    if (sentimentCtx2) {
        if (sentimentChart2) sentimentChart2.destroy();
        sentimentChart2 = new Chart(sentimentCtx2, {
            type: 'pie',
            data: {
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [{
                    data: [sentimentCounts.Positive, sentimentCounts.Neutral, sentimentCounts.Negative],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1200, easing: 'easeOutQuart' },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 18, font: { size: 12, weight: 500 } }
                    }
                }
            }
        });
    }
}

// ===== Populate Recent Table (Dashboard - top 5) =====
function populateRecentTable() {
    const tbody = document.getElementById('recentTableBody');
    const emptyState = document.getElementById('recentEmpty');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (feedbackData.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    const recent = feedbackData.slice(0, 5);

    recent.forEach((fb, index) => {
        const row = document.createElement('tr');
        row.style.animation = `fadeIn 0.4s ease ${index * 0.05}s both`;
        row.innerHTML = `
            <td>${escapeHtml(fb.name)}</td>
            <td>${escapeHtml(fb.faculty)}</td>
            <td>${escapeHtml(fb.course)}</td>
            <td><span class="rating-stars">${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}</span></td>
            <td><span class="badge badge-${fb.sentiment.toLowerCase()}">${fb.sentiment}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// ===== Populate Full Table (Feedback Table section) =====
function populateFullTable() {
    const tbody = document.getElementById('fullTableBody');
    const emptyState = document.getElementById('fullEmpty');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (feedbackData.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    feedbackData.forEach((fb, index) => {
        const row = document.createElement('tr');
        row.style.animation = `fadeIn 0.4s ease ${index * 0.03}s both`;
        row.innerHTML = `
            <td>${escapeHtml(fb.name)}</td>
            <td>${escapeHtml(fb.faculty)}</td>
            <td>${escapeHtml(fb.course)}</td>
            <td><span class="rating-stars">${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}</span></td>
            <td class="comment-cell" title="${escapeHtml(fb.comment)}">${escapeHtml(fb.comment)}</td>
            <td><span class="badge badge-${fb.sentiment.toLowerCase()}">${fb.sentiment}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// ===== Table Search / Filter =====
function filterTable() {
    const query = document.getElementById('tableSearch').value.toLowerCase();
    const tbody = document.getElementById('fullTableBody');
    const emptyState = document.getElementById('fullEmpty');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtered = feedbackData.filter(fb =>
        fb.name.toLowerCase().includes(query) ||
        fb.faculty.toLowerCase().includes(query) ||
        fb.course.toLowerCase().includes(query) ||
        fb.comment.toLowerCase().includes(query) ||
        fb.sentiment.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    filtered.forEach((fb, index) => {
        const row = document.createElement('tr');
        row.style.animation = `fadeIn 0.3s ease ${index * 0.02}s both`;
        row.innerHTML = `
            <td>${escapeHtml(fb.name)}</td>
            <td>${escapeHtml(fb.faculty)}</td>
            <td>${escapeHtml(fb.course)}</td>
            <td><span class="rating-stars">${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}</span></td>
            <td class="comment-cell" title="${escapeHtml(fb.comment)}">${escapeHtml(fb.comment)}</td>
            <td><span class="badge badge-${fb.sentiment.toLowerCase()}">${fb.sentiment}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// ===== Sidebar Section Switching =====
function switchSection(sectionName, btnElement) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));

    // Show target section
    const target = document.getElementById('section-' + sectionName);
    if (target) target.classList.add('active');

    // Update sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    // Update page header
    const title = document.getElementById('pageTitle') || document.querySelector('.page-header h1');
    const desc = document.getElementById('pageDescription') || document.querySelector('.page-header p');

    switch (sectionName) {
        case 'dashboard':
            if (title) title.textContent = 'Dashboard';
            if (desc) desc.textContent = 'Overview of student feedback and sentiment analysis';
            break;
        case 'feedback-table':
            if (title) title.textContent = 'Feedback Table';
            if (desc) desc.textContent = 'All submitted feedback with search and filtering';
            break;
        case 'analytics':
            if (title) title.textContent = 'Analytics';
            if (desc) desc.textContent = 'Detailed charts and insights from feedback data';
            break;
    }

    // Close mobile sidebar
    closeSidebar();
}

// ===== Mobile Sidebar Toggle =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('show');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

// ===== Logout =====
function logout() {
    // Simply redirect to home — session will be invalidated on next request
    window.location.href = 'index.html';
}

// ===== Escape HTML =====
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
