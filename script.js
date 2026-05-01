/**
 * ================================================================
 * MAS BATAMIYAH — Website Profil Sekolah (Statis)
 * File     : js/welcome.js
 * ================================================================
 */

document.addEventListener("DOMContentLoaded", function () {

    /* ──────────────────────────────────────
       1. FADE-UP ANIMATION (IntersectionObserver)
       Setiap elemen .fade-up muncul saat masuk viewport.
       ────────────────────────────────────── */
    var fadeObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = entry.target.dataset.delay || 0;
                    setTimeout(function () {
                        entry.target.classList.add("visible");
                    }, parseInt(delay, 10));
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll(".fade-up").forEach(function (el, idx) {
        el.dataset.delay = (idx % 4) * 80;
        fadeObserver.observe(el);
    });


    /* ──────────────────────────────────────
       2. MOBILE NAVIGATION
       Toggle hamburger menu & overlay.
       ────────────────────────────────────── */
    var hamburger = document.querySelector(".nav-hamburger");
    var overlay   = document.querySelector(".nav-mobile-overlay");
    var mobileLinks = document.querySelectorAll(".nav-mobile-links a");

    if (hamburger && overlay) {
        hamburger.addEventListener("click", function () {
            var isOpen = hamburger.classList.toggle("open");
            overlay.classList.toggle("open", isOpen);
            hamburger.setAttribute("aria-expanded", isOpen);
            overlay.setAttribute("aria-hidden", !isOpen);
            document.body.style.overflow = isOpen ? "hidden" : "";
        });

        // Tutup overlay saat klik link
        mobileLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                hamburger.classList.remove("open");
                overlay.classList.remove("open");
                hamburger.setAttribute("aria-expanded", "false");
                overlay.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "";
            });
        });
    }


    /* ──────────────────────────────────────
       3. SMOOTH SCROLL (dengan offset navbar)
       Mendukung semua anchor link di halaman.
       ────────────────────────────────────── */
    function smoothScrollTo(targetSelector) {
        var target = document.querySelector(targetSelector);
        if (!target) return;

        var navHeight = document.querySelector("nav")
            ? document.querySelector("nav").offsetHeight
            : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({ top: top, behavior: "smooth" });
    }

    // Desktop nav links
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            smoothScrollTo(this.getAttribute("href"));
        });
    });

    // Hero CTA
    var heroCta = document.querySelector(".hero-cta");
    if (heroCta && heroCta.getAttribute("href").startsWith("#")) {
        heroCta.addEventListener("click", function (e) {
            e.preventDefault();
            smoothScrollTo(this.getAttribute("href"));
        });
    }


    /* ──────────────────────────────────────
       4. COUNTER ANIMATION (Hero Stats)
       Angka di hero stats akan menghitung dari 0 ke target.
       ────────────────────────────────────── */
    var counterObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll(".stat .num[data-target]").forEach(function (el) {
        counterObserver.observe(el);
    });

    function animateCounter(element) {
        var target  = parseInt(element.dataset.target, 10);
        var suffix  = element.dataset.suffix || "";
        var duration = 1800; // ms
        var start   = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing: ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }


    /* ──────────────────────────────────────
       5. TOAST NOTIFICATION
       Menampilkan notifikasi singkat (pengganti alert).
       ────────────────────────────────────── */
    function showToast(message, duration) {
        duration = duration || 3500;

        // Hapus toast lama jika ada
        var existing = document.querySelector(".toast");
        if (existing) existing.remove();

        var toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger show
        requestAnimationFrame(function () {
            toast.classList.add("show");
        });

        // Auto hide
        setTimeout(function () {
            toast.classList.remove("show");
            setTimeout(function () {
                if (toast.parentNode) toast.remove();
            }, 400);
        }, duration);
    }


    /* ──────────────────────────────────────
       6. FORM KONTAK — Submit Handler
       Validasi sederhana + feedback via toast.
       Karena ini versi statis, form hanya mensimulasikan pengiriman.
       ────────────────────────────────────── */
    var kontakForm = document.getElementById("kontakForm");
    if (kontakForm) {
        kontakForm.addEventListener("submit", function (e) {
            e.preventDefault();

            var nama    = kontakForm.elements["nama"].value.trim();
            var email   = kontakForm.elements["email"].value.trim();
            var subjek  = kontakForm.elements["subjek"].value.trim();
            var pesan   = kontakForm.elements["pesan"].value.trim();

            // Validasi sederhana
            if (!nama || !email || !subjek || !pesan) {
                showToast("⚠️ Harap lengkapi semua field sebelum mengirim pesan.");
                return;
            }

            // Validasi format email
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showToast("⚠️ Format email tidak valid.");
                return;
            }

            // Simulasi pengiriman (versi statis, tidak ada backend)
            var submitBtn = kontakForm.querySelector("button[type='submit']");
            var originalText = submitBtn.textContent;
            submitBtn.textContent = "Mengirim...";
            submitBtn.disabled = true;

            setTimeout(function () {
                showToast("✅ Pesan berhasil dikirim! Terima kasih, " + nama + ".", 4000);
                kontakForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1200);

            /*
             * ── INTEGRASI BACKEND ──
             * Jika Anda ingin menghubungkan ke backend (Laravel, dll),
             * ganti blok setTimeout di atas dengan fetch() seperti ini:
             *
             * fetch("/kontak/kirim", {
             *     method: "POST",
             *     headers: {
             *         "Content-Type": "application/json",
             *         "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
             *     },
             *     body: JSON.stringify({ nama, email, subjek, pesan })
             * })
             * .then(function(res) { return res.json(); })
             * .then(function(data) {
             *     showToast("✅ Pesan berhasil dikirim! Terima kasih, " + nama + ".");
             *     kontakForm.reset();
             * })
             * .catch(function(err) {
             *     showToast("❌ Terjadi kesalahan. Silakan coba lagi.");
             *     console.error(err);
             * })
             * .finally(function() {
             *     submitBtn.textContent = originalText;
             *     submitBtn.disabled = false;
             * });
             */
        });
    }


    /* ──────────────────────────────────────
       7. NAVBAR SCROLL EFFECT
       Menambahkan shadow saat halaman discroll.
       ────────────────────────────────────── */
    var navbar = document.querySelector("nav");
    if (navbar) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
            } else {
                navbar.style.boxShadow = "none";
            }
        }, { passive: true });
    }


    /* ──────────────────────────────────────
       8. ACTIVE NAV LINK HIGHLIGHT
       Menandai link navigasi sesuai section yang terlihat.
       ────────────────────────────────────── */
    var sections = document.querySelectorAll("section[id]");
    var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    var activeObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.getAttribute("id");
                    navAnchors.forEach(function (a) {
                        a.style.color = a.getAttribute("href") === "#" + id
                            ? "var(--gold)"
                            : "";
                    });
                }
            });
        },
        { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach(function (section) {
        activeObserver.observe(section);
    });

});
