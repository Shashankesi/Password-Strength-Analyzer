/**
 * PASSWORD STRENGTH ANALYZER - JavaScript Frontend
 * Real-time password analysis with interactive visualizations
 */

// ====== CONFIGURATION ====== 
// Get API URL from window variable set by config.js
const API_BASE_URL = typeof window.API_BASE_URL !== 'undefined' ? window.API_BASE_URL : '/api';

// Debug: Log the API URL being used
console.log('🔌 API Base URL:', API_BASE_URL);
console.log('📍 Current hostname:', window.location.hostname);
console.log('🌍 Current origin:', window.location.origin);

const ANALYSIS_DEBOUNCE_DELAY = 300; // ms

// ====== DOM ELEMENTS ====== 
const elements = {
    // Input
    passwordInput: document.getElementById('passwordInput'),
    togglePassword: document.getElementById('togglePassword'),
    generatePasswordBtn: document.getElementById('generatePasswordBtn'),
    copyPasswordBtn: document.getElementById('copyPasswordBtn'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    
    // Strength
    strengthBar: document.getElementById('strengthBar'),
    strengthFill: document.getElementById('strengthFill'),
    strengthText: document.getElementById('strengthText'),
    strengthPercentage: document.getElementById('strengthPercentage'),
    strengthBadge: document.getElementById('strengthBadge'),
    
    // Results
    resultsContainer: document.getElementById('resultsContainer'),
    entropyValue: document.getElementById('entropyValue'),
    charsetValue: document.getElementById('charsetValue'),
    crackTimeValue: document.getElementById('crackTimeValue'),
    lengthValue: document.getElementById('lengthValue'),
    combinationsValue: document.getElementById('combinationsValue'),
    
    // Recommendations
    recommendationsContainer: document.getElementById('recommendationsContainer'),
    recommendationsList: document.getElementById('recommendationsList'),
    
    // History
    historySection: document.getElementById('historySection'),
    historyTableBody: document.getElementById('historyTableBody'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    
    // Other
    loadingSpinner: document.getElementById('loadingSpinner'),
    themeToggle: document.getElementById('themeToggle'),
};

// ====== STATE & CHARTS ====== 
let lastAnalysisResult = null;
let analysisTimeout = null;
let lengthChart = null;
let crackTimeChart = null;

// ====== EVENT LISTENERS ====== 
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeThemes();
    showLoadingSpinner(false);
});

function initializeEventListeners() {
    // Password input - real-time analysis with debounce
    elements.passwordInput.addEventListener('input', () => {
        clearTimeout(analysisTimeout);
        analysisTimeout = setTimeout(() => {
            analyzePassword();
        }, ANALYSIS_DEBOUNCE_DELAY);
    });
    
    // Show/Hide password toggle
    elements.togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // Generate strong password
    elements.generatePasswordBtn.addEventListener('click', generateStrongPassword);
    
    // Copy password
    elements.copyPasswordBtn.addEventListener('click', copyPasswordToClipboard);
    
    // Clear history
    elements.clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Export CSV
    elements.exportCsvBtn.addEventListener('click', exportHistoryToCSV);
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
}

// ====== PASSWORD ANALYSIS ====== 
async function analyzePassword() {
    const password = elements.passwordInput.value;
    
    if (!password) {
        resetResults();
        return;
    }
    
    showLoadingSpinner(true);
    
    try {
        console.log('📊 Analyzing password with API:', API_BASE_URL);
        
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', response.status, errorText);
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Analysis successful:', result);
        lastAnalysisResult = result;
        
        // Update UI with results
        updateStrengthMeter(result);
        updateResultsCards(result);
        updateRecommendations(result);
        updateGraphs(result);
        updateHistory();
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        console.error('📍 Attempted API URL:', API_BASE_URL);
        
        // Show detailed error message
        const errorMessage = error.message.includes('fetch') 
            ? `Network Error: Cannot reach API at ${API_BASE_URL}. Make sure backend is running and RENDER_BACKEND_URL is set.`
            : `Error analyzing password: ${error.message}`;
        
        showNotification(errorMessage, 'error');
    } finally {
        showLoadingSpinner(false);
    }
}

function updateStrengthMeter(result) {
    const entropy = result.entropy;
    const strength = result.strength;
    const color = result.strength_color;
    
    // Calculate percentage (max entropy ~100 for visualization)
    const percentage = Math.min((entropy / 100) * 100, 100);
    
    // Animate strength bar
    elements.strengthFill.style.width = percentage + '%';
    elements.strengthFill.style.background = getStrengthGradient(color);
    
    // Update strength text
    const strengthLabels = {
        'weak': '🔴 Weak',
        'moderate': '🟠 Moderate',
        'strong': '🔵 Strong',
        'very_strong': '🟢 Very Strong'
    };
    
    elements.strengthText.textContent = strengthLabels[strength] || 'Unknown';
    elements.strengthPercentage.textContent = Math.round(percentage) + '%';
    
    // Show results container
    elements.resultsContainer.style.display = 'grid';
    elements.resultsContainer.style.animation = 'fadeIn 0.6s ease-out';
}

