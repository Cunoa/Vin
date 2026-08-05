const navLinks = document.querySelectorAll('nav ul li a');
const sections = Array.from(navLinks).map(link => document.querySelector(link.hash));

function updateActiveMenu() {
    const scrollPos = window.scrollY + window.innerHeight * 0.3;
    let currentSection = sections[0];

    sections.forEach(section => {
        if (section && section.offsetTop <= scrollPos) {
            currentSection = section;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.hash === `#${currentSection.id}`);
    });
}

function applySectionBackground(sectionId) {
    document.body.classList.remove('bg-about', 'bg-product', 'bg-projects', 'bg-contact');

    if (sectionId === 'about') {
        document.body.classList.add('bg-about');
    } else if (sectionId === 'product') {
        document.body.classList.add('bg-product');
    } else if (sectionId === 'projects') {
        document.body.classList.add('bg-projects');
    } else if (sectionId === 'contact') {
        document.body.classList.add('bg-contact');
    }
}

if (navLinks.length > 0 && sections.length > 0) {
    window.addEventListener('scroll', () => {
        updateActiveMenu();
        const activeLink = document.querySelector('nav ul li a.active');
        if (activeLink) {
            applySectionBackground(activeLink.hash.replace('#', ''));
        }
    });
    window.addEventListener('load', () => {
        updateActiveMenu();
        const activeLink = document.querySelector('nav ul li a.active');
        if (activeLink) {
            applySectionBackground(activeLink.hash.replace('#', ''));
        }
    });
}

const guestbookForm = document.getElementById('guestbook-form');
const guestbookInput = document.getElementById('guestbook-input');
const guestbookList = document.getElementById('guestbook-list');

function getGuestbookKey(ip) {
    return `guestbook_${ip}`;
}

function renderGuestbook() {
    const saved = JSON.parse(localStorage.getItem('guestbook_entries') || '[]');
    guestbookList.innerHTML = '';

    if (!saved.length) {
        guestbookList.innerHTML = '<p class="guestbook-empty">아직 방명록이 없습니다. 첫 글을 남겨보세요.</p>';
        return;
    }

    saved.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'guestbook-item';
        item.innerHTML = `
            <p>${entry.message}</p>
            <div class="guestbook-meta">${entry.timestamp} • ${entry.ip}</div>
        `;
        guestbookList.appendChild(item);
    });
}

async function fetchPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('IP 조회 실패:', error);
        return 'unknown';
    }
}

guestbookForm.addEventListener('submit', async event => {
    event.preventDefault();
    const message = guestbookInput.value.trim();
    if (!message) {
        return;
    }

    const ip = await fetchPublicIP();
    const key = getGuestbookKey(ip);
    const existing = localStorage.getItem(key);
    if (existing) {
        alert('이미 방명록을 작성하셨습니다. IP당 한 개만 등록 가능합니다.');
        return;
    }

    const entries = JSON.parse(localStorage.getItem('guestbook_entries') || '[]');
    const newEntry = {
        ip,
        message,
        timestamp: new Date().toLocaleString(),
    };
    entries.unshift(newEntry);
    localStorage.setItem('guestbook_entries', JSON.stringify(entries));
    localStorage.setItem(key, JSON.stringify(newEntry));

    guestbookInput.value = '';
    renderGuestbook();
});

document.addEventListener('DOMContentLoaded', renderGuestbook);
