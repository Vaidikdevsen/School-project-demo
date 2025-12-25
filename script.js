// script.js - Main application logic

import { studentDB, teacherDB, timetableDB, baseTT, announcementsDB, eventsDB } from './database.js';

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

function saveToLocal(name, data) {
    try {
        localStorage.setItem(name, JSON.stringify(data));
    } catch (error) {
        showToast('Storage error: ' + error.message, 'error');
    }
}

function loadFromLocal(name) {
    try {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        showToast('Data load error: ' + error.message, 'error');
        return null;
    }
}

function deleteFromLocal(name) {
    localStorage.removeItem(name);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} toast-icon"></i>
        <span>${message}</span>
        <i class="fas fa-times toast-close" onclick="this.parentElement.remove()"></i>
    `;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

function showAlert(id, message, type) {
    const alert = document.getElementById(id);
    alert.textContent = message;
    alert.className = `alert ${type}`;
    alert.classList.remove('hidden');
    setTimeout(() => alert.classList.add('hidden'), 3000);
}

// ================================================================
// THEME FUNCTIONS
// ================================================================

function toggleTheme() {
    const current = localStorage.getItem('theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme', next === 'dark');
    localStorage.setItem('theme', next);
    document.querySelector('.theme-icon').className = next === 'dark' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
    showToast(`Switched to ${next} theme`, 'success');
}

function applyTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', saved === 'dark');
    document.querySelector('.theme-icon').className = saved === 'dark' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
}

// ================================================================
// LOGIN & AUTH
// ================================================================

let selectedUserType = 'student';
let currentUser = null;
let userType = 'student';

function selectUserType(type) {
    selectedUserType = type;
    document.querySelectorAll('.user-type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`button[onclick="selectUserType('${type}')"]`).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const id = document.getElementById('userId').value.trim().toUpperCase();
    const pass = document.getElementById('password').value;

    const db = selectedUserType === 'student' ? studentDB : teacherDB;
    const user = db[id];

    if (user && user.password === simpleHash(pass)) {
        currentUser = { ...user, id };
        userType = selectedUserType;
        saveToLocal('currentUser', currentUser);
        saveToLocal('userType', userType);
        document.getElementById('loginPage').classList.add('hidden');
        if (userType === 'student') showStudentDash();
        else showTeacherDash();
        showToast('Login successful!', 'success');
    } else {
        showAlert('loginAlert', 'Invalid ID or password!', 'error');
    }
}

function showStudentDash() {
    document.getElementById('studentDashboard').classList.remove('hidden');
    document.getElementById('studentWelcome').textContent = `Welcome, ${currentUser.name}!`;
    document.getElementById('studentName').textContent = currentUser.name;
    document.getElementById('studentClass').textContent = currentUser.class || 'N/A';
    document.getElementById('studentAvatar').textContent = currentUser.name.charAt(0);
}

function showTeacherDash() {
    document.getElementById('teacherDashboard').classList.remove('hidden');
    document.getElementById('teacherWelcome').textContent = `Welcome, ${currentUser.name}!`;
    document.getElementById('teacherName').textContent = currentUser.name;
    document.getElementById('teacherSubject').textContent = currentUser.subject || 'N/A';
    document.getElementById('teacherAvatar').textContent = currentUser.name.charAt(0);
}

function logout() {
    currentUser = null;
    deleteFromLocal('currentUser');
    deleteFromLocal('userType');
    document.querySelectorAll('.dashboard').forEach(d => d.classList.add('hidden'));
    document.getElementById('loginPage').classList.remove('hidden');
    showToast('Logged out successfully', 'info');
}

// ================================================================
// PAGE NAVIGATION
// ================================================================

function openPage(page) {
    document.querySelectorAll('.full-page').forEach(p => p.innerHTML = '');
    document.querySelectorAll('.dashboard').forEach(d => d.classList.add('hidden'));
    const pageEl = document.getElementById(`${page}Page`);
    pageEl.classList.remove('hidden');

    // Simple placeholder content for all pages
    pageEl.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fas fa-${getIcon(page)}"></i> ${page.replace(/([A-Z])/g, ' $1').trim()}</h1>
            <button class="btn-back" onclick="backToDashboard()">Back</button>
        </div>
        <div class="page-content">
            <div class="card" style="text-align:center; padding:3rem;">
                <h2>Under Development</h2>
                <p>This feature will be available soon!</p>
            </div>
        </div>
    `;
}

function getIcon(page) {
    const icons = {
        assignments: 'tasks',
        attendance: 'calendar-check',
        timetable: 'clock',
        results: 'chart-line',
        studyMaterials: 'book-open',
        homework: 'clipboard-list',
        feePayment: 'rupee-sign',
        library: 'book',
        events: 'calendar-alt',
        announcements: 'bullhorn',
        certificates: 'certificate',
        profile: 'user'
    };
    return icons[page] || 'info-circle';
}

function backToDashboard() {
    document.querySelectorAll('.full-page').forEach(p => p.classList.add('hidden'));
    if (userType === 'student') showStudentDash();
    else showTeacherDash();
}

// ================================================================
// PASSWORD CHANGE
// ================================================================

function openChangePassword() {
    document.getElementById('changePasswordModal').classList.add('active');
}

function closeChangePassword() {
    document.getElementById('changePasswordModal').classList.remove('active');
}

function handleChangePassword(e) {
    e.preventDefault();
    const curr = document.getElementById('currentPassword').value;
    const newP = document.getElementById('newPassword').value;
    const conf = document.getElementById('confirmPassword').value;

    if (simpleHash(curr) !== currentUser.password) {
        showAlert('changePasswordAlert', 'Current password incorrect!', 'error');
        return;
    }
    if (newP !== conf) {
        showAlert('changePasswordAlert', 'Passwords do not match!', 'error');
        return;
    }
    if (newP.length < 6) {
        showAlert('changePasswordAlert', 'Password must be at least 6 characters!', 'error');
        return;
    }

    const hashed = simpleHash(newP);
    if (userType === 'student') studentDB[currentUser.id].password = hashed;
    else teacherDB[currentUser.id].password = hashed;
    currentUser.password = hashed;
    saveToLocal('currentUser', currentUser);
    showToast('Password changed successfully!', 'success');
    setTimeout(closeChangePassword, 1500);
}

// ================================================================
// INIT
// ================================================================

window.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    const savedUser = loadFromLocal('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        userType = loadFromLocal('userType') || 'student';
        if (userType === 'student') showStudentDash();
        else showTeacherDash();
    }
    updateScrollProgress();
});

// Scroll progress
function updateScrollProgress() {
    const el = document.querySelector('.dash-content:not(.hidden), .page-content:not(.hidden)');
    if (!el) return;
    el.addEventListener('scroll', () => {
        const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
        document.getElementById('scrollProgress').style.width = progress + '%';
    });
}

function scrollToTop() {
    const el = document.querySelector('.dash-content:not(.hidden), .page-content:not(.hidden)');
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
}