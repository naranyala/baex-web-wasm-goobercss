import { ExbaComponent } from '@core/lifecycle/component';
import { html } from '@core/dom/dom';
import { t } from '@shell/theme/styles';

/**
 * A demo component to showcase the ExbaButton variants and configurations.
 * 
 * @extends ExbaComponent
 */
export class ButtonDemoComponent extends ExbaComponent {
  static useShadow = true;

  static styles = {
    container: 'padding: 2rem; display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto; color: ${t.zinc100};',
    section: 'display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; background: ${t.zinc900a}; border: 1px solid ${t.zinc800}; border-radius: 1rem;',
    sectionTitle: 'font-size: 1.25rem; font-weight: 700; color: ${t.indigo400}; margin-bottom: 0.5rem;',
    row: 'display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;',
  };

  render() {
    return html`
      <div class="container">
        <h1>Flutter-inspired Button Variants</h1>
        
        <div class="section">
          <h2 class="sectionTitle">Visual Variants</h2>
          <div class="row">
            <exba-button variant="primary">Primary Action</exba-button>
            <exba-button variant="secondary">Secondary</exba-button>
            <exba-button variant="outline">Outlined</exba-button>
            <exba-button variant="ghost">Ghost Button</exba-button>
            <exba-button variant="danger">Danger Action</exba-button>
          </div>
        </div>

        <div class="section">
          <h2 class="sectionTitle">Sizes</h2>
          <div class="row">
            <exba-button size="xs">Extra Small</exba-button>
            <exba-button size="sm">Small</exba-button>
            <exba-button size="md">Medium (Default)</exba-button>
            <exba-button size="lg">Large Size</exba-button>
            <exba-button size="xl">Extra Large</exba-button>
          </div>
        </div>

        <div class="section">
          <h2 class="sectionTitle">States & Icons</h2>
          <div class="row">
            <exba-button loading="true">Loading State</exba-button>
            <exba-button disabled="true">Disabled State</exba-button>
            <exba-button variant="outline">
              <span slot="leading">🔍</span>
              Search Icon
            </exba-button>
            <exba-button variant="primary">
              Next Step
              <span slot="trailing">→</span>
            </exba-button>
          </div>
        </div>

        <div class="section">
          <h2 class="sectionTitle">Layout Variations</h2>
          <div class="row" style="flex-direction: column; align-items: stretch;">
            <exba-button block="true" variant="primary">Full Width (Block) Button</exba-button>
            <exba-button block="true" variant="outline">Another Block Button</exba-button>
          </div>
        </div>
      </div>
    `;
  }
}
