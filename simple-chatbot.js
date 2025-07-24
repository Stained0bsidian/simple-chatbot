/**
 * Simple AI Chatbot Widget
 * A lightweight, easy-to-install chatbot that works with any website
 * 
 * Usage:
 * <script src="https://your-cdn.com/simple-chatbot.js" 
 *         data-webhook-url="your-webhook-url"
 *         data-bot-name="Your Bot"
 *         data-primary-color="#3B82F6"></script>
 */

(function() {
    'use strict';

    // Default configuration with better fallbacks
    const DEFAULT_CONFIG = {
        webhookUrl: '',
        botName: 'AI Assistant',
        welcomeMessage: 'Hi! How can I help you today?',
        primaryColor: '#3B82F6',
        position: 'bottom-right',
        botAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMzQjgyRjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMSAxNVY5QzIxIDcuMzQzMTUgMTkuNjU2OSA2IDE4IDZIMTJWNEMxMiAyLjg5NTQzIDExLjEwNDYgMiAxMCAySDhDNi44OTU0MyAyIDYgMi44OTU0MyA2IDRWNkg0QzIuMzQzMTUgNiAxIDcuMzQzMTUgMSA5VjE1QzEgMTYuNjU2OSAyLjM0MzE1IDE4IDQgMThINlYyMEM2IDIxLjEwNDYgNi44OTU0MyAyMiA4IDIySDE2QzE3LjEwNDYgMjIgMTggMjEuMTA0NiAxOCAyMFYxOEgyMUMyMS42NTY5IDE4IDIyIDE3LjY1NjkgMjIgMTdWMTVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+',
        // New user-friendly options
        autoOpen: false,           // Auto-open chat after delay
        autoOpenDelay: 10000,      // 10 seconds
        showTypingIndicator: true,
        retryOnError: true,
        maxRetries: 3,
        friendlyErrors: true,
        debugMode: false
    };

    // Friendly error messages
    const FRIENDLY_ERRORS = {
        'webhook_not_configured': {
            title: '🔧 Setup Required',
            message: 'Your chatbot needs to be connected to an AI service. Please check your configuration.',
            action: 'Check Setup Guide'
        },
        'network_error': {
            title: '🌐 Connection Issue',
            message: 'Having trouble connecting right now. Please check your internet connection and try again.',
            action: 'Retry'
        },
        'webhook_error': {
            title: '⚠️ Service Unavailable',
            message: 'Our chat service is temporarily unavailable. Please try again in a moment.',
            action: 'Try Again'
        },
        'timeout_error': {
            title: '⏱️ Taking Too Long',
            message: 'The response is taking longer than usual. Would you like to try again?',
            action: 'Retry'
        }
    };

    // Auto-detect best configuration based on environment
    function detectEnvironment() {
        const env = {
            isMobile: window.innerWidth <= 768,
            isWordPress: !!window.wp,
            isShopify: !!window.Shopify,
            hasAnalytics: !!(window.gtag || window.ga || window._gaq),
            domain: window.location.hostname
        };
        
        return env;
    }

    // Auto-configure based on detected environment
    function getEnvironmentDefaults(env) {
        const defaults = { ...DEFAULT_CONFIG };
        
        // Mobile optimizations
        if (env.isMobile) {
            defaults.position = 'bottom-right'; // Better for thumbs
        }
        
        // WordPress defaults
        if (env.isWordPress) {
            defaults.botName = 'Website Assistant';
            defaults.welcomeMessage = 'Hi! I\'m here to help you navigate our website. What can I help you find?';
        }
        
        // E-commerce defaults
        if (env.isShopify) {
            defaults.botName = 'Shopping Assistant';
            defaults.welcomeMessage = 'Hi! I can help you find products, track orders, or answer questions about our store.';
            defaults.primaryColor = '#96bf48'; // Shopify green
        }
        
        return defaults;
    }

    // CSS styles as a string with better responsive design
    const CSS_STYLES = `
        .simple-chatbot {
            position: fixed;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            --primary-color: #3B82F6;
        }
        
        .simple-chatbot.bottom-right { bottom: 20px; right: 20px; }
        .simple-chatbot.bottom-left { bottom: 20px; left: 20px; }
        .simple-chatbot.top-right { top: 20px; right: 20px; }
        .simple-chatbot.top-left { top: 20px; left: 20px; }
        
        .simple-chatbot-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--primary-color);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .simple-chatbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0,0,0,0.2);
        }
        
        .simple-chatbot-toggle.pulse {
            animation: chatbotPulse 2s infinite;
        }
        
        @keyframes chatbotPulse {
            0% { box-shadow: 0 4px 20px rgba(0,0,0,0.15), 0 0 0 0 var(--primary-color); }
            50% { box-shadow: 0 6px 25px rgba(0,0,0,0.2), 0 0 0 10px rgba(59, 130, 246, 0.3); }
            100% { box-shadow: 0 4px 20px rgba(0,0,0,0.15), 0 0 0 0 var(--primary-color); }
        }
        
        .simple-chatbot-toggle svg {
            width: 24px;
            height: 24px;
            fill: white;
        }
        
        .simple-chatbot-status {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 14px;
            height: 14px;
            background: #10b981;
            border: 3px solid white;
            border-radius: 50%;
        }
        
        .simple-chatbot-window {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            opacity: 0;
            transform: scale(0.8) translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .simple-chatbot-window.open {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        
        .simple-chatbot.bottom-left .simple-chatbot-window,
        .simple-chatbot.top-left .simple-chatbot-window {
            right: auto;
            left: 0;
        }
        
        .simple-chatbot.top-right .simple-chatbot-window,
        .simple-chatbot.top-left .simple-chatbot-window {
            bottom: auto;
            top: 70px;
        }
        
        .simple-chatbot-header {
            background: var(--primary-color);
            color: white;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .simple-chatbot-bot-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .simple-chatbot-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .simple-chatbot-avatar img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        
        .simple-chatbot-details h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .simple-chatbot-details p {
            margin: 0;
            font-size: 12px;
            opacity: 0.8;
        }
        
        .simple-chatbot-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        
        .simple-chatbot-close:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .simple-chatbot-close svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
        
        .simple-chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .simple-chatbot-message {
            display: flex;
            gap: 8px;
            align-items: flex-start;
            animation: messageSlide 0.3s ease-out;
        }
        
        .simple-chatbot-message.user {
            flex-direction: row-reverse;
            align-self: flex-end;
        }
        
        .simple-chatbot-message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        
        .simple-chatbot-message-content {
            max-width: 80%;
        }
        
        .simple-chatbot-message-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
        }
        
        .simple-chatbot-message.bot .simple-chatbot-message-bubble {
            background: #f3f4f6;
            color: #374151;
        }
        
        .simple-chatbot-message.user .simple-chatbot-message-bubble {
            background: var(--primary-color);
            color: white;
        }
        
        .simple-chatbot-message.error .simple-chatbot-message-bubble {
            background: #fee2e2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }
        
        .simple-chatbot-error-actions {
            margin-top: 8px;
            display: flex;
            gap: 8px;
        }
        
        .simple-chatbot-error-btn {
            background: #dc2626;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .simple-chatbot-error-btn:hover {
            background: #b91c1c;
        }
        
        .simple-chatbot-message-time {
            font-size: 11px;
            color: #9ca3af;
            margin-top: 4px;
            text-align: center;
        }
        
        .simple-chatbot-typing {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: #f3f4f6;
            border-radius: 18px;
            font-size: 14px;
            color: #6b7280;
        }
        
        .simple-chatbot-typing-dots {
            display: flex;
            gap: 3px;
        }
        
        .simple-chatbot-typing-dot {
            width: 8px;
            height: 8px;
            background: #9ca3af;
            border-radius: 50%;
            animation: typingPulse 1.4s infinite ease-in-out;
        }
        
        .simple-chatbot-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .simple-chatbot-typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        .simple-chatbot-input-area {
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            background: #f9fafb;
        }
        
        .simple-chatbot-input-form {
            display: flex;
            gap: 8px;
        }
        
        .simple-chatbot-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 24px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        
        .simple-chatbot-input:focus {
            border-color: var(--primary-color);
        }
        
        .simple-chatbot-input::placeholder {
            color: #9ca3af;
        }
        
        .simple-chatbot-send {
            width: 48px;
            height: 48px;
            background: var(--primary-color);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .simple-chatbot-send:hover:not(:disabled) {
            transform: scale(1.1);
        }
        
        .simple-chatbot-send:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .simple-chatbot-send svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
        
        /* Quick action buttons */
        .simple-chatbot-quick-actions {
            padding: 8px 16px;
            display: flex;
            gap: 8px;
            overflow-x: auto;
        }
        
        .simple-chatbot-quick-action {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            color: #374151;
            padding: 8px 12px;
            border-radius: 16px;
            font-size: 12px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
        }
        
        .simple-chatbot-quick-action:hover {
            background: #e5e7eb;
        }
        
        @keyframes messageSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes typingPulse {
            0%, 60%, 100% { transform: scale(1); opacity: 0.5; }
            30% { transform: scale(1.2); opacity: 1; }
        }
        
        @media (max-width: 480px) {
            .simple-chatbot-window {
                position: fixed !important;
                top: 10px !important;
                left: 10px !important;
                right: 10px !important;
                bottom: 10px !important;
                width: auto !important;
                height: auto !important;
                border-radius: 8px !important;
            }
            
            .simple-chatbot-toggle {
                width: 56px;
                height: 56px;
            }
            
            .simple-chatbot-toggle svg {
                width: 22px;
                height: 22px;
            }
        }
    `;

    class SimpleChatBot {
        constructor(config) {
            this.env = detectEnvironment();
            this.config = { 
                ...getEnvironmentDefaults(this.env), 
                ...config 
            };
            this.isOpen = false;
            this.messages = [];
            this.isLoading = false;
            this.retryCount = 0;
            this.quickActions = [
                'How can you help me?',
                'Tell me about your services',
                'Contact information'
            ];
            
            // Add welcome message
            this.messages.push({
                id: 'welcome',
                text: this.config.welcomeMessage,
                isUser: false,
                timestamp: new Date()
            });
            
            this.init();
        }

        init() {
            // Validate configuration
            if (!this.validateConfig()) {
                return;
            }
            
            this.injectStyles();
            this.createWidget();
            this.attachEventListeners();
            this.setupAutoOpen();
            this.trackEvents();
        }

        validateConfig() {
            if (!this.config.webhookUrl) {
                if (this.config.debugMode) {
                    console.error('SimpleChatBot: data-webhook-url is required');
                }
                
                if (this.config.friendlyErrors) {
                    this.showSetupHelper();
                }
                return false;
            }
            
            // Validate webhook URL format
            try {
                new URL(this.config.webhookUrl);
            } catch {
                if (this.config.debugMode) {
                    console.error('SimpleChatBot: Invalid webhook URL format');
                }
                return false;
            }
            
            return true;
        }

        showSetupHelper() {
            // Create a helpful setup overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fee2e2;
                border: 1px solid #fecaca;
                color: #dc2626;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                max-width: 300px;
                font-size: 14px;
            `;
            
            overlay.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 8px;">🔧 Chatbot Setup Required</div>
                <div style="margin-bottom: 12px;">Your chatbot needs a webhook URL to connect to an AI service.</div>
                <button onclick="window.open('simple-setup.html', '_blank')" style="
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-right: 8px;
                ">Quick Setup</button>
                <button onclick="this.parentElement.remove()" style="
                    background: transparent;
                    color: #dc2626;
                    border: 1px solid #dc2626;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                ">Close</button>
            `;
            
            document.body.appendChild(overlay);
            
            // Auto-remove after 30 seconds
            setTimeout(() => {
                if (overlay.parentElement) {
                    overlay.remove();
                }
            }, 30000);
        }

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = CSS_STYLES.replace(/var\(--primary-color\)/g, this.config.primaryColor);
            document.head.appendChild(style);
        }

        createWidget() {
            const widget = document.createElement('div');
            widget.className = `simple-chatbot ${this.config.position}`;
            widget.innerHTML = this.getWidgetHTML();
            document.body.appendChild(widget);
            
            this.widget = widget;
            this.chatWindow = widget.querySelector('.simple-chatbot-window');
            this.messagesContainer = widget.querySelector('.simple-chatbot-messages');
            this.inputElement = widget.querySelector('.simple-chatbot-input');
            this.sendButton = widget.querySelector('.simple-chatbot-send');
            this.toggleButton = widget.querySelector('.simple-chatbot-toggle');
            
            this.renderMessages();
            this.renderQuickActions();
        }

        getWidgetHTML() {
            return `
                <button class="simple-chatbot-toggle" style="--primary-color: ${this.config.primaryColor}">
                    <svg viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                    <div class="simple-chatbot-status"></div>
                </button>

                <div class="simple-chatbot-window" style="--primary-color: ${this.config.primaryColor}">
                    <div class="simple-chatbot-header">
                        <div class="simple-chatbot-bot-info">
                            <div class="simple-chatbot-avatar">
                                <img src="${this.config.botAvatar}" alt="${this.config.botName}" onerror="this.style.display='none'">
                            </div>
                            <div class="simple-chatbot-details">
                                <h3>${this.config.botName}</h3>
                                <p>Online</p>
                            </div>
                        </div>
                        <button class="simple-chatbot-close">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="simple-chatbot-messages"></div>
                    <div class="simple-chatbot-quick-actions"></div>
                    
                    <div class="simple-chatbot-input-area">
                        <form class="simple-chatbot-input-form">
                            <input type="text" class="simple-chatbot-input" placeholder="Type your message..." autocomplete="off">
                            <button type="submit" class="simple-chatbot-send">
                                <svg viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            `;
        }

        renderQuickActions() {
            const container = this.widget.querySelector('.simple-chatbot-quick-actions');
            if (!container || this.messages.length > 1) return; // Only show on first load
            
            container.innerHTML = this.quickActions.map(action => 
                `<button class="simple-chatbot-quick-action" onclick="this.closest('.simple-chatbot').chatBot.sendQuickAction('${action}')">${action}</button>`
            ).join('');
            
            // Store reference for quick actions
            this.widget.chatBot = this;
        }

        sendQuickAction(message) {
            this.inputElement.value = message;
            this.handleSubmit(new Event('submit'));
            
            // Hide quick actions after first use
            const container = this.widget.querySelector('.simple-chatbot-quick-actions');
            if (container) {
                container.style.display = 'none';
            }
        }

        setupAutoOpen() {
            if (this.config.autoOpen && this.env.isMobile === false) {
                setTimeout(() => {
                    if (!this.isOpen) {
                        this.toggleButton.classList.add('pulse');
                        
                        // Auto-open after additional delay if user hasn't interacted
                        setTimeout(() => {
                            if (!this.isOpen) {
                                this.open();
                            }
                        }, 5000);
                    }
                }, this.config.autoOpenDelay);
            }
        }

        attachEventListeners() {
            const toggle = this.widget.querySelector('.simple-chatbot-toggle');
            const close = this.widget.querySelector('.simple-chatbot-close');
            const form = this.widget.querySelector('.simple-chatbot-input-form');

            toggle.addEventListener('click', () => this.toggle());
            close.addEventListener('click', () => this.close());
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Enhanced keyboard support
            this.inputElement.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.close();
                }
            });
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.isOpen = true;
            this.chatWindow.style.display = 'flex';
            this.toggleButton.style.display = 'none';
            this.toggleButton.classList.remove('pulse');
            
            // Smooth animation
            setTimeout(() => {
                this.chatWindow.classList.add('open');
                this.inputElement.focus();
            }, 10);
            
            this.trackEvent('chatbot_opened');
        }

        close() {
            this.isOpen = false;
            this.chatWindow.classList.remove('open');
            
            setTimeout(() => {
                this.chatWindow.style.display = 'none';
                this.toggleButton.style.display = 'flex';
            }, 300);
            
            this.trackEvent('chatbot_closed');
        }

        async handleSubmit(e) {
            e.preventDefault();
            const message = this.inputElement.value.trim();
            if (!message || this.isLoading) return;

            this.addMessage({
                id: Date.now().toString(),
                text: message,
                isUser: true,
                timestamp: new Date()
            });

            this.inputElement.value = '';
            this.setLoading(true);
            this.retryCount = 0;

            await this.sendMessageWithRetry(message);
        }

        async sendMessageWithRetry(message) {
            try {
                const response = await this.sendToWebhook(message);
                this.addMessage({
                    id: (Date.now() + 1).toString(),
                    text: response.text,
                    isUser: false,
                    timestamp: new Date(),
                    isError: response.isError
                });
                
                this.retryCount = 0; // Reset on success
            } catch (error) {
                if (this.config.retryOnError && this.retryCount < this.config.maxRetries) {
                    this.retryCount++;
                    
                    // Show retry message
                    this.addMessage({
                        id: (Date.now() + 1).toString(),
                        text: `Connection issue. Retrying... (${this.retryCount}/${this.config.maxRetries})`,
                        isUser: false,
                        timestamp: new Date(),
                        isError: true,
                        isRetrying: true
                    });
                    
                    // Retry after delay
                    setTimeout(() => {
                        this.sendMessageWithRetry(message);
                    }, 2000 * this.retryCount);
                    
                    return;
                }
                
                // Show friendly error
                this.addFriendlyError(error);
            }

            this.setLoading(false);
        }

        addFriendlyError(error) {
            let errorType = 'network_error';
            
            if (error.message.includes('webhook')) {
                errorType = 'webhook_error';
            } else if (error.message.includes('timeout')) {
                errorType = 'timeout_error';
            }
            
            const friendlyError = FRIENDLY_ERRORS[errorType];
            
            this.addMessage({
                id: (Date.now() + 1).toString(),
                text: friendlyError.message,
                isUser: false,
                timestamp: new Date(),
                isError: true,
                errorType: errorType,
                actionText: friendlyError.action
            });
        }

        async sendToWebhook(message) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            try {
                const response = await fetch(this.config.webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({
                        message: message,
                        question: message,
                        text: message,
                        // Add context
                        context: {
                            url: window.location.href,
                            timestamp: new Date().toISOString(),
                            userAgent: navigator.userAgent.substring(0, 100) // Truncated for privacy
                        }
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.text();
                let parsedData;
                
                try {
                    parsedData = JSON.parse(data);
                } catch {
                    parsedData = data;
                }

                const botText = this.extractBotText(parsedData);
                this.trackEvent('message_sent', { success: true });
                return { text: botText, isError: false };

            } catch (error) {
                clearTimeout(timeoutId);
                
                if (this.config.debugMode) {
                    console.error('Chatbot error:', error);
                }
                
                this.trackEvent('message_sent', { success: false, error: error.message });
                
                if (error.name === 'AbortError') {
                    throw new Error('timeout');
                }
                
                throw error;
            }
        }

        extractBotText(raw) {
            if (raw && typeof raw === 'object') {
                return raw.output || raw.answer || raw.response || raw.text || raw.message || JSON.stringify(raw);
            }
            return typeof raw === 'string' ? raw : 'I\'m not sure how to respond to that.';
        }

        addMessage(message) {
            this.messages.push(message);
            this.renderMessages();
            this.scrollToBottom();
        }

        renderMessages() {
            const messagesHTML = this.messages.map(msg => this.getMessageHTML(msg)).join('');
            const typingHTML = this.isLoading ? this.getTypingHTML() : '';
            this.messagesContainer.innerHTML = messagesHTML + typingHTML;
        }

        getMessageHTML(message) {
            const className = message.isUser ? 'user' : (message.isError ? 'error' : 'bot');
            const avatar = message.isUser ? '' : `<img src="${this.config.botAvatar}" alt="${this.config.botName}" class="simple-chatbot-message-avatar">`;
            
            let actionButtons = '';
            if (message.isError && message.actionText && !message.isRetrying) {
                actionButtons = `
                    <div class="simple-chatbot-error-actions">
                        <button class="simple-chatbot-error-btn" onclick="this.closest('.simple-chatbot').chatBot.handleErrorAction('${message.errorType}')">
                            ${message.actionText}
                        </button>
                    </div>
                `;
            }
            
            return `
                <div class="simple-chatbot-message ${className}">
                    ${avatar}
                    <div class="simple-chatbot-message-content">
                        <div class="simple-chatbot-message-bubble">${message.text}</div>
                        ${actionButtons}
                        <div class="simple-chatbot-message-time">${this.formatTime(message.timestamp)}</div>
                    </div>
                </div>
            `;
        }

        handleErrorAction(errorType) {
            switch (errorType) {
                case 'webhook_not_configured':
                    window.open('simple-setup.html', '_blank');
                    break;
                case 'network_error':
                case 'webhook_error':
                case 'timeout_error':
                    // Retry last message
                    const lastUserMessage = this.messages.filter(m => m.isUser).pop();
                    if (lastUserMessage) {
                        this.sendMessageWithRetry(lastUserMessage.text);
                    }
                    break;
            }
        }

        getTypingHTML() {
            return `
                <div class="simple-chatbot-message bot">
                    <img src="${this.config.botAvatar}" alt="${this.config.botName}" class="simple-chatbot-message-avatar">
                    <div class="simple-chatbot-message-content">
                        <div class="simple-chatbot-typing">
                            <div class="simple-chatbot-typing-dots">
                                <div class="simple-chatbot-typing-dot"></div>
                                <div class="simple-chatbot-typing-dot"></div>
                                <div class="simple-chatbot-typing-dot"></div>
                            </div>
                            <span>${this.config.botName} is typing...</span>
                        </div>
                    </div>
                </div>
            `;
        }

        setLoading(loading) {
            this.isLoading = loading;
            this.sendButton.disabled = loading;
            this.inputElement.disabled = loading;
            this.renderMessages();
        }

        formatTime(date) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        scrollToBottom() {
            setTimeout(() => {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }, 100);
        }

        trackEvent(eventName, data = {}) {
            // Google Analytics integration
            if (typeof gtag === 'function') {
                gtag('event', eventName, {
                    event_category: 'Chatbot',
                    ...data
                });
            }
            
            // Custom event for developers
            window.dispatchEvent(new CustomEvent(`chatbot:${eventName}`, {
                detail: { ...data, timestamp: new Date() }
            }));
            
            if (this.config.debugMode) {
                console.log(`Chatbot Event: ${eventName}`, data);
            }
        }

        // Public API methods
        destroy() {
            if (this.widget && this.widget.parentElement) {
                this.widget.remove();
            }
        }

        sendMessage(text) {
            this.inputElement.value = text;
            this.handleSubmit(new Event('submit'));
        }
    }

    // Auto-initialize from script tag data attributes with better error handling
    function autoInit() {
        const script = document.currentScript;
        if (!script) return;

        const config = {
            webhookUrl: script.getAttribute('data-webhook-url') || '',
            botName: script.getAttribute('data-bot-name') || DEFAULT_CONFIG.botName,
            welcomeMessage: script.getAttribute('data-welcome-message') || DEFAULT_CONFIG.welcomeMessage,
            primaryColor: script.getAttribute('data-primary-color') || DEFAULT_CONFIG.primaryColor,
            position: script.getAttribute('data-position') || DEFAULT_CONFIG.position,
            botAvatar: script.getAttribute('data-bot-avatar') || DEFAULT_CONFIG.botAvatar,
            autoOpen: script.getAttribute('data-auto-open') === 'true',
            debugMode: script.getAttribute('data-debug') === 'true'
        };

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                try {
                    new SimpleChatBot(config);
                } catch (error) {
                    if (config.debugMode) {
                        console.error('SimpleChatBot initialization failed:', error);
                    }
                }
            });
        } else {
            try {
                new SimpleChatBot(config);
            } catch (error) {
                if (config.debugMode) {
                    console.error('SimpleChatBot initialization failed:', error);
                }
            }
        }
    }

    // Export for manual initialization
    window.SimpleChatBot = SimpleChatBot;

    // Auto-initialize
    autoInit();

})(); 