function updateResultsCards(result) {
    const entropy = result.entropy;
    const strength = result.strength;
    const charsetSize = result.charset_size;
    const crackTime = result.crack_time;
    const length = result.password_length;
    const combinations = result.combinations;
    
    // Animate counter updates
    animateCounterUpdate(elements.entropyValue, entropy, 0, 2);
    elements.strengthBadge.textContent = strength.charAt(0).toUpperCase() + strength.slice(1);
    elements.strengthBadge.style.color = result.strength_color;
    animateCounterUpdate(elements.charsetValue, charsetSize, 0, 0);
    elements.crackTimeValue.textContent = crackTime.display;
    animateCounterUpdate(elements.lengthValue, length, 0, 0);
    
    // Format combinations for display
    const formattedCombinations = formatLargeNumber(combinations);
    elements.combinationsValue.textContent = formattedCombinations;
}

function updateRecommendations(result) {
    const recommendations = result.recommendations;
    
    elements.recommendationsList.innerHTML = '';
    
    recommendations.forEach((rec, index) => {
        const item = document.createElement('div');
        item.className = `recommendation-item priority-${rec.priority}`;
        item.style.animation = `slideInLeft 0.5s ease-out ${index * 0.1}s both`;
        
        const iconMap = {
            'a-z': '🔤',
            'A-Z': '🔤',
            '0-9': '🔢',
            '!@#': '✨',
            '↑': '📈',
            '✓': '✅'
        };
        
        item.innerHTML = `
            <div class="recommendation-icon">${iconMap[rec.icon] || rec.icon}</div>
            <div class="recommendation-text">${rec.text}</div>
        `;
        
        elements.recommendationsList.appendChild(item);
    });
    
    elements.recommendationsContainer.style.display = 'block';
    elements.recommendationsContainer.style.animation = 'slideInLeft 0.6s ease-out 0.2s both';
}

function updateGraphs(result) {
    const graphData = result.graph_data;
    
    // Update Length vs Combinations chart
    updateLengthChart(graphData.length_vs_combinations, result.charset_size);
    
    // Update Crack Time Comparison chart
    updateCrackTimeChart(graphData.crack_time_comparison);
}

function updateLengthChart(data, currentCharset) {
    const ctx = document.getElementById('lengthChart').getContext('2d');
    
    // Destroy existing chart
    if (lengthChart) {
        lengthChart.destroy();
    }
    
    const labels = data.map(d => d.length);
    const values = data.map(d => Math.min(d.log_combinations, 30)); // Cap for visualization
    
    // Highlight current password
    const colors = data.map(d => d.is_current ? '#2ed573' : 'rgba(30, 144, 255, 0.5)');
    
    lengthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Log10(Combinations)',
                data: values,
                borderColor: '#1e90ff',
                backgroundColor: 'rgba(30, 144, 255, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: data.map(d => d.is_current ? 8 : 4),
                pointBackgroundColor: colors,
                pointBorderColor: colors,
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                animations: {
                    tension: {
                        duration: 1000,
                        from: 0.1,
                        to: 0.4,
                        loop: false
                    }
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#b0b9c3',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#b0b9c3' },
                    grid: { color: 'rgba(30, 144, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Security Strength (Log Scale)',
                        color: '#b0b9c3'
                    }
                },
                x: {
                    ticks: { color: '#b0b9c3' },
                    grid: { color: 'rgba(30, 144, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Password Length (characters)',
                        color: '#b0b9c3'
                    }
                }
            }
        }
    });
}

function updateCrackTimeChart(data) {
    const ctx = document.getElementById('crackTimeChart').getContext('2d');
    
    // Destroy existing chart
    if (crackTimeChart) {
        crackTimeChart.destroy();
    }
    
    // Convert to log scale for better visualization
    const crackTimeData = data.map(d => {
        // Convert years to seconds for calculation, then cap for visualization
        const seconds = Math.max(d.years * 365.25 * 24 * 3600, 1);
        return Math.log10(seconds);
    });
    
    const labels = data.map(d => d.name);
    const colors = data.map(d => d.color);
    
    crackTimeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Time to Crack (Log Scale - seconds)',
                data: crackTimeData,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: colors.map(c => c + 'dd')
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#b0b9c3',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#b0b9c3' },
                    grid: { color: 'rgba(30, 144, 255, 0.1)' },
                    title: {
                        display: true,
                        text: 'Time to Crack (Log10 seconds)',
                        color: '#b0b9c3'
                    }
                },
                y: {
                    ticks: { color: '#b0b9c3' },
                    grid: { display: false }
                }
            }
        }
    });
}

