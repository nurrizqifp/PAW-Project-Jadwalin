/**
 * Jadwalin Core Client Application Library
 * Precision UI Architecture & Helpers
 * Owner: Haidar Yahya Mudhofar (20240140093) - Branch yuum
 */

(function (window, document) {
  'use strict';

  const JadwalinUI = {
    // ----------------------------------------------------
    // 1. THEME MANAGER (Light / Dark Mode with Persistence)
    // ----------------------------------------------------
    theme: {
      init() {
        const isDark = localStorage.theme === 'dark' ||
          (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        this.updateIcon();
      },

      toggle() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
        this.updateIcon();
        JadwalinUI.toast.show(
          isDark ? 'Mode Gelap Aktif' : 'Mode Terang Aktif',
          'info'
        );
      },

      updateIcon() {
        const isDark = document.documentElement.classList.contains('dark');

        // 1. Update semua button dengan selector theme toggle
        const toggleButtons = document.querySelectorAll('[data-toggle-theme], #theme-toggle-btn, button[aria-label="Ganti Mode Tampilan"]');
        toggleButtons.forEach(btn => {
          const icon = btn.querySelector('i');
          if (icon) {
            icon.className = isDark
              ? 'theme-toggle-icon ph ph-sun text-base text-amber-400'
              : 'theme-toggle-icon ph ph-moon text-base text-zinc-700 dark:text-zinc-300';
          }
        });

        // 2. Update standalone icons
        const icons = document.querySelectorAll('.theme-toggle-icon, #navbarThemeIcon, #theme-icon');
        icons.forEach(icon => {
          if (icon) {
            icon.className = isDark
              ? 'theme-toggle-icon ph ph-sun text-base text-zinc-300'
              : 'theme-toggle-icon ph ph-moon text-base text-zinc-700 dark:text-zinc-300';
          }
        });
      }
    },

    // ----------------------------------------------------
    // 2. TOAST NOTIFICATION SYSTEM
    // ----------------------------------------------------
    toast: {
      containerId: 'jadwalin-toast-container',

      getOrCreateContainer() {
        let container = document.getElementById(this.containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = this.containerId;
          container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0';
          document.body.appendChild(container);
        }
        return container;
      },

      show(message, type = 'success', duration = 3500) {
        const container = this.getOrCreateContainer();

        const toast = document.createElement('div');
        toast.className = 'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium shadow-lg border transition-all duration-300 transform translate-y-2 opacity-0 ' +
          (type === 'error'
            ? 'bg-rose-950/90 text-rose-100 border-rose-800'
            : type === 'warning'
              ? 'bg-amber-950/90 text-amber-100 border-amber-800'
              : type === 'info'
                ? 'bg-zinc-900 text-zinc-100 border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-300'
                : 'bg-emerald-950/90 text-emerald-100 border-emerald-800');

        let iconName = 'ph-check-circle';
        if (type === 'error') iconName = 'ph-warning-circle';
        if (type === 'warning') iconName = 'ph-warning';
        if (type === 'info') iconName = 'ph-info';

        toast.innerHTML = `
          <i class="ph ${iconName} text-base shrink-0"></i>
          <span class="flex-1 leading-normal">${message}</span>
          <button type="button" aria-label="Tutup" class="text-current opacity-70 hover:opacity-100 p-0.5">
            <i class="ph ph-x text-sm"></i>
          </button>
        `;

        const closeBtn = toast.querySelector('button');
        const removeToast = () => {
          toast.classList.add('opacity-0', 'translate-y-2');
          setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
          }, 300);
        };

        closeBtn.addEventListener('click', removeToast);
        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
          toast.classList.remove('opacity-0', 'translate-y-2');
        });

        // Auto dismiss
        setTimeout(removeToast, duration);
      }
    },

    // ----------------------------------------------------
    // 3. SLIDE-OVER DRAWER (NOTIFIKASI)
    // ----------------------------------------------------
    drawer: {
      open(drawerId = 'notif-drawer-overlay') {
        const overlay = document.getElementById(drawerId);
        if (!overlay) return;
        const drawer = overlay.querySelector('[role="dialog"]') || overlay.firstElementChild;
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        if (drawer) drawer.classList.remove('translate-x-full');
      },

      close(drawerId = 'notif-drawer-overlay') {
        const overlay = document.getElementById(drawerId);
        if (!overlay) return;
        const drawer = overlay.querySelector('[role="dialog"]') || overlay.firstElementChild;
        overlay.classList.add('opacity-0', 'pointer-events-none');
        if (drawer) drawer.classList.add('translate-x-full');
      }
    },

    // ----------------------------------------------------
    // 4. MODAL DIALOG CONTROLLER
    // ----------------------------------------------------
    modal: {
      open(modalId) {
        const overlay = document.getElementById(modalId);
        if (!overlay) return;
        const dialog = overlay.querySelector('[role="dialog"]') || overlay.firstElementChild;
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        if (dialog) {
          dialog.classList.remove('scale-95');
          dialog.classList.add('scale-100');
        }
      },

      close(modalId) {
        const overlay = document.getElementById(modalId);
        if (!overlay) return;
        const dialog = overlay.querySelector('[role="dialog"]') || overlay.firstElementChild;
        overlay.classList.add('opacity-0', 'pointer-events-none');
        if (dialog) {
          dialog.classList.remove('scale-100');
          dialog.classList.add('scale-95');
        }
      }
    },

    // ----------------------------------------------------
    // 5. COUNTDOWN TIMER HELPER (Mahasiswa Dashboard)
    // ----------------------------------------------------
    countdown: {
      start(elementId, endTime) {
        const targetEl = document.getElementById(elementId);
        if (!targetEl) return;

        const update = () => {
          const now = new Date();
          let target = new Date();

          if (typeof endTime === 'string' && endTime.includes(':')) {
            const [hours, minutes] = endTime.split(':');
            target.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
          } else if (endTime instanceof Date) {
            target = endTime;
          }

          let diff = target.getTime() - now.getTime();
          if (diff <= 0) {
            targetEl.textContent = '00:00:00';
            return;
          }

          const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
          const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
          const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
          targetEl.textContent = `${h}:${m}:${s}`;
        };

        update();
        return setInterval(update, 1000);
      }
    },

    // ----------------------------------------------------
    // 6. SPA FETCH HELPER WITH ERROR HANDLING
    // ----------------------------------------------------
    async apiFetch(url, options = {}) {
      const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      try {
        const res = await fetch(url, {
          ...options,
          headers: { ...defaultHeaders, ...options.headers }
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg = data && data.pesan ? data.pesan : `Terjadi kesalahan (HTTP ${res.status})`;
          JadwalinUI.toast.show(msg, 'error');
          throw new Error(msg);
        }

        return data;
      } catch (err) {
        if (!options.silent) {
          console.error('[Jadwalin API Error]:', err.message);
        }
        throw err;
      }
    }
  };

  // Auto Flash Message from URL Query Parameters (?status=success&msg=...)
  function checkUrlFlashMessage() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const msg = urlParams.get('msg') || urlParams.get('pesan');
      if (msg) {
        const type = urlParams.get('status') || urlParams.get('type') || 'success';
        JadwalinUI.toast.show(decodeURIComponent(msg), type);

        // Clean up URL without triggering reload
        urlParams.delete('msg');
        urlParams.delete('pesan');
        urlParams.delete('status');
        urlParams.delete('type');
        const cleanSearch = urlParams.toString();
        const newUrl = window.location.pathname + (cleanSearch ? '?' + cleanSearch : '');
        window.history.replaceState({}, document.title, newUrl);
      }
    } catch (e) {
      // Ignore if history state manipulation fails
    }
  }

  // Global Keydown Listeners (Escape key closes modals & drawers)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openOverlays = document.querySelectorAll('.fixed.inset-0:not(.pointer-events-none)');
      openOverlays.forEach(overlay => {
        if (overlay.id) {
          JadwalinUI.modal.close(overlay.id);
          JadwalinUI.drawer.close(overlay.id);
        }
      });
    }
  });

  // Global DOM Ready Init
  document.addEventListener('DOMContentLoaded', () => {
    JadwalinUI.theme.init();
    checkUrlFlashMessage();

    // Attach click events to all elements with data-toggle-theme safely
    document.querySelectorAll('[data-toggle-theme]').forEach(btn => {
      // Hapus inline onclick jika ada agar tidak double-fire
      btn.removeAttribute('onclick');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        JadwalinUI.theme.toggle();
      });
    });
  });

  // Expose to window
  window.JadwalinUI = JadwalinUI;
  window.toggleTheme = () => JadwalinUI.theme.toggle();

})(window, document);
