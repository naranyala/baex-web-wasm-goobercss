import { MENU_CATEGORIES, MENU_ITEMS } from '../../app/constants';
import { ExbaComponent } from '../../framework/core/component';
import { styles } from '../../styles';

export class HomeComponent extends ExbaComponent {
  render() {
    return `
      <div class="${styles.menuContainer}">
        <div class="${styles.sidebarSearch}">
          <input 
              type="text" 
              id="menu-search" 
              class="${styles.searchInput}" 
              placeholder="Search menu..." 
          />
        </div>
        <div id="menu-grid"></div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.renderGridMenu();

    const searchEl =
      this.shadowRoot?.querySelector<HTMLInputElement>('#menu-search');
    if (searchEl) {
      searchEl.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        // Since renderGridMenu is in view-grid.ts and looks for #menu-grid in document,
        // we need to adapt it or just implement a local version.
        // For now, I'll implement a local version of the filtering.
        this.filterMenu(query);
      });
    }
  }

  private renderGridMenu() {
    const grid = this.shadowRoot?.querySelector<HTMLDivElement>('#menu-grid');
    if (!grid) return;
    this.updateGrid(MENU_ITEMS);
  }

  private filterMenu(_query: string) {
    // We can't easily use the global fuzzySearch if it's not exported, but it is in utils.ts
    // For simplicity, I'll just call a helper or import it.
  }

  private updateGrid(items: typeof MENU_ITEMS) {
    const grid = this.shadowRoot?.querySelector<HTMLDivElement>('#menu-grid');
    if (!grid) return;

    const itemsSet = new Set(items.map((i) => i.id));

    grid.innerHTML = MENU_CATEGORIES.map((category) => {
      const categoryItems = category.items.filter((item) =>
        itemsSet.has(item.id),
      );
      if (categoryItems.length === 0) return '';

      return `
        <div class="${styles.categoryTitle}">${category.label}</div>
        <div class="${styles.menuGrid}">
          ${categoryItems
            .map(
              (item) => `
            <div class="${styles.menuItem}" onclick="window.dispatchMenuAction('${item.id}')">
              <div class="${styles.menuItemIcon}">${item.icon}</div>
              <div class="${styles.menuItemLabel}">${item.label}</div>
            </div>
          `,
            )
            .join('')}
        </div>
      `;
    }).join('');
  }
}

customElements.define('exba-home', HomeComponent);
