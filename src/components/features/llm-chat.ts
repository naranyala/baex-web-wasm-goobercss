import { ExbaComponent } from '@core/lifecycle/component';
import { html } from '@core/dom/dom';
import { EXBA } from '@core/lifecycle/exba';
import { t, ease } from '@shell/theme/styles';

/**
 * Represents a single message in the LLM chat.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
}

/**
 * Metadata for multimodal attachments.
 */
export interface ChatAttachment {
  name: string;
  type: 'image' | 'file';
  preview?: string;
}

/**
 * A multimodal LLM Chat interface demo.
 * 
 * Features:
 * - Reactive message feed.
 * - Multimodal attachment support (simulation).
 * - WASM-backed "intelligent" state processing.
 * - Modern conversational UI with glassmorphism.
 * 
 * @extends ExbaComponent
 */
export class LLMChatComponent extends ExbaComponent {
  static useShadow = true;

  private messages = this.useSignal<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am the EXBA Multimodal Assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);

  private currentInput = this.useSignal('');
  private isTyping = this.useSignal(false);
  private selectedAttachments = this.useSignal<ChatAttachment[]>([]);

  static styles = {
    container: `display: flex; flex-direction: column; height: 80vh; width: 100%; max-width: 900px; margin: 0 auto; background: ${t.zinc900a}; border: 1px solid ${t.zinc800a}; border-radius: 1.5rem; overflow: hidden; backdrop-filter: blur(12px);`,
    header: `padding: 1.25rem 2rem; border-bottom: 1px solid ${t.zinc800a}; display: flex; align-items: center; gap: 1rem;`,
    statusDot: `width: 8px; height: 8px; border-radius: 50%; background: ${t.emerald400}; box-shadow: 0 0 10px ${t.emerald400};`,
    title: `font-size: 1.125rem; font-weight: 700; color: ${t.zinc100};`,
    feed: `flex: 1; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; scroll-behavior: smooth;`,
    message: `display: flex; flex-direction: column; gap: 0.5rem; max-width: 80%;`,
    userMessage: `align-self: flex-end;`,
    assistantMessage: `align-self: flex-start;`,
    bubble: `padding: 1rem 1.25rem; border-radius: 1.25rem; font-size: 0.9375rem; line-height: 1.5; position: relative;`,
    userBubble: `background: ${t.indigo600}; color: ${t.white}; border-bottom-right-radius: 0.25rem;`,
    assistantBubble: `background: ${t.zinc800}; color: ${t.zinc100}; border-bottom-left-radius: 0.25rem; border: 1px solid ${t.zinc700};`,
    meta: `font-size: 0.7rem; color: ${t.zinc500}; margin: 0 0.5rem;`,
    attachmentContainer: `display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;`,
    attachment: `padding: 0.25rem 0.5rem; background: ${t.zinc850}; border: 1px solid ${t.zinc700}; border-radius: 0.5rem; font-size: 0.75rem; color: ${t.zinc300}; display: flex; align-items: center; gap: 0.4rem;`,
    
    inputArea: `padding: 1.5rem 2rem; border-top: 1px solid ${t.zinc800a}; background: ${t.zinc900};`,
    inputContainer: `display: flex; gap: 1rem; align-items: flex-end;`,
    textArea: `flex: 1; background: ${t.zinc850}; border: 1px solid ${t.zinc700}; border-radius: 1rem; padding: 0.75rem 1.25rem; color: ${t.zinc100}; font-family: inherit; font-size: 0.9375rem; outline: none; transition: border-color ${ease}; min-height: 44px; max-height: 120px; resize: none; &:focus { border-color: ${t.indigo500}; }`,
    iconBtn: `padding: 0.6rem; background: ${t.zinc800}; border: 1px solid ${t.zinc700}; border-radius: 0.75rem; color: ${t.zinc400}; cursor: pointer; transition: all ${ease}; &:hover { background: ${t.zinc700}; color: ${t.zinc100}; }`,
    sendBtn: `padding: 0.6rem 1.25rem; background: ${t.indigo600}; border: none; border-radius: 0.75rem; color: ${t.white}; font-weight: 600; cursor: pointer; transition: all ${ease}; &:hover { background: ${t.indigo500}; transform: translateY(-1px); } &:active { transform: translateY(0); }`,
    
    typing: `font-size: 0.8rem; color: ${t.zinc500}; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;`,
    typingDot: `width: 4px; height: 4px; border-radius: 50%; background: ${t.zinc500}; animation: bounce 1.4s infinite ease-in-out;`,
    '@keyframes bounce': `{ 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }`
  };

  protected onMount() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    const feed = this.shadowRoot?.querySelector('.feed');
    if (feed) {
      setTimeout(() => {
        feed.scrollTop = feed.scrollHeight;
      }, 50);
    }
  }

  private handleInput(e: any) {
    this.currentInput.value = e.target.value;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  private async sendMessage() {
    const content = this.currentInput.value.trim();
    const currentAttachments = this.selectedAttachments.value;
    
    if (!content && currentAttachments.length === 0) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 11),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString(),
      attachments: currentAttachments.length > 0 ? [...currentAttachments] : undefined,
    };

    this.messages.value = [...this.messages.value, userMsg];
    this.currentInput.value = '';
    this.selectedAttachments.value = [];
    this.scrollToBottom();

    // Trigger WASM simulation
    this.processWithWasm(userMsg);
  }

  private async processWithWasm(msg: ChatMessage) {
    this.isTyping.value = true;
    this.scrollToBottom();

    try {
      // Simulation of WASM processing the prompt
      const response = await EXBA.api.process_ir(JSON.stringify({
        type: 'LLMChatProcess',
        payload: { 
          prompt: msg.content,
          has_attachments: (msg.attachments?.length || 0) > 0
        }
      }));

      if (response.type === 'LLMChatResult') {
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 11),
          role: 'assistant',
          content: response.payload.text,
          timestamp: new Date().toLocaleTimeString(),
        };
        
        this.messages.value = [...this.messages.value, assistantMsg];
      }
    } catch (e) {
      console.error('WASM Chat processing failed', e);
    } finally {
      this.isTyping.value = false;
      this.scrollToBottom();
    }
  }

  private simulateAttachment() {
    const types: ('image' | 'file')[] = ['image', 'file'];
    const type = types[Math.floor(Math.random() * types.length)];
    const newAttachment: ChatAttachment = {
      name: type === 'image' ? `image_${Date.now()}.png` : `document_${Date.now()}.pdf`,
      type,
    };
    this.selectedAttachments.value = [...this.selectedAttachments.value, newAttachment];
  }

  render() {
    return html`
      <div class="container">
        <header class="header">
          <div class="statusDot"></div>
          <h1 class="title">Multimodal LLM Assistant</h1>
        </header>

        <div class="feed">
          ${this.messages.value.map(msg => html`
            <div class="message ${msg.role === 'user' ? 'userMessage' : 'assistantMessage'}">
              <div class="bubble ${msg.role === 'user' ? 'userBubble' : 'assistantBubble'}">
                ${msg.content}
                ${msg.attachments ? html`
                  <div class="attachmentContainer">
                    ${msg.attachments.map(at => html`
                      <div class="attachment">
                        <span>${at.type === 'image' ? '🖼️' : '📄'}</span>
                        ${at.name}
                      </div>
                    `)}
                  </div>
                ` : ''}
              </div>
              <span class="meta" style="align-self: ${msg.role === 'user' ? 'flex-end' : 'flex-start'}">
                ${msg.role.toUpperCase()} • ${msg.timestamp}
              </span>
            </div>
          `)}

          ${this.isTyping.value ? html`
            <div class="message assistantMessage">
              <div class="typing">
                Assistant is thinking
                <div class="typingDot" style="animation-delay: 0s"></div>
                <div class="typingDot" style="animation-delay: 0.2s"></div>
                <div class="typingDot" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="inputArea">
          ${this.selectedAttachments.value.length > 0 ? html`
            <div class="attachmentContainer" style="margin-bottom: 1rem;">
              ${this.selectedAttachments.value.map((at, i) => html`
                <div class="attachment" style="background: ${t.indigo600a}; border-color: ${t.indigo400}">
                  <span>${at.type === 'image' ? '🖼️' : '📄'}</span>
                  ${at.name}
                  <span style="cursor: pointer; margin-left: 0.5rem; opacity: 0.6;" @click="${() => {
                    const next = [...this.selectedAttachments.value];
                    next.splice(i, 1);
                    this.selectedAttachments.value = next;
                  }}">✕</span>
                </div>
              `)}
            </div>
          ` : ''}

          <div class="inputContainer">
            <button class="iconBtn" @click="${() => this.simulateAttachment()}" title="Attach File">
              📎
            </button>
            <textarea 
              class="textArea" 
              placeholder="Type your message..." 
              .value="${this.currentInput.value}"
              @input="${(e: any) => this.handleInput(e)}"
              @keydown="${(e: any) => this.handleKeyDown(e)}"
            ></textarea>
            <button class="sendBtn" @click="${() => this.sendMessage()}">
              Send
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
