import { screen } from '@testing-library/dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ButtonComponent } from '../button';

if (!customElements.get('exba-button')) {
  customElements.define('exba-button', ButtonComponent);
}

describe('ButtonComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render with default primary variant and md size', () => {
    document.body.innerHTML = '<exba-button data-testid="btn">Click Me</exba-button>';
    const el = screen.getByTestId('btn');
    const shadow = el.shadowRoot!;
    const button = shadow.querySelector('button')!;
    
    expect(button.classList.contains('primary')).toBe(true);
    expect(button.classList.contains('md')).toBe(true);
    expect(el.textContent?.trim()).toBe('Click Me');
  });

  it('should apply secondary variant and lg size', async () => {
    document.body.innerHTML = '<exba-button data-testid="btn" variant="secondary" size="lg">Action</exba-button>';
    const el = screen.getByTestId('btn');
    
    // Wait for properties to sync and render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const button = el.shadowRoot!.querySelector('button')!;
    expect(button.classList.contains('secondary')).toBe(true);
    expect(button.classList.contains('lg')).toBe(true);
  });

  it('should show loading spinner and disable button', async () => {
    document.body.innerHTML = '<exba-button data-testid="btn" loading="true">Submit</exba-button>';
    const el = screen.getByTestId('btn');
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const button = el.shadowRoot!.querySelector('button')!;
    expect(button.disabled).toBe(true);
    expect(button.classList.contains('loading')).toBe(true);
    expect(button.querySelector('.spinner')).not.toBeNull();
  });

  it('should support leading and trailing slots', () => {
    document.body.innerHTML = `
      <exba-button data-testid="btn">
        <span slot="leading">L</span>
        Main Content
        <span slot="trailing">R</span>
      </exba-button>
    `;
    const el = screen.getByTestId('btn');
    const shadow = el.shadowRoot!;
    
    const slots = shadow.querySelectorAll('slot');
    expect(slots.length).toBe(3);
    expect(slots[0].getAttribute('name')).toBe('leading');
    expect(slots[1].getAttribute('name')).toBeNull(); // default slot
    expect(slots[2].getAttribute('name')).toBe('trailing');
  });
});
