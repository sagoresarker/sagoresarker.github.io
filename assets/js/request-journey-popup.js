(function () {
    var SESSION_KEY = 'requestJourneySeen';
    var STORAGE_KEY = 'requestJourneyDontShowAgain';
    /* Real request journey for this portfolio when served by GitLab Pages */
    var STEPS = [
        {
            title: '1. DNS & TCP',
            desc: 'Your browser resolves the host (e.g. yourname.gitlab.io or yourname.github.io) to the host\'s IP. A TCP connection is opened to the edge—SYN, SYN-ACK, ACK.',
            detail: 'This site is served from static hosting (e.g. GitLab Pages or GitHub Pages); the first hop is to that infrastructure.'
        },
        {
            title: '2. TLS (HTTPS)',
            desc: 'A TLS handshake runs over that connection: certificate exchange, key agreement. After this, all traffic is encrypted.',
            detail: 'The host\'s edge presents its certificate; your browser verifies it before sending the HTTP request.'
        },
        {
            title: '3. HTTP request',
            desc: 'Your browser sends an HTTP request: e.g. GET / or GET /index.html plus headers (Host, User-Agent, Accept, etc.).',
            detail: 'That request hits the host\'s edge (e.g. NGINX) in front of the static Pages service.'
        },
        {
            title: '4. GitLab edge & lookup',
            desc: 'The Pages service receives the request. It looks up the domain (via API or cache) to find which project and site to serve.',
            detail: 'Domain → project mapping determines that this portfolio repo is the one to serve.'
        },
        {
            title: '5. Object Storage',
            desc: 'The static files for this site (index.html, CSS, JS, assets) are read from object storage—or from cache if already loaded.',
            detail: 'When you pushed and the pipeline ran (or on commit), the built output was stored here; the Pages daemon serves from it.'
        },
        {
            title: '6. Response → this page',
            desc: 'The host sends the response back: status line, headers, then the HTML body. Your browser receives it, parses HTML, loads CSS/JS, and renders the page you see.',
            detail: 'The document you\'re reading was delivered over that same connection (or a follow-up request for assets).'
        }
    ];

    function getOverlay() {
        return document.getElementById('request-journey-overlay');
    }

    function getModal() {
        return document.getElementById('request-journey-modal');
    }

    function shouldShow() {
        try {
            if (localStorage.getItem(STORAGE_KEY)) return false;
            if (sessionStorage.getItem(SESSION_KEY)) return false;
        } catch (_) {}
        return true;
    }

    function markSeen() {
        try {
            sessionStorage.setItem(SESSION_KEY, '1');
        } catch (_) {}
    }

    function hide() {
        var overlay = getOverlay();
        if (overlay) {
            overlay.setAttribute('aria-hidden', 'true');
            setTimeout(function () {
                overlay.style.display = 'none';
            }, 280);
        }
        markSeen();
    }

    function show() {
        var overlay = getOverlay();
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.setAttribute('aria-hidden', 'false');
        }
    }

    function renderStep(index) {
        var step = STEPS[index];
        if (!step) return;
        var titleEl = document.getElementById('rj-step-title');
        var descEl = document.getElementById('rj-step-desc');
        var detailEl = document.getElementById('rj-step-detail');
        if (titleEl) titleEl.textContent = step.title;
        if (descEl) descEl.textContent = step.desc;
        if (detailEl) {
            detailEl.textContent = step.detail;
            detailEl.style.display = step.detail ? 'block' : 'none';
        }
        var progress = document.getElementById('rj-progress');
        if (progress) {
            var dots = progress.querySelectorAll('span');
            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === index);
            });
        }
        document.getElementById('rj-step-index').textContent = (index + 1) + ' / ' + STEPS.length;
        var nextBtn = document.getElementById('rj-next');
        if (nextBtn) {
            nextBtn.textContent = index === STEPS.length - 1 ? 'Done' : 'Next';
        }
    }

    function bindPopup() {
        var overlay = getOverlay();
        var modal = getModal();
        if (!overlay || !modal) return;

        var stepIndex = 0;

        function goNext() {
            if (stepIndex < STEPS.length - 1) {
                stepIndex++;
                renderStep(stepIndex);
            } else {
                hide();
            }
        }

        var nextBtn = document.getElementById('rj-next');
        if (nextBtn) nextBtn.addEventListener('click', goNext);

        var skipBtn = document.getElementById('rj-skip');
        if (skipBtn) skipBtn.addEventListener('click', hide);

        var dontShow = document.getElementById('rj-dont-show');
        if (dontShow) {
            dontShow.addEventListener('click', function () {
                try {
                    localStorage.setItem(STORAGE_KEY, '1');
                } catch (_) {}
                hide();
            });
        }

        overlay.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') hide();
            if (e.key === 'Enter' || e.key === ' ') {
                if (document.activeElement && document.activeElement.id === 'rj-next') return;
                e.preventDefault();
                goNext();
            }
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) hide();
        });

        renderStep(0);
    }

    function createPopupMarkup() {
        var overlay = document.getElementById('request-journey-overlay');
        if (!overlay || overlay.querySelector('.request-journey-modal')) return;

        var modal = document.createElement('div');
        modal.id = 'request-journey-modal';
        modal.className = 'request-journey-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'rj-step-title');
        modal.setAttribute('aria-describedby', 'rj-step-desc');

        modal.innerHTML =
            '<div class="request-journey-header">' +
            '  <span>How this page was served — real request journey (GitLab Pages / static host)</span>' +
            '  <div class="request-journey-progress" id="rj-progress">' +
            Array(6).fill('<span></span>').join('') +
            '  </div>' +
            '</div>' +
            '<div class="request-journey-step">' +
            '  <div class="request-journey-step-title" id="rj-step-title" aria-live="polite"></div>' +
            '  <div class="request-journey-step-desc" id="rj-step-desc"></div>' +
            '  <div class="request-journey-step-detail" id="rj-step-detail"></div>' +
            '  <p style="margin-top:12px;font-size:0.8rem;opacity:0.7;"><span id="rj-step-index">1 / 6</span></p>' +
            '</div>' +
            '<div class="request-journey-footer">' +
            '  <div>' +
            '    <button type="button" id="rj-next">Next</button>' +
            '    <button type="button" id="rj-skip" class="rj-skip">Skip — Enter portfolio</button>' +
            '  </div>' +
            '  <button type="button" id="rj-dont-show">Don\'t show again</button>' +
            '</div>';

        overlay.appendChild(modal);
        bindPopup();
    }

    function init() {
        var overlay = getOverlay();
        if (!overlay) return;

        createPopupMarkup();

        if (shouldShow()) {
            show();
            overlay.querySelector('button') && overlay.querySelector('button').focus();
        } else {
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
        }
    }

    window.requestJourneyReplay = function () {
        try {
            sessionStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(STORAGE_KEY);
        } catch (_) {}
        var overlay = getOverlay();
        if (overlay) {
            var existing = document.getElementById('request-journey-modal');
            if (existing) existing.remove();
            createPopupMarkup();
            overlay.style.display = 'flex';
            overlay.setAttribute('aria-hidden', 'false');
            var next = document.getElementById('rj-next');
            if (next) next.focus();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
