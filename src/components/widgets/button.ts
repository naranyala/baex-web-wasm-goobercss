import { ExbaComponent } from '@core/lifecycle/component';
import { html } from '@core/dom/dom';
import { ease, t } from '@shell/theme/styles';

/**
 * A highly configurable Button component inspired by Flutter's widget variants.
 * 
 * Supports multiple visual variants, sizes, and states (loading, disabled).
 * Uses content projection (slots) for icons and labels.
 * 
 * @example
 * <exba-button variant="primary" size="md">Click Me</exba-button>
 * 
 * @extends ExbaComponent
 */
export class ButtonComponent extends ExbaComponent {
  static useShadow = true;

  static props = {
    variant: 'string', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size: 'string',    // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    loading: 'boolean',
    disabled: 'boolean',
    block: 'boolean',
  };

  static styles = {
    btn: `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 600;
      font-family: inherit;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all ${ease};
      border: 1px solid transparent;
      user-select: none;
      position: relative;
      white-space: nowrap;
      text-decoration: none;
      outline: none;
    `,
    
    // Variants
    primary: `background: ${t.indigo600}; color: ${t.white}; &:hover { background: ${t.indigo500}; } &:active { transform: scale(0.98); }`,
    secondary: `background: ${t.zinc800}; color: ${t.zinc100}; &:hover { background: ${t.zinc700}; }`,
    outline: `background: transparent; border-color: ${t.zinc700}; color: ${t.zinc100}; &:hover { background: ${t.zinc800}; border-color: ${t.zinc600}; }`,
    ghost: `background: transparent; color: ${t.zinc400}; &:hover { background: ${t.zinc800a}; color: ${t.zinc100}; }`,
    danger: `background: ${t.red600}; color: ${t.white}; &:hover { background: #ef4444; }`,
    
    // Sizes
    xs: 'padding: 0.25rem 0.5rem; font-size: 0.75rem;',
    sm: 'padding: 0.375rem 0.75rem; font-size: 0.8125rem;',
    md: 'padding: 0.5rem 1rem; font-size: 0.875rem;',
    lg: 'padding: 0.75rem 1.25rem; font-size: 1rem;',
    xl: 'padding: 1rem 1.5rem; font-size: 1.125rem;',
    
    block: 'display: flex; width: 100%;',
    
    disabled: `opacity: 0.5; cursor: not-allowed; pointer-events: none;`,
    
    loading: `cursor: wait;`,
    
    spinner: `
      width: 1rem;
      height: 1rem;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    `,
    '@keyframes spin': '{ from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'
  };

  render() {
    const variant = this.state.variant || 'primary';
    const size = this.state.size || 'md';
    const isLoading = this.state.loading === true;
    const isDisabled = this.state.disabled === true || isLoading;
    const isBlock = this.state.block === true;

    const classList = [
      'btn',
      variant,
      size,
      isBlock ? 'block' : '',
      isDisabled ? 'disabled' : '',
      isLoading ? 'loading' : '',
    ].filter(Boolean).join(' ');

    return html`
      <button 
        class="${classList}" 
        ${isDisabled ? 'disabled' : ''}
        type="button"
      >
        ${isLoading ? html`<span class="spinner"></span>` : ''}
        
        <slot name="leading"></slot>
        <slot></slot>
        <slot name="trailing"></slot>
      </button>
    `;
  }
}