// ====== HISTORY MANAGEMENT ====== 
async function updateHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/history`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        
        const data = await response.json();
        const history = data.history;
        
        if (history.length > 0) {
            elements.historySection.style.display = 'block';
            updateHistoryTable(history);
        }
    } catch (error) {
        console.error('History fetch error:', error);
    }
}

function updateHistoryTable(history) {
    elements.historyTableBody.innerHTML = '';
    
    history.forEach(entry => {
        const row = document.createElement('tr');
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleString();
        
        row.innerHTML = `
            <td>${entry.id}</td>
            <td>${entry.length}</td>
            <td>${entry.entropy}</td>
            <td><span style="color: ${getStrengthColor(entry.strength)}">${entry.strength}</span></td>
            <td>${entry.crack_time_display}</td>
            <td>${dateStr}</td>
        `;
        
        elements.historyTableBody.appendChild(row);
    });
}

async function clearHistory() {
    if (!confirm('Are you sure you want to clear all history?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/history`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to clear history');
        }
        
        elements.historySection.style.display = 'none';
        elements.historyTableBody.innerHTML = '';
        showNotification('History cleared successfully', 'success');
    } catch (error) {
        console.error('Clear history error:', error);
        showNotification('Error clearing history', 'error');
    }
}

function exportHistoryToCSV() {
    if (!lastAnalysisResult) {
        showNotification('No history to export', 'warning');
        return;
    }
    
    const rows = elements.historyTableBody.querySelectorAll('tr');
    
    if (rows.length === 0) {
        showNotification('No history to export', 'warning');
        return;
    }
    
    let csv = 'ID,Length,Entropy,Strength,Crack Time,Timestamp\n';
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const data = Array.from(cells).map(cell => cell.textContent.trim()).join(',');
        csv += data + '\n';
    });
    
    downloadCSV(csv, 'password-history.csv');
    showNotification('History exported successfully', 'success');
}

function downloadCSV(csv, filename) {
    const link = document.createElement('a');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ====== PASSWORD GENERATION ====== 
async function generateStrongPassword() {
    showLoadingSpinner(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/generate-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ length: 16 })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate password');
        }
        
        const result = await response.json();
        const generatedPassword = result.generated_password;
        
        // Set password in input and analyze
        elements.passwordInput.value = generatedPassword;
        elements.passwordInput.type = 'text'; // Show generated password
        
        lastAnalysisResult = result;
        updateStrengthMeter(result);
        updateResultsCards(result);
        updateRecommendations(result);
        updateGraphs(result);
        updateHistory();
        
        // Show copy button
        elements.copyPasswordBtn.style.display = 'flex';
        showNotification('Strong password generated!', 'success');
        
    } catch (error) {
        console.error('Generation error:', error);
        showNotification('Error generating password', 'error');
    } finally {
        showLoadingSpinner(false);
    }
}

// ====== UI INTERACTIONS ====== 
function togglePasswordVisibility() {
    const isPassword = elements.passwordInput.type === 'password';
    elements.passwordInput.type = isPassword ? 'text' : 'password';
    
    const icon = elements.togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

function copyPasswordToClipboard() {
    const password = elements.passwordInput.value;
    
    navigator.clipboard.writeText(password).then(() => {
        showNotification('Password copied to clipboard!', 'success');
        
        // Visual feedback
        const originalText = elements.copyPasswordBtn.textContent;
        elements.copyPasswordBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            elements.copyPasswordBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        showNotification('Failed to copy password', 'error');
    });
}

function resetResults() {
    elements.resultsContainer.style.display = 'none';
    elements.recommendationsContainer.style.display = 'none';
    elements.strengthFill.style.width = '0%';
    elements.strengthText.textContent = 'No password analyzed';
    elements.strengthPercentage.textContent = '0%';
    elements.copyPasswordBtn.style.display = 'none';
}

function showLoadingSpinner(show) {
    elements.loadingSpinner.style.display = show ? 'flex' : 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 999;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationColor(type) {
    const colors = {
        'success': '#2ed573',
        'error': '#ff4757',
        'warning': '#ffa502',
        'info': '#1e90ff'
    };
    return colors[type] || colors.info;
}

// ====== THEME MANAGEMENT ====== 
function initializeThemes() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    }
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        elements.themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.remove('light-mode');
        elements.themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }
}

// ====== UTILITY FUNCTIONS ====== 
function animateCounterUpdate(element, finalValue, startValue = 0, decimals = 2) {
    const duration = 600;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (finalValue - startValue) * progress;
        
        if (decimals === 0) {
            element.textContent = Math.round(currentValue);
        } else {
            element.textContent = currentValue.toFixed(decimals);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function formatLargeNumber(num) {
    if (num >= 1e308) return '∞';
    if (num >= 1e24) return (num / 1e24).toFixed(2) + ' septillion';
    if (num >= 1e21) return (num / 1e21).toFixed(2) + ' sextillion';
    if (num >= 1e18) return (num / 1e18).toFixed(2) + ' quintillion';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + ' quadrillion';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' billion';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' million';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + ' thousand';
    return num.toFixed(0);
}

function getStrengthGradient(color) {
    return `linear-gradient(90deg, #ff4757, #ffa502, #1e90ff, #2ed573)`;
}

function getStrengthColor(strength) {
    const colors = {
        'weak': '#ff4757',
        'moderate': '#ffa502',
        'strong': '#1e90ff',
        'very_strong': '#2ed573'
    };
    return colors[strength] || '#ffffff';
}

// ====== API ERROR HANDLING ====== 
// Handle API connection errors
window.addEventListener('online', () => {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Offline mode - features may be limited', 'warning');
});

console.log('🔐 Password Strength Analyzer loaded successfully!');
