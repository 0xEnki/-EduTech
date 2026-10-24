/* ---------- 1. Courses data ----------
   Replace any `video` URL with your own YouTube link; the thumbnail is
   generated from it automatically (or set a custom `thumb` field). */
const courses = [
    { title: "Python for Beginners", desc: "Learn Python from zero: variables, functions, loops and small projects.", category: "programming", duration: "4 Weeks", rating: 4.9, instructor: "freeCodeCamp", video: "https://www.youtube.com/watch?v=rfscVS0vtbw", badge: "Bestseller" },
    { title: "HTML & CSS Full Course", desc: "Build and style responsive websites with modern HTML5 and CSS3.", category: "programming", duration: "6 Weeks", rating: 4.8, instructor: "freeCodeCamp", video: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
    { title: "JavaScript Full Course", desc: "Master JavaScript fundamentals, the DOM, events and async code.", category: "programming", duration: "8 Weeks", rating: 4.9, instructor: "freeCodeCamp", video: "https://www.youtube.com/watch?v=PkZNo7MFNFg", badge: "Popular" },
    { title: "React Beginner's Course", desc: "Create interactive interfaces with components, props, state and hooks.", category: "programming", duration: "6 Weeks", rating: 4.8, instructor: "freeCodeCamp", video: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
    { title: "Cisco CCNA 200-301", desc: "Networking basics, IP addressing, switching, VLANs and routing.", category: "networking", duration: "10 Weeks", rating: 4.8, instructor: "Jeremy's IT Lab", video: "https://www.youtube.com/watch?v=H8W9oMNSuwo", badge: "Popular" },
    { title: "Wireshark Packet Analysis", desc: "Capture and read network traffic to troubleshoot and investigate issues.", category: "networking", duration: "3 Weeks", rating: 4.7, instructor: "Chris Greer", video: "https://www.youtube.com/watch?v=TkCSr30UojM" },
    { title: "Ethical Hacking Course", desc: "Hands-on lab training in vulnerability assessment and penetration testing.", category: "security", duration: "12 Weeks", rating: 5.0, instructor: "The Cyber Mentor", video: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", badge: "New" },
    { title: "Git & GitHub Essentials", desc: "Track changes, branch safely and collaborate on code with your team.", category: "programming", duration: "2 Weeks", rating: 4.7, instructor: "freeCodeCamp", video: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
    { title: "SQL & Databases", desc: "Design databases and query data with SQL, from SELECT to joins.", category: "programming", duration: "5 Weeks", rating: 4.8, instructor: "freeCodeCamp", video: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
    { title: "Machine Learning for Everybody", desc: "Understand supervised and unsupervised learning with practical examples.", category: "ai", duration: "7 Weeks", rating: 4.9, instructor: "freeCodeCamp", video: "https://www.youtube.com/watch?v=i_LwzRVP7bg", badge: "New" },
    { title: "Docker for Beginners", desc: "Package and ship applications in containers with Docker.", category: "networking", duration: "3 Weeks", rating: 4.7, instructor: "freeCodeCamp", video: "https://www.youtube.com/watch?v=fqMOX6JJhGo" },
    { title: "UI/UX Design with Figma", desc: "Design clean interfaces and prototypes, from wireframe to handoff.", category: "design", duration: "5 Weeks", rating: 4.8, instructor: "freeCodeCamp", video: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU" }
];

const getId = (url) => (url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1];
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("coursesGrid");
    const emptyMsg = document.getElementById("emptyMsg");
    const searchInput = document.getElementById("searchInput");
    const filters = document.getElementById("filters");
    let category = "all";

    /* ---------- 2. Scroll fade-in ---------- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
        });
    }, { threshold: 0.12 });

    /* ---------- 3. Dynamic rendering ---------- */
    function render() {
        const q = searchInput.value.trim().toLowerCase();
        const list = courses.filter((c) =>
            (category === "all" || c.category === category) &&
            [c.title, c.desc, c.instructor, c.category].join(" ").toLowerCase().includes(q));

        grid.innerHTML = list.map((c) => {
            const idx = courses.indexOf(c);
            const thumb = c.thumb || `https://img.youtube.com/vi/${getId(c.video)}/hqdefault.jpg`;
            return `
            <article class="course-card" data-index="${idx}" tabindex="0">
                <div class="thumb">
                    <img src="${thumb}" alt="${esc(c.title)}" loading="lazy" onerror="this.style.display='none'" />
                    <div class="play"><i class="fa-solid fa-circle-play"></i></div>
                    ${c.badge ? `<span class="badge">${c.badge}</span>` : ""}
                </div>
                <div class="card-body">
                    <h3>${esc(c.title)}</h3>
                    <div class="instructor"><i class="fa-regular fa-user"></i> ${esc(c.instructor)}</div>
                    <p>${esc(c.desc)}</p>
                    <div class="card-meta">
                        <span><i class="fa-regular fa-clock"></i> ${c.duration}</span>
                        <span><i class="fa-solid fa-star"></i> ${c.rating.toFixed(1)}</span>
                    </div>
                    <button class="btn-secondary" type="button">View course</button>
                </div>
            </article>`;
        }).join("");

        emptyMsg.hidden = list.length > 0;
        grid.querySelectorAll(".course-card").forEach((card, i) => {
            card.style.transitionDelay = `${(i % 3) * 80}ms`;
            observer.observe(card);
        });
    }

    searchInput.addEventListener("input", render);
    filters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        category = btn.dataset.category;
        render();
    });

    /* ---------- 4. Modal with YouTube embed ---------- */
    const modal = document.getElementById("courseModal");
    const frame = document.getElementById("modalVideo");

    function openModal(c) {
        document.getElementById("modalTitle").textContent = c.title;
        document.getElementById("modalDesc").textContent = c.desc;
        document.getElementById("modalLink").href = c.video;
        frame.src = `https://www.youtube-nocookie.com/embed/${getId(c.video)}?autoplay=1&rel=0`;
        modal.classList.add("open");
    }
    function closeModal() { modal.classList.remove("open"); frame.src = ""; }

    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".course-card");
        if (card) openModal(courses[card.dataset.index]);
    });
    grid.addEventListener("keydown", (e) => {
        const card = e.target.closest(".course-card");
        if (card && e.key === "Enter") openModal(courses[card.dataset.index]);
    });
    document.getElementById("closeModal").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    /* ---------- 5. Navbar, theme, form ---------- */
    const navLinks = document.getElementById("navLinks");
    document.getElementById("mobileMenu").addEventListener("click", () => navLinks.classList.toggle("active"));
    navLinks.addEventListener("click", () => navLinks.classList.remove("active"));

    const root = document.documentElement;
    const themeBtn = document.getElementById("themeToggle");
    const setTheme = (t) => {
        root.dataset.theme = t;
        themeBtn.innerHTML = `<i class="fa-solid fa-${t === "dark" ? "moon" : "sun"}"></i>`;
        try { localStorage.setItem("theme", t); } catch (_) {}
    };
    let saved = "dark";
    try { saved = localStorage.getItem("theme") || "dark"; } catch (_) {}
    setTheme(saved);
    themeBtn.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

    const form = document.getElementById("contactForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you for reaching out! We will get back to you shortly.");
        form.reset();
    });

    render();
});
