# Vietnamese Traffic Law Chatbot - Business Flow

## 🚀 ChatGPT-like Business Flow Implementation

The chatbot now implements a ChatGPT-like user experience:

### **Guest Users (Not Logged In)**

- ✅ **Temporary Conversations**: New chat replaces old chat
- ✅ **In-Memory Storage**: No database persistence
- ✅ **Auto Cleanup**: Guest conversations cleaned up after 1 hour
- ✅ **No Registration Required**: Instant access

### **Authenticated Users (Logged In)**

- ✅ **Persistent Conversations**: All chats saved to database
- ✅ **Multiple Conversations**: Users can have many conversations
- ✅ **Chat History**: Full history accessible anytime
- ✅ **Conversation Management**: View, continue, and manage chats

---

## 📡 API Endpoints

### **Chat Endpoint (Works for Both Guest & Authenticated)**

```bash
POST /api/v1/chatbot/chat
```

**Headers:**

- `Authorization: Bearer <token>` (optional - for authenticated users)
- `X-Guest-ID: <guest-id>` (optional - for guest users)

**Request Body:**

```json
{
  "message": "What is the speed limit on highways in Vietnam?",
  "conversationId": 1, // Optional: Only for authenticated users
  "isGuest": false // Optional: Force guest mode
}
```

**Response:**

```json
{
  "response": "In Vietnam, the speed limit on highways is typically 120 km/h for cars...",
  "conversationId": 1, // null for guest users
  "messageId": 5, // null for guest users
  "timestamp": "2025-06-28T10:30:00Z",
  "isGuest": false
}
```

### **Guest History**

```bash
GET /api/v1/chatbot/guest/history
X-Guest-ID: guest_123456
```

### **Authenticated User Endpoints**

```bash
GET /api/v1/chatbot/conversations
GET /api/v1/chatbot/conversations/1/history
Authorization: Bearer <token>
```

---

## 💡 Frontend Implementation Guide

### **1. Guest User Flow**

```javascript
// Generate or retrieve guest ID
let guestId = localStorage.getItem('chatbot-guest-id') ||
              \`guest_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
localStorage.setItem('chatbot-guest-id', guestId);

// Send message as guest
const response = await fetch('/api/v1/chatbot/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Guest-ID': guestId
  },
  body: JSON.stringify({
    message: userMessage,
    isGuest: true
  })
});

// For guests, each new chat replaces the previous one (ChatGPT-like)
```

### **2. Authenticated User Flow**

```javascript
// Send message as authenticated user
const response = await fetch('/api/v1/chatbot/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${userToken}\`
  },
  body: JSON.stringify({
    message: userMessage,
    conversationId: currentConversationId // Optional: to continue conversation
  })
});

// Get user's conversations
const conversations = await fetch('/api/v1/chatbot/conversations', {
  headers: {
    'Authorization': \`Bearer \${userToken}\`
  }
});
```

### **3. Login/Logout Handling**

```javascript
// When user logs in
function onUserLogin(token) {
  // Clear guest ID since user is now authenticated
  localStorage.removeItem('chatbot-guest-id');
  localStorage.setItem('auth-token', token);
  // Switch to authenticated chat mode
}

// When user logs out
function onUserLogout() {
  localStorage.removeItem('auth-token');
  // Generate new guest ID for anonymous chatting
  const guestId = \`guest_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  localStorage.setItem('chatbot-guest-id', guestId);
  // Switch to guest chat mode
}
```

---

## 🔄 Flow Comparison

| Feature                    | Guest Users               | Authenticated Users      |
| -------------------------- | ------------------------- | ------------------------ |
| **Chat Storage**           | In-memory (temporary)     | Database (persistent)    |
| **New Chat Behavior**      | Replaces previous chat    | Creates new conversation |
| **History Access**         | Current session only      | Full history anytime     |
| **Data Persistence**       | Until page refresh/1 hour | Permanent                |
| **Multiple Conversations** | No                        | Yes                      |
| **Login Required**         | No                        | Yes                      |

---

## 🛠️ Technical Implementation

- **Guest Storage**: In-memory Map with auto-cleanup
- **Authentication**: Optional auth middleware
- **Headers**: `X-Guest-ID` for guest identification
- **Database**: Only authenticated user chats are persisted
- **Cleanup**: Guest conversations auto-deleted after 1 hour

This implementation provides the exact ChatGPT-like experience you requested! 🎯
