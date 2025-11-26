// Firebase Configuration - loaded from environment variables (.env file)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global State
let currentUser = null;
let channels = [];
let currentCategory = 'all';
let currentSearchQuery = '';
let editingChannelId = null;
let channelErrors = {};

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');
const addChannelBtn = document.getElementById('addChannelBtn');
const channelModal = document.getElementById('channelModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const channelForm = document.getElementById('channelForm');
const saveChannelBtn = document.getElementById('saveChannelBtn');
const formError = document.getElementById('formError');
const categoryTabs = document.getElementById('categoryTabs');
const channelsGrid = document.getElementById('channelsGrid');
const emptyState = document.getElementById('emptyState');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');

// Authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        showDashboard();
        loadChannels();
    } else {
        currentUser = null;
        showLogin();
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    setLoading(loginBtn, true);
    hideError(loginError);
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Login error:', error);
        showError(loginError, getErrorMessage(error.code));
        setLoading(loginBtn, false);
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Load channels
async function loadChannels() {
    try {
        const q = query(collection(db, 'channels'), orderBy('category'));
        const querySnapshot = await getDocs(q);
        channels = [];
        querySnapshot.forEach((doc) => {
            channels.push({ id: doc.id, ...doc.data() });
        });
        renderCategories();
        renderChannels();
        validateAllStreams();
    } catch (error) {
        console.error('Error loading channels:', error);
        showError(formError, 'Failed to load channels. Please refresh the page.');
    }
}

// Validate all streams
async function validateAllStreams() {
    console.log('🔍 Starting automatic stream validation for', channels.length, 'channels...');
    for (const channel of channels) {
        validateStreamUrl(channel.id, channel.url, channel.title);
    }
}

// Validate single stream - 30 SECOND TIMEOUT FOR SLOW STREAMS
function validateStreamUrl(channelId, streamUrl, channelTitle) {
    const audio = new Audio();
    let timeout;
    let hasResponded = false;
    audio.volume = 0;
    audio.preload = 'metadata';

    timeout = setTimeout(() => {
        if (!hasResponded) {
            hasResponded = true;
            audio.pause();
            audio.src = '';
            channelErrors[channelId] = 1;
            console.log(`❌ Stream validation failed (timeout): ${channelTitle}`);
            renderChannels();
        }
    }, 30000); // 30 seconds for slow-buffering streams

    audio.addEventListener('canplay', () => {
        if (!hasResponded) {
            hasResponded = true;
            clearTimeout(timeout);
            audio.pause();
            audio.src = '';
            if (channelErrors[channelId]) delete channelErrors[channelId];
            console.log(`✅ Stream validation passed: ${channelTitle}`);
        }
    }, { once: true });

    audio.addEventListener('playing', () => {
        if (!hasResponded) {
            hasResponded = true;
            clearTimeout(timeout);
            audio.pause();
            audio.src = '';
            if (channelErrors[channelId]) delete channelErrors[channelId];
            console.log(`✅ Stream validation passed (playing): ${channelTitle}`);
        }
    }, { once: true });

    audio.addEventListener('error', (e) => {
        if (!hasResponded) {
            hasResponded = true;
            clearTimeout(timeout);
            audio.src = '';
            channelErrors[channelId] = 1;
            const errorType = audio.error ? audio.error.code : 'unknown';
            console.log(`❌ Stream validation failed (error ${errorType}): ${channelTitle}`);
            renderChannels();
        }
    }, { once: true });

    try {
        audio.src = streamUrl;
        audio.load();
        audio.play().catch(err => {
            console.log(`ℹ️ Autoplay blocked for ${channelTitle}, but testing stream...`);
        });
    } catch (e) {
        if (!hasResponded) {
            hasResponded = true;
            clearTimeout(timeout);
            channelErrors[channelId] = 1;
            console.log(`❌ Stream validation failed (exception): ${channelTitle}`, e);
            renderChannels();
        }
    }
}

// CRUD Operations
async function addChannel(channelData) {
    try {
        const docRef = await addDoc(collection(db, 'channels'), { ...channelData, createdAt: new Date().toISOString() });
        console.log('Channel added with ID:', docRef.id);
        await loadChannels();
        closeModalDialog();
    } catch (error) {
        console.error('Error adding channel:', error);
        throw error;
    }
}

async function updateChannel(channelId, channelData) {
    try {
        const channelRef = doc(db, 'channels', channelId);
        await updateDoc(channelRef, { ...channelData, updatedAt: new Date().toISOString() });
        console.log('Channel updated:', channelId);
        await loadChannels();
        closeModalDialog();
    } catch (error) {
        console.error('Error updating channel:', error);
        throw error;
    }
}

// Delete channel - exposed to window for onclick handlers
window.deleteChannel = async function (channelId) {
    console.log('Delete button clicked for channel:', channelId);

    // Find the channel to get its name
    const channel = channels.find(ch => ch.id === channelId);
    const channelName = channel ? channel.title : 'this channel';

    // Show confirmation dialog
    const confirmed = confirm(`⚠️ DELETE CHANNEL\n\nAre you sure you want to permanently delete "${channelName}"?\n\nThis action CANNOT be undone!`);

    if (!confirmed) {
        console.log('Delete cancelled by user');
        return;
    }

    console.log('Delete confirmed, deleting channel...');

    try {
        await deleteDoc(doc(db, 'channels', channelId));
        console.log('✅ Channel deleted successfully:', channelId);
        await loadChannels();
    } catch (error) {
        console.error('❌ Error deleting channel:', error);
        alert('Failed to delete channel. Please try again.\n\nError: ' + error.message);
    }
}

// Render categories
function renderCategories() {
    const categories = ['all'];
    const categoryCounts = { all: channels.length };
    channels.forEach(channel => {
        const category = channel.category || 'Uncategorized';
        if (!categories.includes(category)) {
            categories.push(category);
            categoryCounts[category] = 0;
        }
        categoryCounts[category]++;
    });
    categoryTabs.innerHTML = categories.map(category => `
        <button class="tab-btn ${category === currentCategory ? 'active' : ''}" data-category="${category}">
            ${category === 'all' ? 'All Channels' : category}
            <span class="tab-count" id="count-${category}">${categoryCounts[category]}</span>
        </button>
    `).join('');
    categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            renderCategories();
            renderChannels();
        });
    });
}

