 # 🤖 Simple AI Chatbot Widget

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CDN](https://img.shields.io/badge/CDN-Ready-green.svg)](https://cdn.jsdelivr.net/)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-blue.svg)](#)

> **The world's simplest AI chatbot widget** - Add a powerful AI assistant to any website with just one line of code!

## ✨ Why Choose Simple Chatbot?

- **🚀 One-Line Setup** - Literally just copy and paste one script tag
- **🎨 Beautiful Design** - Modern, responsive UI that works everywhere
- **🔧 Zero Configuration** - Smart defaults that work out of the box
- **💡 Auto-Configuration** - Detects your platform and optimizes automatically
- **❤️ User-Friendly** - Helpful error messages and retry logic
- **📱 Mobile Perfect** - Optimized for all devices
- **⚡ Lightning Fast** - Under 50KB, loads instantly

---

## 🚀 Quick Start (30 Seconds)

### Option 1: One-Line Setup (Recommended)
```html
<script src="https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js" 
        data-webhook-url="YOUR_WEBHOOK_URL_HERE"></script>
```

**That's it!** Replace `YOUR_WEBHOOK_URL_HERE` with your webhook URL and you're done.

### Option 2: Interactive Setup Tool
Use our visual setup tool at [`simple-setup.html`](simple-setup.html) to:
- Configure your chatbot visually
- Pick colors and customize messages
- Generate WordPress-ready code
- Test your configuration

### Option 3: Download and Host
1. Download `simple-chatbot.js` and `simple-chatbot.min.js`
2. Upload to your website
3. Add the script tag with your local path

---

## 🎯 Live Examples

- **[One-Line Setup](one-line-setup.html)** - Get started in 30 seconds
- **[Interactive Setup](simple-setup.html)** - Visual configuration tool
- **[Live Demo](demo.html)** - See it in action

---

## ⚙️ Configuration Options

All configuration is done via HTML data attributes:

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-webhook-url` | *Required* | Your AI webhook endpoint |
| `data-bot-name` | "AI Assistant" | Name displayed in chat header |
| `data-welcome-message` | "Hi! How can I help you today?" | First message shown |
| `data-primary-color` | "#3B82F6" | Main color theme |
| `data-position` | "bottom-right" | Widget position (bottom-right, bottom-left) |
| `data-bot-avatar` | *auto-generated* | Custom bot avatar URL (if not set, uses toggle icon for consistency) |
| **Icon Customization** | | |
| `data-toggle-icon` | "default" | Icon type: "default", "emoji", "image", "fontawesome", "custom" |
| `data-toggle-icon-value` | "" | Icon value (emoji, URL, FA class, or SVG) |
| `data-toggle-icon-color` | "" | Custom toggle button color (overrides primary-color) |
| `data-toggle-icon-size` | "24px" | Size of the toggle icon |
| **Behavior** | | |
| `data-auto-open` | "false" | Auto-open chat after delay |
| `data-auto-open-delay` | "10000" | Delay before auto-open (milliseconds) |
| `data-friendly-errors` | "true" | Show user-friendly error messages |
| `data-retry-on-error` | "true" | Enable automatic retry on failures |
| `data-debug-mode` | "false" | Enable debug console logging |

### Example with Custom Configuration
```html
<script src="https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js"
        data-webhook-url="https://your-webhook-url.com"
        data-bot-name="Shopping Assistant"
        data-welcome-message="Hi! Need help finding something?"
        data-primary-color="#10B981"
        data-position="bottom-left"
        data-auto-open="true"></script>
```

## 🎨 Unified Icon System

**NEW:** The bot avatar automatically matches your toggle icon for perfect visual consistency! When you customize the toggle icon, the bot's avatar in chat messages will use the same design, creating a cohesive experience.

- **Default behavior**: Bot avatar mirrors the toggle button icon
- **Custom override**: Set `data-bot-avatar` to use a different image for the bot
- **Consistent colors**: Toggle icon color applies to both button and avatar backgrounds

## 🎨 Icon Customization Examples

### 1. Emoji Toggle Icon (🤖 appears in both toggle button and chat avatar)
```html
<script src="https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js"
        data-webhook-url="YOUR_WEBHOOK_URL"
        data-toggle-icon="emoji"
        data-toggle-icon-value="🤖"
        data-toggle-icon-size="28px"></script>
```

### 2. Custom Image Toggle Icon (same image used for toggle and avatar)
```html
<script src="https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js"
        data-webhook-url="YOUR_WEBHOOK_URL"
        data-toggle-icon="image"
        data-toggle-icon-value="https://your-site.com/chat-icon.png"
        data-toggle-icon-color="#FF6B6B"></script>
```

### 3. FontAwesome Icon (requires FA loaded)
```html
<script src="https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js"
        data-webhook-url="YOUR_WEBHOOK_URL"
        data-toggle-icon="fontawesome"
        data-toggle-icon-value="fas fa-comments"
        data-toggle-icon-color="#8B5CF6"></script>
```

### 4. Custom SVG Icon
```html
<script src="https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js"
        data-webhook-url="YOUR_WEBHOOK_URL"
        data-toggle-icon="custom"
        data-toggle-icon-value='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="white"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2"/></svg>'></script>
```

### 5. Override: Custom Bot Avatar (different from toggle icon)
```html
<script src="https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js"
        data-webhook-url="YOUR_WEBHOOK_URL"
        data-toggle-icon="emoji"
        data-toggle-icon-value="💬"
        data-bot-avatar="https://your-site.com/bot-avatar.jpg"
        data-bot-name="Alex Assistant"></script>
```
*Toggle shows 💬 emoji, but chat messages show the custom avatar image*

---

## 🤝 AI Backend Setup

You'll need a webhook endpoint that receives chat messages and returns AI responses. We recommend **n8n** for the easiest setup:

### Quick n8n Setup (5 minutes)

1. **Create n8n workflow** with a webhook trigger
2. **Add AI node** (OpenAI, Claude, or any LLM)
3. **Return JSON response**:
   ```json
   {
     "response": "Your AI response here"
   }
   ```
4. **Enable CORS** in your n8n settings
5. **Copy webhook URL** to your chatbot

### Expected Webhook Format

**Request (POST):**
```json
{
  "message": "User's message",
  "context": {
    "url": "https://example.com",
    "timestamp": "2024-01-01T12:00:00Z",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response:**
```json
{
  "response": "AI assistant's reply"
}
```

---

## 🎨 Smart Features

### 🧠 Auto-Configuration
The chatbot automatically detects your platform and optimizes settings:

- **WordPress**: Becomes "Website Assistant" with navigation help
- **Shopify**: Becomes "Shopping Assistant" with e-commerce focus
- **Mobile**: Adjusts positioning for better thumb accessibility
- **Desktop**: Enables auto-open features

### 💬 Friendly Error Handling
Instead of technical errors, users see helpful messages:
- "Setup Required" with link to configuration guide
- "Connection Issue" with retry button
- "Service Unavailable" with automatic retry
- Smart retry logic with exponential backoff

### ⚡ Quick Actions
Pre-configured buttons for common questions:
- "How can you help me?"
- "What services do you offer?"
- "I need support"

### 📊 Analytics Integration
Automatic event tracking for:
- Chat opens/closes
- Messages sent
- Errors encountered
- Integrates with Google Analytics if present

---

## 🔧 Advanced Usage

### JavaScript API
```javascript
// Get chatbot instance
const chatbot = window.SimpleChatBot.getInstance();

// Send message programmatically
chatbot.sendMessage("Hello from JavaScript!");

// Open/close chat
chatbot.open();
chatbot.close();

// Destroy chatbot
chatbot.destroy();
```

### Framework Integration

#### React/Next.js
```jsx
import { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js';
    script.setAttribute('data-webhook-url', process.env.NEXT_PUBLIC_WEBHOOK_URL);
    script.setAttribute('data-bot-name', 'My Assistant');
    document.body.appendChild(script);

    return () => script.remove();
  }, []);

  return <>{children}</>;
}
```

#### Vue.js
```vue
<template>
  <div id="app">
    <!-- Your app content -->
  </div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js';
    script.setAttribute('data-webhook-url', process.env.VUE_APP_WEBHOOK_URL);
    document.body.appendChild(script);
  }
}
</script>
```

#### WordPress
Add to your theme's `functions.php`:
```php
function add_simple_chatbot() {
    ?>
    <script src="https://cdn.jsdelivr.net/gh/Stained0bsidian/simple-chatbot@latest/simple-chatbot.min.js"
            data-webhook-url="<?php echo get_option('chatbot_webhook_url'); ?>"
            data-bot-name="<?php echo get_bloginfo('name'); ?> Assistant"></script>
    <?php
}
add_action('wp_footer', 'add_simple_chatbot');
```

---

## 🛠️ Troubleshooting

### Widget Not Appearing?
1. **Check browser console** (F12 → Console) for JavaScript errors
2. **Verify file path** - ensure the script src is correct
3. **Check webhook URL** - must be a valid HTTPS endpoint
4. **CORS settings** - your webhook must allow cross-origin requests

### Connection Issues?
1. **Test webhook directly** using Postman or similar
2. **Check CORS headers** on your webhook response:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type
   ```
3. **Verify HTTPS** - both your site and webhook must use HTTPS

### Getting Errors?
The chatbot shows friendly error messages with action buttons. Click them for:
- **Setup Guide** - Links to configuration help
- **Retry** - Automatically retries failed requests
- **Debug Info** - Enable debug mode for detailed logs

---

## 📦 File Structure

```
simple-chatbot/
├── simple-chatbot.js          # Main source code (development)
├── simple-chatbot.min.js      # Minified for production
├── one-line-setup.html        # Ultra-simple setup page
├── simple-setup.html          # Interactive configuration tool
├── demo.html                  # Live demo and examples
└── README.md                  # This file
```

---

## 🤝 Contributing

We love contributions! Whether it's:
- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements
- 🔧 Code contributions

Feel free to open an issue or submit a pull request.

---

## 📄 License

MIT License - feel free to use this in any project, commercial or personal.

---

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/Stained0bsidian/simple-chatbot/issues)
- **Docs**: Check out our [setup tools](simple-setup.html) and [live demo](demo.html)
- **Quick Start**: Use our [one-line setup](one-line-setup.html)

---

<div align="center">

**Made with ❤️ for developers who value simplicity**

[⭐ Star on GitHub](https://github.com/Stained0bsidian/simple-chatbot) • [🚀 Try Live Demo](demo.html) • [📖 Setup Guide](simple-setup.html)

</div>