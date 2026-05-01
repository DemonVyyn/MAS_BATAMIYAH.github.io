/**
 * MAS BATAMIYAH — Static Website JS
 * 
 * BARIS PERTAMA: hapus class "no-js" dari <html>
 * Ini membuat konten langsung tampil jika JS gagal,
 * dan memungkinkan animasi fade-up jika JS berhasil.
 */
(function () {
    var root = document.documentElement;
    if (root) {
        root.classList.remove("no-js");
    }
})();

document.addEventListener("DOMContentLoaded", function () {

    /* ──────────────────────────────────
       1. FADE-UP INTERSECTION OBSERVER
       ────────────────────────────────── */
    if ("IntersectionObserver" in window) {
        var fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = entry.target.getAttribute("data-delay") || 0;
                    setTimeout(function () {
                        entry.target.classList.add("visible");
                    }, parseInt(delay, 10));
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll(".fade-up").forEach(function (el, idx) {
            el.setAttribute("data-delay", (idx % 4) * 80);
            fadeObserver.observe(el);
        });
    } else {
        // Fallback browser yang tidak support IO
        document.querySelectorAll(".fade-up").forEach(function (el) {
            el.classList.add("visible");
        });
    }


    /* ──────────────────────────────────
       2. MOBILE NAVIGATION
       ────────────────────────────────── */
    var hamburger = document.querySelector(".nav-hamburger");
    var overlay = document.querySelector(".nav-mobile-overlay");

    if (hamburger && overlay) {
        function closeMenu() {
            hamburger.classList.remove("open");
            overlay.classList.remove("open");
            hamburger.setAttribute("aria-expanded", "false");
            overlay.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }

        hamburger.addEventListener("click", function () {
            var isOpen = hamburger.classList.toggle("open");
            overlay.classList.toggle("open", isOpen);
            hamburger.setAttribute("aria-expanded", String(isOpen));
            overlay.setAttribute("aria-hidden", String(!isOpen));
            document.body.style.overflow = isOpen ? "hidden" : "";
        });

        document.querySelectorAll(".nav-mobile-links a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });
    }


    /* ──────────────────────────────────
       3. SMOOTH SCROLL
       ────────────────────────────────── */
    function smoothScrollTo(selector) {
        var target = document.querySelector(selector);
        if (!target) return;
        var navH = document.querySelector("nav") ? document.querySelector("nav").offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: top, behavior: "smooth" });
    }

    // Semua anchor link
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
            var href = this.getAttribute("href");
            if (href.length > 1) {
                e.preventDefault();
                smoothScrollTo(href);
            }
        });
    });


    /* ──────────────────────────────────
       4. COUNTER ANIMATION
       ────────────────────────────────── */
    if ("IntersectionObserver" in window) {
        var counterObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    counterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll(".num[data-target]").forEach(function (el) {
            counterObs.observe(el);
        });
    }

    function animateCount(el) {
        var target = parseInt(el.getAttribute("data-target"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1800;
        var startTime = null;

        // Simpan teks awal sebagai fallback
        var fallback = el.textContent;

        function step(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / dur, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }

        try { requestAnimationFrame(step); }
        catch (e) { el.textContent = fallback; }
    }


    /* ──────────────────────────────────
       5. TOAST NOTIFICATION
       ────────────────────────────────── */
    function showToast(msg, ms) {
        ms = ms || 3500;
        var old = document.querySelector(".toast");
        if (old) old.remove();

        var t = document.createElement("div");
        t.className = "toast";
        t.textContent = msg;
        document.body.appendChild(t);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                t.classList.add("show");
            });
        });

        setTimeout(function () {
            t.classList.remove("show");
            setTimeout(function () { if (t.parentNode) t.remove(); }, 400);
        }, ms);
    }


    /* ──────────────────────────────────
       6. FORM KONTAK
       ────────────────────────────────── */
    var form = document.getElementById("kontakForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var nama = form.elements["nama"].value.trim();
            var email = form.elements["email"].value.trim();
            var subjek = form.elements["subjek"].value.trim();
            var pesan = form.elements["pesan"].value.trim();

            if (!nama || !email || !subjek || !pesan) {
                showToast("Harap lengkapi semua field sebelum mengirim.");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast("Format email tidak valid.");
                return;
            }

            var btn = form.querySelector("button[type='submit']");
            var txt = btn.textContent;
            btn.textContent = "Mengirim...";
            btn.disabled = true;

            // Simulasi kirim (statis, tanpa backend)
            setTimeout(function () {
                showToast("Pesan berhasil dikirim! Terima kasih, " + nama + ".", 4000);
                form.reset();
                btn.textContent = txt;
                btn.disabled = false;
            }, 1200);
        });
    }


    /* ──────────────────────────────────
       7. NAVBAR SCROLL SHADOW
       ────────────────────────────────── */
    var navbar = document.querySelector("nav");
    if (navbar) {
        window.addEventListener("scroll", function () {
            navbar.style.boxShadow = window.scrollY > 50
                ? "0 4px 24px rgba(0,0,0,0.3)"
                : "none";
        }, { passive: true });
    }

});