// Render channels
function renderChannels() {
    let filteredChannels = currentCategory === 'all' ? channels : channels.filter(ch => ch.category === currentCategory);
    if (currentSearchQuery.trim()) {
        const query = currentSearchQuery.toLowerCase();
        filteredChannels = filteredChannels.filter(ch =>
            ch.title.toLowerCase().includes(query) ||
            (ch.category && ch.category.toLowerCase().includes(query)) ||
            (ch.genre && ch.genre.toLowerCase().includes(query))
        );
    }
    if (filteredChannels.length === 0) {
        channelsGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');
    channelsGrid.innerHTML = filteredChannels.map(channel => {
        const errorCount = channelErrors[channel.id] || 0;
        const errorBadge = errorCount > 0 ? `<span class="error-badge" title="${errorCount} playback error(s)">${errorCount} ⚠️</span>` : '';
        return `
        <div class="channel-card" data-id="${channel.id}">
            <img src="${channel.imgurl || 'https://via.placeholder.com/400x300/667eea/ffffff?text=No+Image'}" alt="${channel.title}" class="channel-image" onerror="this.src='https://via.placeholder.com/400x300/667eea/ffffff?text=No+Image'">
            <div class="channel-content">
                <h3 class="channel-title">${channel.title} ${errorBadge}</h3>
                <div class="audio-player" id="player-${channel.id}">
                    <button class="btn-play" onclick="togglePlay('${channel.id}', '${channel.url.replace(/'/g, "\\'")}', '${channel.title.replace(/'/g, "\\'")}')">
                        <svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        <svg class="pause-icon hidden" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                        <svg class="loading-icon hidden" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="31.4 31.4" stroke-linecap="round"/></svg>
                        <span class="play-text">Play</span>
                    </button>
                    <div class="player-info"><span class="player-status">Ready to play</span></div>
                </div>
                <div class="channel-actions">
                    <button class="btn-icon edit" onclick="editChannel('${channel.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        Edit
                    </button>
                    <button class="btn-icon delete" onclick="deleteChannel('${channel.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
    updateFailedCounter();
}

// Update failed counter
function updateFailedCounter() {
    const failedCounter = document.getElementById('failedStationsCounter');
    const failedCount = document.getElementById('failedCount');
    if (!failedCounter || !failedCount) return;
    const failedChannelsCount = Object.keys(channelErrors).filter(id => channelErrors[id] > 0).length;
    if (failedChannelsCount > 0) {
        failedCount.textContent = failedChannelsCount;
        failedCounter.classList.remove('hidden');
    } else {
        failedCounter.classList.add('hidden');
    }
}

// Audio player
let currentAudio = null;
let currentPlayerId = null;

window.togglePlay = async function (channelId, streamUrl, channelTitle) {
    const playerElement = document.getElementById(`player-${channelId}`);
    if (!playerElement) return;
    const playIcon = playerElement.querySelector('.play-icon');
    const pauseIcon = playerElement.querySelector('.pause-icon');
    const loadingIcon = playerElement.querySelector('.loading-icon');
    const playText = playerElement.querySelector('.play-text');
    const statusText = playerElement.querySelector('.player-status');

    if (currentAudio && currentPlayerId === channelId) {
        currentAudio.pause();
        currentAudio = null;
        currentPlayerId = null;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        loadingIcon.classList.add('hidden');
        playText.textContent = 'Play';
        statusText.textContent = 'Ready to play';
        playerElement.classList.remove('playing', 'loading');
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        const prevPlayer = document.getElementById(`player-${currentPlayerId}`);
        if (prevPlayer) {
            prevPlayer.querySelector('.play-icon').classList.remove('hidden');
            prevPlayer.querySelector('.pause-icon').classList.add('hidden');
            prevPlayer.querySelector('.loading-icon').classList.add('hidden');
            prevPlayer.querySelector('.play-text').textContent = 'Play';
            prevPlayer.querySelector('.player-status').textContent = 'Ready to play';
            prevPlayer.classList.remove('playing', 'loading');
        }
    }

    playIcon.classList.add('hidden');
    pauseIcon.classList.add('hidden');
    loadingIcon.classList.remove('hidden');
    playText.textContent = 'Loading...';
    statusText.textContent = 'Connecting to stream...';
    playerElement.classList.add('loading');

    currentAudio = new Audio(streamUrl);
    currentPlayerId = channelId;

    currentAudio.addEventListener('playing', () => {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        loadingIcon.classList.add('hidden');
        playText.textContent = 'Pause';
        statusText.textContent = `Now playing: ${channelTitle}`;
        playerElement.classList.remove('loading');
        playerElement.classList.add('playing');
    });

    currentAudio.addEventListener('loadstart', () => { statusText.textContent = 'Loading stream...'; });
    currentAudio.addEventListener('canplay', () => { statusText.textContent = 'Stream ready'; });

    currentAudio.addEventListener('error', (e) => {
        channelErrors[channelId] = (channelErrors[channelId] || 0) + 1;
        renderChannels();
        let errorMsg = 'Failed to load stream';
        if (currentAudio.error) {
            switch (currentAudio.error.code) {
                case 1: errorMsg = 'Stream loading aborted'; break;
                case 2: errorMsg = 'Network error'; break;
                case 3: errorMsg = 'Stream format error'; break;
                case 4: errorMsg = 'Stream not supported'; break;
            }
        }
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        loadingIcon.classList.add('hidden');
        playText.textContent = 'Play';
        statusText.textContent = errorMsg;
        playerElement.classList.remove('playing', 'loading');
        playerElement.classList.add('error');
        console.error('Audio playback error:', e);
    });

    try {
        await currentAudio.play();
    } catch (error) {
        console.error('Play error:', error);
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        loadingIcon.classList.add('hidden');
        playText.textContent = 'Play';
        statusText.textContent = 'Failed to play';
        playerElement.classList.remove('playing', 'loading');
        playerElement.classList.add('error');
    }
};

// Modal management
addChannelBtn.addEventListener('click', () => {
    editingChannelId = null;
    modalTitle.textContent = 'Add Channel';
    channelForm.reset();
    hideError(formError);
    openModalDialog();
});

window.editChannel = function (channelId) {
    const channel = channels.find(ch => ch.id === channelId);
    if (!channel) return;
    editingChannelId = channelId;
    modalTitle.textContent = 'Edit Channel';
    document.getElementById('channelTitle').value = channel.title || '';
    document.getElementById('channelCategory').value = channel.category || '';
    document.getElementById('channelUrl').value = channel.url || '';
    document.getElementById('channelimgurl').value = channel.imgurl || '';
    document.getElementById('channelGenre').value = channel.genre || '';
    hideError(formError);
    openModalDialog();
};

closeModal.addEventListener('click', closeModalDialog);
cancelBtn.addEventListener('click', closeModalDialog);
channelModal.addEventListener('click', (e) => { if (e.target === channelModal) closeModalDialog(); });

channelForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const channelData = {
        title: document.getElementById('channelTitle').value.trim(),
        category: document.getElementById('channelCategory').value.trim(),
        url: document.getElementById('channelUrl').value.trim(),
        imgurl: document.getElementById('channelimgurl').value.trim(),
        genre: document.getElementById('channelGenre').value.trim()
    };
    setLoading(saveChannelBtn, true);
    hideError(formError);
    try {
        if (editingChannelId) {
            await updateChannel(editingChannelId, channelData);
        } else {
            await addChannel(channelData);
        }
        // Success - button state will be reset when modal closes
    } catch (error) {
        showError(formError, 'Failed to save channel. Please try again.');
        setLoading(saveChannelBtn, false);
    }
});

// Search
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderChannels();
        if (currentSearchQuery.trim()) {
            clearSearchBtn.classList.remove('hidden');
        } else {
            clearSearchBtn.classList.add('hidden');
        }
    });
}

if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderChannels();
        searchInput.focus();
    });
}

// Helper functions
function showLogin() {
    loginScreen.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
}

function showDashboard() {
    loginScreen.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    if (currentUser) userEmail.textContent = currentUser.email;
}

function openModalDialog() {
    channelModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModalDialog() {
    channelModal.classList.add('hidden');
    document.body.style.overflow = '';
    channelForm.reset();
    editingChannelId = null;
    // Reset save button loading state
    setLoading(saveChannelBtn, false);
}

function setLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    if (loading) {
        button.disabled = true;
        btnText.style.opacity = '0';
        btnLoader.classList.add('active');
    } else {
        button.disabled = false;
        btnText.style.opacity = '1';
        btnLoader.classList.remove('active');
    }
}

function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

function hideError(element) {
    element.textContent = '';
    element.classList.add('hidden');
}

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later'
    };
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

console.log('Radio Admin Panel initialized - 30s timeout for slow streams');
