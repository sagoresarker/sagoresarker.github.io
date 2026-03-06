(function () {
    var STORAGE_KEY = 'httpVersion';
    var DEFAULT_VERSION = '1.1';
    var VALID_VERSIONS = ['0.9', '1.0', '1.1', '2', '3'];
    var VERSION_NOTES = {
        '0.9': 'One line. GET only. No headers. No status codes. (1991)',
        '1.0': 'Status line + headers. One TCP connection per request. (1996)',
        '1.1': 'Persistent connections. Chunked encoding. Host header. (1997)',
        '2': 'Binary framing. Multiplexing. HPACK header compression. (2015)',
        '3': 'QUIC (UDP). 0-RTT. No TCP head-of-line blocking. (2022)'
    };

    function getStored() {
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            return VALID_VERSIONS.indexOf(v) !== -1 ? v : DEFAULT_VERSION;
        } catch (_) {
            return DEFAULT_VERSION;
        }
    }

    function setVersion(version) {
        document.documentElement.setAttribute('data-http-version', version);
        try {
            localStorage.setItem(STORAGE_KEY, version);
        } catch (_) {}
        var noteEl = document.getElementById('http-version-note');
        if (noteEl && VERSION_NOTES[version]) noteEl.textContent = VERSION_NOTES[version];
    }

    function init() {
        var version = getStored();
        setVersion(version);

        var bar = document.getElementById('http-version-bar');
        if (!bar) return;

        VALID_VERSIONS.forEach(function (v) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = 'HTTP/' + v;
            btn.setAttribute('aria-label', 'Switch to HTTP/' + v);
            if (v === version) btn.setAttribute('aria-current', 'true');
            btn.addEventListener('click', function () {
                setVersion(v);
                bar.querySelectorAll('button').forEach(function (b) {
                    b.removeAttribute('aria-current');
                    if (b.textContent === 'HTTP/' + v) b.setAttribute('aria-current', 'true');
                });
            });
            bar.appendChild(btn);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
