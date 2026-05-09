// ============================================
// OLUPOT FAMILY WEBSITE - MASTER SCRIPT
// ============================================
// Includes: Hero Slideshow, Gallery (Cloudinary upload),
// Profiles (family tree modals), Stories (CRUD), Home CTA
// AND Visitor Tracking with AUTOMATIC EMAIL to agemoelizabeth07@gmail.com
// ============================================

// ============================================
// 0. VISITOR TRACKING (Auto emails to Gmail)
// ============================================

// YOUR FORMSPREE ENDPOINT (already configured)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mpqbykby';

// Function to get visitor's location via free IP API
async function getVisitorLocation() {
    try {
        const response = await fetch('https://ip-api.com/json/');
        const data = await response.json();
        if (data.status === 'success') {
            return {
                country: data.country,
                city: data.city,
                region: data.regionName,
                ip: data.query,
                lat: data.lat,
                lon: data.lon,
                timezone: data.timezone
            };
        }
        return null;
    } catch (error) {
        console.error('Location fetch failed:', error);
        return null;
    }
}

// Function to send email notification automatically
async function sendEmailNotification(pageName, location, deviceInfo) {
    const visitTime = new Date().toLocaleString('en-US', { 
        timeZone: location?.timezone || 'Africa/Kampala',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let locationText = '📍 Location: Could not detect';
    let mapLink = '';
    if (location) {
        locationText = `📍 ${location.city}, ${location.region}, ${location.country}`;
        mapLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;
    }
    
    // Prepare email data for Formspree
    const emailData = {
        email: 'agemoelizabeth07@gmail.com',
        subject: `🔔 Olupot Family Visitor - ${pageName}`,
        message: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👨‍👩‍👧‍👦 OLUPOT FAMILY WEBSITE VISITOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Visit Time: ${visitTime}
📄 Page Visited: ${pageName}

${locationText}
${mapLink ? `🗺️ View Map: ${mapLink}` : ''}
🖥️ IP Address: ${location?.ip || 'Hidden'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 DEVICE INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Device: ${deviceInfo.device}
• Browser: ${deviceInfo.browser}
• OS: ${deviceInfo.os}
• Screen: ${deviceInfo.screen}
• Language: ${deviceInfo.language}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💝 This is an automated notification from your family website.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `
    };
    
    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        
        if (response.ok) {
            console.log('📧 Email notification sent successfully to agemoelizabeth07@gmail.com');
        } else {
            console.error('Email send failed:', await response.text());
        }
    } catch (error) {
        console.error('Email send error:', error);
    }
}

// Track page visit
async function trackPageVisit() {
    // Get page name
    const pageName = document.title || window.location.pathname.split('/').pop() || 'Unknown';
    
    // Get location
    const location = await getVisitorLocation();
    
    // Get device info
    const userAgent = navigator.userAgent;
    const deviceInfo = {
        device: /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent) ? '📱 Mobile/Tablet' : '💻 Desktop',
        browser: (() => {
            if (userAgent.includes('Chrome')) return 'Chrome';
            if (userAgent.includes('Firefox')) return 'Firefox';
            if (userAgent.includes('Safari')) return 'Safari';
            if (userAgent.includes('Edge')) return 'Edge';
            return 'Other';
        })(),
        os: (() => {
            if (userAgent.includes('Windows')) return 'Windows';
            if (userAgent.includes('Mac')) return 'macOS';
            if (userAgent.includes('Linux')) return 'Linux';
            if (userAgent.includes('Android')) return 'Android';
            if (userAgent.includes('iOS')) return 'iOS';
            return 'Other';
        })(),
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
    };
    
    // Send email (only once per session to avoid spam)
    const sessionTracked = sessionStorage.getItem('olupot_tracked');
    if (!sessionTracked) {
        sessionStorage.setItem('olupot_tracked', 'true');
        await sendEmailNotification(pageName, location, deviceInfo);
        
        // Also store locally for backup
        const visits = JSON.parse(localStorage.getItem('olupot_visits') || '[]');
        visits.unshift({
            timestamp: new Date().toISOString(),
            page: pageName,
            location: location ? `${location.city}, ${location.country}` : 'Unknown',
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            ip: location?.ip || 'Hidden'
        });
        if (visits.length > 50) visits.pop();
        localStorage.setItem('olupot_visits', JSON.stringify(visits));
        
        console.log(`🍃 Visitor tracked: ${pageName} from ${location?.city || 'unknown location'}`);
    }
}

// Run tracking when page loads
trackPageVisit();

// Admin function to view all visits (type showVisits() in console if needed later)
window.showVisits = function() {
    const visits = JSON.parse(localStorage.getItem('olupot_visits') || '[]');
    console.table(visits);
    return visits;
};

// ============================================
// 1. HERO BACKGROUND SLIDESHOW (all pages)
// ============================================
if (document.querySelector('.hero')) {
    const heroImages = [
        '/images/image 1.jpg',
        '/images/image 2.jpg',
        '/images/image 3.jpg',
        '/images/image 4.jpg',
        '/images/image 5.jpg',
        '/images/image 6.jpg',
        '/images/image 7.jpg',
        '/images/image 8.jpg',
        '/images/image 9.jpg',
        '/images/image 10.jpg'
    ];
    
    let currentIndex = 0;
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        heroSection.style.backgroundImage = `url('${heroImages[0]}')`;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % heroImages.length;
            heroSection.style.backgroundImage = `url('${heroImages[currentIndex]}')`;
        }, 5000);
    }
}

// ============================================
// 2. GALLERY PAGE (with Cloudinary upload)
// ============================================
if (document.getElementById('photoGrid')) {
    // Cloudinary configuration (YOUR CLOUD NAME IS SET!)
    const CLOUD_NAME = 'dlyzfdlba';
    const UPLOAD_PRESET = 'family_gallery'; // Must be created in Cloudinary Settings (unsigned)
    
    // Your original images array
    const originalImages = [
{ src: "/images/image 33.jpg", name: "Daily Life 1", category: "everyday" },
{ src: "/images/image 99.jpg", name: "Family Portrait 2", category: "ancestral" },
{ src: "/images/image 111.jpg", name: "Family Gathering 3", category: "gathering" },
{ src: "/images/image 61.jpg", name: "Family Portrait 4", category: "ancestral" },
{ src: "/images/image 108.jpg", name: "Family Gathering 5", category: "gathering" },
{ src: "/images/image 57.jpg", name: "Family Legacy 6", category: "ancestral" },
{ src: "/images/image 36.jpg", name: "Family Legacy 7", category: "ancestral" },
{ src: "/images/image 121.jpg", name: "Family Portrait 8", category: "ancestral" },
{ src: "/images/image 126.jpg", name: "Ancestral Photo 9", category: "ancestral" },
{ src: "/images/image 90.jpg", name: "Candid Shot 10", category: "everyday" },
{ src: "/images/image 37.jpg", name: "Birthday 11", category: "milestones" },
{ src: "/images/image 26.jpg", name: "Family Legacy 12", category: "ancestral" },
{ src: "/images/image 51.jpg", name: "Family Legacy 13", category: "ancestral" },
{ src: "/images/image 91.jpg", name: "Family Portrait 14", category: "ancestral" },
{ src: "/images/image 16.jpg", name: "Birthday 15", category: "milestones" },
{ src: "/images/image 86.jpg", name: "Family Legacy", category: "ancestral" },
{ src: "/images/image 47.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 70.jpg", name: "Holiday Meetup", category: "gathering" },
{ src: "/images/image 64.jpg", name: "Birthday", category: "milestones" },
{ src: "/images/image 12.jpg", name: "Candid Shot", category: "everyday" },
{ src: "/images/image 116.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 92.jpg", name: "Candid Shot", category: "everyday" },
{ src: "/images/image 122.jpg", name: "Graduation", category: "milestones" },
{ src: "/images/image 87.jpg", name: "Celebration", category: "milestones" },
{ src: "/images/image 48.jpg", name: "Celebration", category: "milestones" },
{ src: "/images/image 76.jpg", name: "Daily Life", category: "everyday" },
{ src: "/images/image 107.jpg", name: "Family Legacy", category: "ancestral" },
{ src: "/images/image 19.jpg", name: "Holiday Meetup", category: "gathering" },
{ src: "/images/image 34.jpg", name: "Holiday Meetup", category: "gathering" },
{ src: "/images/image 21.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 45.jpg", name: "Family Portrait", category: "ancestral" },
{ src: "/images/image 128.jpg", name: "Family Legacy", category: "ancestral" },
{ src: "/images/image 95.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 29.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 114.jpg", name: "Heritage Photo", category: "ancestral" },
{ src: "/images/image 115.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 82.jpg", name: "Holiday Meetup", category: "gathering" },
{ src: "/images/image 118.jpg", name: "Daily Life", category: "everyday" },
{ src: "/images/image 54.jpg", name: "Heritage Photo", category: "ancestral" },
{ src: "/images/image 71.jpg", name: "Graduation", category: "milestones" },
{ src: "/images/image 52.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 28.jpg", name: "Birthday", category: "milestones" },
{ src: "/images/image 78.jpg", name: "Celebration", category: "milestones" },
{ src: "/images/image 75.jpg", name: "Family Legacy", category: "ancestral" },
{ src: "/images/image 39.jpg", name: "Graduation", category: "milestones" },
{ src: "/images/image 81.jpg", name: "Candid Shot", category: "everyday" },
{ src: "/images/image 55.jpg", name: "Ancestral Photo", category: "ancestral" },
{ src: "/images/image 35.jpg", name: "Sunday Dinner", category: "gathering" },
{ src: "/images/image 120.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 119.jpg", name: "Family Legacy", category: "ancestral" },
{ src: "/images/image 94.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 104.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 93.jpg", name: "Birthday", category: "milestones" },
{ src: "/images/image 89.jpg", name: "Family Portrait", category: "ancestral" },
{ src: "/images/image 73.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 88.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 30.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 123.jpg", name: "Candid Shot", category: "everyday" },
{ src: "/images/image 65.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 125.jpg", name: "Heritage Photo", category: "ancestral" },
{ src: "/images/image 96.jpg", name: "Holiday Meetup", category: "gathering" },
{ src: "/images/image 42.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 62.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 38.jpg", name: "Ancestral Photo", category: "ancestral" },
{ src: "/images/image 24.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 98.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 112.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 97.jpg", name: "Graduation", category: "milestones" },
{ src: "/images/image 67.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 17.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 127.jpg", name: "Family Portrait", category: "ancestral" },
{ src: "/images/image 72.jpg", name: "Birthday", category: "milestones" },
{ src: "/images/image 101.jpg", name: "Family Portrait", category: "ancestral" },
{ src: "/images/image 106.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 74.jpg", name: "Sunday Dinner", category: "gathering" },
{ src: "/images/image 103.jpg", name: "Family Portrait", category: "ancestral" },
{ src: "/images/image 44.jpg", name: "Daily Life", category: "everyday" },
{ src: "/images/image 85.jpg", name: "Family Portrait", category: "ancestral" },
{ src: "/images/image 100.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 59.jpg", name: "Ancestral Photo", category: "ancestral" },
{ src: "/images/image 77.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 66.jpg", name: "Holiday Meetup", category: "gathering" },
{ src: "/images/image 31.jpg", name: "Heritage Photo", category: "ancestral" },
{ src: "/images/image 113.jpg", name: "Birthday", category: "milestones" },
{ src: "/images/image 84.jpg", name: "Sunday Dinner", category: "gathering" },
{ src: "/images/image 15.jpg", name: "Graduation", category: "milestones" },
{ src: "/images/image 105.jpg", name: "Family Legacy", category: "ancestral" },
{ src: "/images/image 124.jpg", name: "Ancestral Photo", category: "ancestral" },
{ src: "/images/image 41.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 25.jpg", name: "Graduation", category: "milestones" },
{ src: "/images/image 11.jpg", name: "Candid Shot", category: "everyday" },
{ src: "/images/image 83.jpg", name: "Celebration", category: "milestones" },
{ src: "/images/image 49.jpg", name: "Candid Shot", category: "everyday" },
{ src: "/images/image 63.jpg", name: "Birthday", category: "milestones" },
{ src: "/images/image 22.jpg", name: "Candid Shot", category: "everyday" },
{ src: "/images/image 18.jpg", name: "Family Legacy", category: "ancestral" },
{ src: "/images/image 117.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 68.jpg", name: "Celebration", category: "milestones" },
{ src: "/images/image 32.jpg", name: "Ancestral Photo", category: "ancestral" },
{ src: "/images/image 109.jpg", name: "Celebration", category: "milestones" },
{ src: "/images/image 102.jpg", name: "Graduation", category: "milestones" },
{ src: "/images/image 50.jpg", name: "Daily Life", category: "everyday" },
{ src: "/images/image 110.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 20.jpg", name: "Holiday Meetup", category: "gathering" },
{ src: "/images/image 40.jpg", name: "Sunday Dinner", category: "gathering" },
{ src: "/images/image 60.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 43.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 13.jpg", name: "Sunday Dinner", category: "gathering" },
{ src: "/images/image 27.jpg", name: "Graduation", category: "milestones" },
{ src: "/images/image 14.jpg", name: "Wedding Anniversary", category: "milestones" },
{ src: "/images/image 23.jpg", name: "Family Legacy", category: "ancestral" },
{ src: "/images/image 79.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 53.jpg", name: "Ancestral Photo", category: "ancestral" },
{ src: "/images/image 56.jpg", name: "Everyday Moment", category: "everyday" },
{ src: "/images/image 46.jpg", name: "Family Gathering", category: "gathering" },
{ src: "/images/image 80.jpg", name: "Family Portrait", category: "ancestral" },
{ src: "/images/image 58.jpg", name: "Heritage Photo", category: "ancestral" },
{ src: "/images/image 69.jpg", name: "Wedding Anniversary", category: "milestones" }
  ];

    let galleryImages = [];

    function loadUserUploads() {
        const stored = localStorage.getItem('olupot_gallery_uploads');
        return stored ? JSON.parse(stored) : [];
    }

    function saveUserUploads(images) {
        localStorage.setItem('olupot_gallery_uploads', JSON.stringify(images));
    }

    function initGallery() {
        galleryImages = [...loadUserUploads(), ...originalImages];
        renderGallery();
    }

    let currentFilter = 'all';

    function renderGallery() {
        const grid = document.getElementById('photoGrid');
        if (!grid) return;

        let filtered = [...galleryImages];
        if (currentFilter !== 'all') {
            filtered = filtered.filter(img => img.category === currentFilter);
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="empty-gallery">📸 No photos in this category. Try another filter or upload new memories.</div>`;
            return;
        }

        grid.innerHTML = filtered.map((img, index) => `
            <div class="photo-card" data-index="${index}" data-src="${img.src}" data-name="${escapeHtml(img.name)}">
                <img src="${img.src}" alt="${escapeHtml(img.name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x260?text=Image+Not+Found'">
                <div class="photo-info">
                    <div class="photo-name">${escapeHtml(img.name)}</div>
                    <div class="photo-category">🏷️ ${img.category}</div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.photo-card').forEach(card => {
            card.addEventListener('click', () => {
                const src = card.dataset.src;
                const name = card.dataset.name;
                openLightbox(src, name);
            });
        });
    }

    function openLightbox(src, name) {
        const modal = document.getElementById('lightboxModal');
        const lightboxImg = document.getElementById('lightboxImage');
        const caption = document.getElementById('lightboxCaption');
        if (!modal) return;
        lightboxImg.src = src;
        caption.innerText = name || 'Family Memory';
        modal.style.display = 'flex';
    }

    function closeLightbox() {
        const modal = document.getElementById('lightboxModal');
        if (modal) modal.style.display = 'none';
    }

    // Cloudinary upload handler
    async function handleUpload(files) {
        if (!files.length) return;
        
        const userUploads = loadUserUploads();
        const newUploads = [];

        for (let file of files) {
            if (!file.type.startsWith('image/')) continue;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                let category = 'everyday';
                const lowerName = file.name.toLowerCase();
                if (lowerName.includes('ancest') || lowerName.includes('old') || lowerName.includes('heritage')) category = 'ancestral';
                else if (lowerName.includes('wedding') || lowerName.includes('reunion') || lowerName.includes('party') || lowerName.includes('gathering')) category = 'gathering';
                else if (lowerName.includes('grad') || lowerName.includes('birth') || lowerName.includes('celebrat') || lowerName.includes('milestone')) category = 'milestones';

                newUploads.push({
                    src: data.secure_url,
                    name: file.name.replace(/\.[^/.]+$/, ''),
                    category: category,
                    id: Date.now() + Math.random(),
                    isUpload: true
                });
            } catch (error) {
                console.error('Upload failed:', error);
                alert(`❌ Failed to upload ${file.name}: ${error.message}`);
            }
        }

        if (newUploads.length) {
            saveUserUploads([...newUploads, ...userUploads]);
            initGallery();
            alert(`✅ Added ${newUploads.length} photo(s) to the family archive!`);
        }
    }

    // Event listeners for gallery
    const uploadInput = document.getElementById('imageUpload');
    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleUpload(Array.from(e.target.files));
            e.target.value = '';
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGallery();
        });
    });

    const lightboxModal = document.getElementById('lightboxModal');
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);

    initGallery();
}

// ============================================
// 3. HOME PAGE (CTA Button)
// ============================================
if (document.querySelector('.cta-button')) {
    const shareBtn = document.querySelector('.cta-button');
    shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert("📝 Great! Please send your memory or story to the family WhatsApp group, or email it to agemoelizabeth07@gmail.com. We'll add it to the Archives.");
    });
}

// ============================================
// 4. PROFILES PAGE (Family Tree Modal)
// ============================================
if (document.getElementById('memberModal')) {
    const familyData = {
        ooolupot: {
            name: "O.O Olupot Okui & Audo Faith Norah",
            subtitle: "The Founders • Our Roots",
            details: "The foundation of the modern Olupot family began in 1965. Their vision, resilience, and love created the legacy we carry today.",
            children: ["Apollo Okwi", "Alejo Merab", "Okiring", "Agemo Betty", "Erebu Martin", "Acom Magret", "Ajalo Esther", "Otai Charles"],
            memory: "They taught us that family is not just blood — it's commitment, laughter, and showing up for each other.",
            legacy: "From humble beginnings in Soroti to a family spread across Uganda and beyond."
        },
        apollo: {
            name: "Apollo Okwi & Suzan Okwi",
            subtitle: "Parents • Mentors",
            details: "Apollo and Suzan raised their children with a strong emphasis on education and community service.",
            children: ["Audo Diana", "Alejo Junior", "Olupot Daniel", "Okwi Delvin"],
            memory: "Their home was always open — a gathering place for cousins, aunties, and uncles."
        },
        alejo: {
            name: "Alejo Merab",
            subtitle: "Matriarch • Nurturer",
            details: "Alejo Merab carried forward the family traditions with grace and strength.",
            children: ["Olupot Steven"],
            memory: "Known for her incredible cooking and even bigger heart."
        },
        okiring: {
            name: "Okiring",
            subtitle: "Beloved Family Member",
            details: "A cherished member of the Olupot family whose presence brought joy to all.",
            children: [],
            memory: "Always remembered for his kindness and gentle spirit."
        },
        agemo: {
            name: "Agemo Betty & Ibrahim Ogaram",
            subtitle: "Building the Next Generation",
            details: "Together they've created a thriving branch of the family tree.",
            children: ["Adekur Faith Norah", "Okiror Henry", "Ogaram Lincoln Abraham", "Osako Benjamin"],
            memory: "Their home became a second home for many nieces and nephews."
        },
        erebu: {
            name: "Erebu Martin, Angella & Aanyu",
            subtitle: "Extended Family Leaders",
            details: "A large, vibrant branch that keeps the family connected across distances.",
            children: ["Erebu Israel", "Alejo Merab Zoey", "Anyu & Olupot Bob", "Audo Marion", "Akola Naomi", "Okwi Ezra", "Agemo Betty (Jr)", "Ajalo Esther (Jr)", "Amogin Maria", "Acom Abigail", "Ebiyat Isahak"],
            memory: "The annual gatherings at their home are legendary."
        },
        acom: {
            name: "Acom Magret",
            subtitle: "Cherished Aunt",
            details: "Acom Magret has been a pillar of support for the entire family.",
            children: [],
            memory: "Her wisdom and advice are sought by young and old alike."
        },
        ajalo: {
            name: "Ajalo Esther & Ediku Daniel",
            subtitle: "Raising the Future",
            details: "A family built on love, patience, and strong values.",
            children: ["Ajalo Blessing", "Apio Victoria", "Acen Manuella"],
            memory: "Their daughters are already showing signs of great leadership."
        },
        otai: {
            name: "Otai Charles & Amogin Irene",
            subtitle: "Proud Parents & Grandparents",
            details: "A family that values both tradition and modern education.",
            children: ["Audo Jemimah Otai"],
            grandchildren: ["Aluka Keren Otai", "Olupot Emphraim"],
            memory: "Their grandchildren are the light of their lives."
        }
    };

    window.openMemberModal = function(memberId) {
        const data = familyData[memberId];
        if (!data) return;
        const modal = document.getElementById('memberModal');
        const modalName = document.getElementById('modalName');
        const modalSubtitle = document.getElementById('modalSubtitle');
        const modalBody = document.getElementById('modalBody');
        modalName.textContent = data.name;
        modalSubtitle.textContent = data.subtitle;

        let html = `<div class="detail-section"><h4>📖 About</h4><p>${data.details}</p></div>`;
        if (data.children && data.children.length) {
            html += `<div class="detail-section"><h4>👨‍👩‍👧‍👦 Children & Direct Lineage</h4><ul>${data.children.map(child => `<li>✨ ${child}</li>`).join('')}</ul></div>`;
        }
        if (data.grandchildren && data.grandchildren.length) {
            html += `<div class="detail-section"><h4>🌟 Grandchildren</h4><ul>${data.grandchildren.map(gc => `<li>💫 ${gc}</li>`).join('')}</ul></div>`;
        }
        html += `<div class="memory-quote"><strong>🕯️ A Family Memory:</strong><br>"${data.memory}"</div>`;
        if (data.legacy) html += `<div class="detail-section" style="margin-top:20px;"><h4>🏆 Legacy</h4><p>${data.legacy}</p></div>`;
        modalBody.innerHTML = html;
        modal.style.display = 'flex';
    };

    function closeModal() {
        const modal = document.getElementById('memberModal');
        if (modal) modal.style.display = 'none';
    }

    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    const memberModal = document.getElementById('memberModal');
    if (memberModal) {
        memberModal.addEventListener('click', (e) => {
            if (e.target === memberModal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// ============================================
// 5. STORIES PAGE (Add, Edit, Delete, Search)
// ============================================
if (document.getElementById('storiesGrid')) {
    let stories = [];

    function loadStories() {
        const stored = localStorage.getItem('olupot_stories');
        if (stored) {
            stories = JSON.parse(stored);
        } else {
            stories = [
                {
                    id: Date.now(),
                    title: "The Journey to Kampala",
                    category: "history",
                    author: "Elder John",
                    content: "In 1998, our family made the brave decision to move from our rural home to Kampala. It wasn't easy — we left behind land, familiar faces, and the comfort of the village. But we carried our values with us. Today, that decision opened doors for education, careers, and opportunities none of us could have imagined.",
                    image: "",
                    date: new Date(2024, 5, 15).toISOString()
                },
                {
                    id: Date.now() + 1,
                    title: "Grandmother's Groundnut Stew",
                    category: "recipes",
                    author: "Aunt Mary",
                    content: "Every family gathering revolved around Grandmother's groundnut stew. She never wrote down the recipe — it lived in her hands. After years of watching, I finally got it right. The secret? Toasting the groundnuts just right and adding a pinch of love.",
                    image: "",
                    date: new Date(2024, 8, 10).toISOString()
                }
            ];
            saveStories();
        }
        renderStories();
    }

    function saveStories() {
        localStorage.setItem('olupot_stories', JSON.stringify(stories));
    }

    function addStory(title, category, author, content, image) {
        const newStory = {
            id: Date.now(),
            title, category, author: author || "Anonymous", content, image: image || "",
            date: new Date().toISOString()
        };
        stories.unshift(newStory);
        saveStories();
        renderStories();
    }

    function updateStory(id, updatedData) {
        const index = stories.findIndex(s => s.id == id);
        if (index !== -1) {
            stories[index] = { ...stories[index], ...updatedData };
            saveStories();
            renderStories();
        }
    }

    window.deleteStory = function(id) {
        if (confirm("Are you sure you want to delete this story forever?")) {
            stories = stories.filter(s => s.id != id);
            saveStories();
            renderStories();
            closeStoryModal();
        }
    };

    function getCategoryIcon(category) {
        const icons = { history: "🏛️", milestones: "🎉", memories: "💭", recipes: "🍲", legacy: "🌟" };
        return icons[category] || "📖";
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    let currentFilter = 'all';
    let currentSearch = '';

    function renderStories() {
        const grid = document.getElementById('storiesGrid');
        if (!grid) return;

        let filtered = [...stories];
        if (currentFilter !== 'all') filtered = filtered.filter(s => s.category === currentFilter);
        if (currentSearch.trim()) {
            const term = currentSearch.toLowerCase();
            filtered = filtered.filter(s => s.title.toLowerCase().includes(term) || s.content.toLowerCase().includes(term) || (s.author && s.author.toLowerCase().includes(term)));
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="empty-stories">📖 No stories found. Be the first to share a memory above!</div>`;
            return;
        }

        grid.innerHTML = filtered.map(story => `
            <div class="story-card" data-id="${story.id}">
                ${story.image ? `<img src="${story.image}" class="story-image" onerror="this.src='https://via.placeholder.com/400x200?text=Family+Memory'">` :
                    `<div class="story-image" style="display: flex; align-items: center; justify-content: center; background: #F0E9DF;"><span style="font-size: 3rem;">${getCategoryIcon(story.category)}</span></div>`}
                <span class="story-category">${getCategoryIcon(story.category)} ${story.category}</span>
                <div class="story-content">
                    <h3 class="story-title">${escapeHtml(story.title)}</h3>
                    <div class="story-meta"><span>✍️ ${escapeHtml(story.author)}</span><span>📅 ${formatDate(story.date)}</span></div>
                    <p class="story-excerpt">${escapeHtml(story.content.substring(0, 120))}${story.content.length > 120 ? '...' : ''}</p>
                    <div class="story-actions">
                        <button class="read-more" onclick="viewStory(${story.id})">Read Full Story</button>
                        <button class="edit-story" onclick="editStory(${story.id})">✏️ Edit</button>
                        <button class="delete-story" onclick="deleteStory(${story.id})">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.viewStory = function(id) {
        const story = stories.find(s => s.id == id);
        if (!story) return;
        const modal = document.getElementById('storyModal');
        const modalTitle = document.getElementById('modalStoryTitle');
        const modalMeta = document.getElementById('modalStoryMeta');
        const modalBody = document.getElementById('modalStoryBody');
        modalTitle.textContent = story.title;
        modalMeta.textContent = `✍️ ${story.author} • 📅 ${formatDate(story.date)} • ${getCategoryIcon(story.category)} ${story.category}`;
        modalBody.innerHTML = `
            <div class="full-story-content">
                ${story.image ? `<img src="${story.image}" style="width:100%; border-radius:16px; margin-bottom:20px;" onerror="this.style.display='none'">` : ''}
                <p style="white-space: pre-wrap; line-height: 1.8;">${escapeHtml(story.content)}</p>
            </div>
            <div class="story-actions" style="margin-top: 20px;">
                <button class="edit-story" onclick="editStory(${story.id})">✏️ Edit This Story</button>
                <button class="delete-story" onclick="deleteStory(${story.id})">🗑️ Delete Story</button>
            </div>
        `;
        modal.style.display = 'flex';
    };

    window.editStory = function(id) {
        const story = stories.find(s => s.id == id);
        if (!story) return;
        const modal = document.getElementById('storyModal');
        const modalTitle = document.getElementById('modalStoryTitle');
        const modalMeta = document.getElementById('modalStoryMeta');
        const modalBody = document.getElementById('modalStoryBody');
        modalTitle.textContent = "✏️ Edit Story";
        modalMeta.textContent = "Make your changes below";
        modalBody.innerHTML = `
            <form id="editStoryForm" class="edit-form">
                <div class="form-group"><label>Title</label><input type="text" id="editTitle" value="${escapeHtml(story.title)}" required></div>
                <div class="form-group"><label>Category</label><select id="editCategory">
                    <option value="history" ${story.category === 'history' ? 'selected' : ''}>🏛️ History</option>
                    <option value="milestones" ${story.category === 'milestones' ? 'selected' : ''}>🎉 Milestones</option>
                    <option value="memories" ${story.category === 'memories' ? 'selected' : ''}>💭 Memories</option>
                    <option value="recipes" ${story.category === 'recipes' ? 'selected' : ''}>🍲 Recipes</option>
                    <option value="legacy" ${story.category === 'legacy' ? 'selected' : ''}>🌟 Legacy</option>
                </select></div>
                <div class="form-group"><label>Author</label><input type="text" id="editAuthor" value="${escapeHtml(story.author)}"></div>
                <div class="form-group"><label>Content</label><textarea id="editContent" rows="8" required>${escapeHtml(story.content)}</textarea></div>
                <div class="form-group"><label>Image URL</label><input type="text" id="editImage" value="${escapeHtml(story.image || '')}"></div>
                <button type="submit" class="submit-story">💾 Save Changes</button>
                <button type="button" class="delete-story" style="margin-left:10px;" onclick="deleteStory(${story.id})">🗑️ Delete Instead</button>
            </form>
        `;
        modal.style.display = 'flex';
        document.getElementById('editStoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            updateStory(id, {
                title: document.getElementById('editTitle').value,
                category: document.getElementById('editCategory').value,
                author: document.getElementById('editAuthor').value,
                content: document.getElementById('editContent').value,
                image: document.getElementById('editImage').value
            });
            closeStoryModal();
        });
    };

    function closeStoryModal() {
        const modal = document.getElementById('storyModal');
        if (modal) modal.style.display = 'none';
    }

    // Submit new story
    const storyForm = document.getElementById('storyForm');
    if (storyForm) {
        storyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('storyTitle').value;
            const category = document.getElementById('storyCategory').value;
            const author = document.getElementById('storyAuthor').value;
            const content = document.getElementById('storyContent').value;
            const image = document.getElementById('storyImage').value;
            if (!title || !content) {
                alert("Please provide both a title and story content.");
                return;
            }
            addStory(title, category, author, content, image);
            storyForm.reset();
            alert("✅ Your story has been added to the family archive!");
        });
    }

    // Filter and search
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderStories();
        });
    });

    const searchBox = document.getElementById('searchStories');
    if (searchBox) {
        searchBox.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            renderStories();
        });
    }

    const closeStoryModalBtn = document.querySelector('.close-story-modal');
    if (closeStoryModalBtn) closeStoryModalBtn.addEventListener('click', closeStoryModal);
    const storyModal = document.getElementById('storyModal');
    if (storyModal) {
        storyModal.addEventListener('click', (e) => {
            if (e.target === storyModal) closeStoryModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeStoryModal();
    });

    loadStories();
}

// Utility function
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

console.log('🍃 Olupot Family Website Loaded. Visitor emails will be sent to agemoelizabeth07@gmail.com!');