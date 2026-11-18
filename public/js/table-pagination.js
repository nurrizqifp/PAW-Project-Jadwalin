/**
 * Jadwalin Dynamic Table Pagination & Filter Controller
 * Reusable client-side data table engine
 * Strictly NO emoji and NO ASCII art.
 */

(function (window, document) {
  'use strict';

  class TablePaginationController {
    constructor(tableEl) {
      this.table = tableEl;
      this.tableId = tableEl.id;
      if (!this.tableId) {
        this.tableId = 'table-' + Math.random().toString(36).substring(2, 9);
        this.table.id = this.tableId;
      }

      this.tbody = this.table.querySelector('tbody');
      if (!this.tbody) return;

      this.currentPage = 1;
      this.pageSize = 10;
      this.searchQuery = '';
      this.filters = [];
      this.allRows = [];
      this.filteredRows = [];

      this.cacheRows();
      this.findControls();
      this.bindEvents();
      this.applyFilterAndPaginate();
    }

    cacheRows() {
      if (!this.tbody) return;
      // Filter out pre-existing empty state rows
      const rows = Array.from(this.tbody.querySelectorAll('tr:not(.table-empty-row):not([data-empty-row])'));
      this.allRows = rows.map((tr) => {
        // Collect search string from data-search or all td text
        const customSearch = tr.getAttribute('data-search');
        let textContent = '';
        if (customSearch) {
          textContent = customSearch.toLowerCase();
        } else {
          textContent = tr.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
        }
        return {
          element: tr,
          text: textContent
        };
      });
    }

    findControls() {
      this.searchInput = document.querySelector(`input[data-table-search="${this.tableId}"]`);
      this.clearSearchBtn = document.querySelector(`button[data-table-clear-search="${this.tableId}"]`);
      this.resetBtn = document.querySelector(`button[data-table-reset="${this.tableId}"]`);
      this.filterSelects = Array.from(document.querySelectorAll(`select[data-table-filter="${this.tableId}"]`));
      this.pageSizeSelect = document.querySelector(`select[data-table-page-size="${this.tableId}"]`);
      this.paginationContainer = document.querySelector(`.table-pagination-container[data-for-table="${this.tableId}"]`);

      if (this.paginationContainer) {
        const initialSize = parseInt(this.paginationContainer.getAttribute('data-page-size'), 10);
        if (!isNaN(initialSize) && initialSize > 0) {
          this.pageSize = initialSize;
        }
      }

      if (this.pageSizeSelect) {
        this.pageSize = parseInt(this.pageSizeSelect.value, 10) || this.pageSize;
      }

      this.btnFirst = document.querySelector(`button[data-table-page-btn="first"][data-target="${this.tableId}"]`);
      this.btnPrev = document.querySelector(`button[data-table-page-btn="prev"][data-target="${this.tableId}"]`);
      this.btnNext = document.querySelector(`button[data-table-page-btn="next"][data-target="${this.tableId}"]`);
      this.btnLast = document.querySelector(`button[data-table-page-btn="last"][data-target="${this.tableId}"]`);
      this.pagesListContainer = document.querySelector(`div[data-table-pages-list="${this.tableId}"]`);

      this.infoStartEl = document.querySelector(`[data-info-start="${this.tableId}"]`);
      this.infoEndEl = document.querySelector(`[data-info-end="${this.tableId}"]`);
      this.infoTotalEl = document.querySelector(`[data-info-total="${this.tableId}"]`);
      this.badgeTextEl = document.querySelector(`[data-badge-text="${this.tableId}"]`);
    }

    bindEvents() {
      if (this.searchInput) {
        this.searchInput.addEventListener('input', () => {
          this.searchQuery = this.searchInput.value.trim().toLowerCase();
          if (this.clearSearchBtn) {
            if (this.searchQuery.length > 0) {
              this.clearSearchBtn.classList.remove('hidden');
            } else {
              this.clearSearchBtn.classList.add('hidden');
            }
          }
          this.currentPage = 1;
          this.applyFilterAndPaginate();
          this.toggleResetButton();
        });
      }

      if (this.clearSearchBtn) {
        this.clearSearchBtn.addEventListener('click', () => {
          if (this.searchInput) {
            this.searchInput.value = '';
            this.searchQuery = '';
            this.clearSearchBtn.classList.add('hidden');
            this.currentPage = 1;
            this.applyFilterAndPaginate();
            this.toggleResetButton();
            this.searchInput.focus();
          }
        });
      }

      this.filterSelects.forEach((sel) => {
        sel.addEventListener('change', () => {
          this.currentPage = 1;
          this.applyFilterAndPaginate();
          this.toggleResetButton();
        });
      });

      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', () => {
          if (this.searchInput) {
            this.searchInput.value = '';
            this.searchQuery = '';
          }
          if (this.clearSearchBtn) {
            this.clearSearchBtn.classList.add('hidden');
          }
          this.filterSelects.forEach((sel) => {
            sel.selectedIndex = 0;
          });
          this.currentPage = 1;
          this.applyFilterAndPaginate();
          this.toggleResetButton();
        });
      }

      if (this.pageSizeSelect) {
        this.pageSizeSelect.addEventListener('change', () => {
          const val = parseInt(this.pageSizeSelect.value, 10);
          this.pageSize = isNaN(val) ? 10 : val;
          this.currentPage = 1;
          this.applyFilterAndPaginate();
        });
      }

      if (this.btnFirst) {
        this.btnFirst.addEventListener('click', () => {
          if (this.currentPage > 1) {
            this.currentPage = 1;
            this.applyFilterAndPaginate();
          }
        });
      }

      if (this.btnPrev) {
        this.btnPrev.addEventListener('click', () => {
          if (this.currentPage > 1) {
            this.currentPage--;
            this.applyFilterAndPaginate();
          }
        });
      }

      if (this.btnNext) {
        this.btnNext.addEventListener('click', () => {
          const totalPages = this.calculateTotalPages();
          if (this.currentPage < totalPages) {
            this.currentPage++;
            this.applyFilterAndPaginate();
          }
        });
      }

      if (this.btnLast) {
        this.btnLast.addEventListener('click', () => {
          const totalPages = this.calculateTotalPages();
          if (this.currentPage < totalPages) {
            this.currentPage = totalPages;
            this.applyFilterAndPaginate();
          }
        });
      }
    }

    toggleResetButton() {
      if (!this.resetBtn) return;
      const hasSearch = this.searchQuery.length > 0;
      let hasFilter = false;
      this.filterSelects.forEach((sel) => {
        const val = sel.value;
        if (val && val !== 'Semua' && val !== '' && val !== 'all') {
          hasFilter = true;
        }
      });

      if (hasSearch || hasFilter) {
        this.resetBtn.classList.remove('hidden');
      } else {
        this.resetBtn.classList.add('hidden');
      }
    }

    matchRow(item) {
      const tr = item.element;

      // 1. Check Search Query
      if (this.searchQuery) {
        const words = this.searchQuery.split(/\s+/);
        const matchAllWords = words.every((word) => item.text.includes(word));
        if (!matchAllWords) return false;
      }

      // 2. Check Dropdown Filters
      for (const sel of this.filterSelects) {
        const filterVal = sel.value;
        if (!filterVal || filterVal === 'Semua' || filterVal === '' || filterVal === 'all') {
          continue;
        }

        const dataAttr = sel.getAttribute('data-filter-attr');
        const colIdxStr = sel.getAttribute('data-col-idx');

        if (dataAttr) {
          const attrVal = (tr.getAttribute(`data-${dataAttr}`) || tr.getAttribute(dataAttr) || '').trim();
          if (attrVal.toLowerCase() !== filterVal.toLowerCase()) {
            return false;
          }
        } else if (colIdxStr !== null) {
          const colIdx = parseInt(colIdxStr, 10);
          const cell = tr.children[colIdx];
          if (!cell) return false;
          const cellText = cell.textContent.trim().toLowerCase();
          if (!cellText.includes(filterVal.toLowerCase())) {
            return false;
          }
        }
      }

      return true;
    }

    calculateTotalPages() {
      if (this.pageSize === -1) return 1;
      return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
    }

    applyFilterAndPaginate() {
      this.filteredRows = this.allRows.filter((item) => this.matchRow(item));

      const totalItems = this.filteredRows.length;
      const totalPages = this.calculateTotalPages();

      if (this.currentPage > totalPages) {
        this.currentPage = totalPages;
      }
      if (this.currentPage < 1) {
        this.currentPage = 1;
      }

      let startIndex = 0;
      let endIndex = totalItems;

      if (this.pageSize !== -1 && totalItems > 0) {
        startIndex = (this.currentPage - 1) * this.pageSize;
        endIndex = Math.min(startIndex + this.pageSize, totalItems);
      }

      // Show/Hide Rows
      const visibleSet = new Set(this.filteredRows.slice(startIndex, endIndex).map((r) => r.element));

      this.allRows.forEach((item) => {
        if (visibleSet.has(item.element)) {
          item.element.style.display = '';
        } else {
          item.element.style.display = 'none';
        }
      });

      // Handle Empty State Row
      this.updateEmptyState(totalItems);

      // Update Pagination UI
      this.updatePaginationInfo(startIndex, endIndex, totalItems);
      this.updateNavigationButtons(totalPages, totalItems);
      this.renderPageNumbers(totalPages);
      this.updateBadge(totalItems);
    }

    updateEmptyState(totalItems) {
      let emptyRow = this.tbody.querySelector('.table-empty-row');
      if (totalItems === 0) {
        if (!emptyRow) {
          emptyRow = document.createElement('tr');
          emptyRow.className = 'table-empty-row';
          const colCount = Math.max(1, this.table.querySelectorAll('thead th').length || 6);
          emptyRow.innerHTML = `
            <td colspan="${colCount}" class="px-4 py-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
              <div class="flex flex-col items-center justify-center gap-2">
                <i class="ph ph-magnifying-glass text-2xl text-zinc-400 dark:text-zinc-600"></i>
                <span class="font-medium">Tidak ada data yang sesuai dengan pencarian atau filter.</span>
              </div>
            </td>
          `;
          this.tbody.appendChild(emptyRow);
        } else {
          emptyRow.style.display = '';
        }
      } else if (emptyRow) {
        emptyRow.style.display = 'none';
      }
    }

    updatePaginationInfo(startIndex, endIndex, totalItems) {
      const displayStart = totalItems === 0 ? 0 : startIndex + 1;
      const displayEnd = endIndex;

      if (this.infoStartEl) this.infoStartEl.textContent = displayStart;
      if (this.infoEndEl) this.infoEndEl.textContent = displayEnd;
      if (this.infoTotalEl) this.infoTotalEl.textContent = totalItems;
    }

    updateBadge(totalItems) {
      if (!this.badgeTextEl) return;
      if (this.allRows.length === totalItems) {
        this.badgeTextEl.textContent = `${totalItems} Data`;
      } else {
        this.badgeTextEl.textContent = `${totalItems} dari ${this.allRows.length} Data`;
      }
    }

    updateNavigationButtons(totalPages, totalItems) {
      const isFirst = this.currentPage <= 1 || totalItems === 0;
      const isLast = this.currentPage >= totalPages || totalItems === 0;

      if (this.btnFirst) this.btnFirst.disabled = isFirst;
      if (this.btnPrev) this.btnPrev.disabled = isFirst;
      if (this.btnNext) this.btnNext.disabled = isLast;
      if (this.btnLast) this.btnLast.disabled = isLast;
    }

    renderPageNumbers(totalPages) {
      if (!this.pagesListContainer) return;
      this.pagesListContainer.innerHTML = '';

      if (totalPages <= 1) return;

      const maxButtons = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);

      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      if (startPage > 1) {
        this.createPageButton(1);
        if (startPage > 2) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'px-1 text-xs text-zinc-400';
          ellipsis.textContent = '...';
          this.pagesListContainer.appendChild(ellipsis);
        }
      }

      for (let p = startPage; p <= endPage; p++) {
        this.createPageButton(p, p === this.currentPage);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'px-1 text-xs text-zinc-400';
          ellipsis.textContent = '...';
          this.pagesListContainer.appendChild(ellipsis);
        }
        this.createPageButton(totalPages);
      }
    }

    createPageButton(pageNum, isActive = false) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = pageNum;
      btn.className = isActive
        ? 'inline-flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg bg-[#0c2b5e] text-white font-bold text-xs shadow-2xs dark:bg-amber-400 dark:text-zinc-900 transition-colors'
        : 'inline-flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors shadow-2xs';

      btn.addEventListener('click', () => {
        if (this.currentPage !== pageNum) {
          this.currentPage = pageNum;
          this.applyFilterAndPaginate();
        }
      });

      this.pagesListContainer.appendChild(btn);
    }

    refresh() {
      this.cacheRows();
      this.applyFilterAndPaginate();
    }
  }

  const JadwalinTablePagination = {
    instances: new Map(),

    init(tableSelector = 'table.paginated-table, table[data-pagination="true"]') {
      const tables = document.querySelectorAll(tableSelector);
      tables.forEach((table) => {
        if (!this.instances.has(table.id || table)) {
          const instance = new TablePaginationController(table);
          this.instances.set(table.id, instance);
        } else {
          this.instances.get(table.id).refresh();
        }
      });
    },

    bindTable(tableId) {
      const table = document.getElementById(tableId);
      if (!table) return null;
      let instance = this.instances.get(tableId);
      if (!instance) {
        instance = new TablePaginationController(table);
        this.instances.set(tableId, instance);
      } else {
        instance.refresh();
      }
      return instance;
    },

    refresh(tableId) {
      if (tableId && this.instances.has(tableId)) {
        this.instances.get(tableId).refresh();
      } else {
        this.instances.forEach((inst) => inst.refresh());
      }
    }
  };

  window.JadwalinTablePagination = JadwalinTablePagination;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      JadwalinTablePagination.init();
    });
  } else {
    JadwalinTablePagination.init();
  }
})(window, document);
