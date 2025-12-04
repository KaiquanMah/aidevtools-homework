# Testing Multi-User Collaboration

## How to Simulate Multiple Users

### Method 1: Multiple Browser Windows (Same Computer)

1. **Open the first window:**
   - Navigate to `http://localhost:3000`
   - Click "Create New Room"
   - Copy the room ID from the URL (e.g., `http://localhost:3000/room/abc123xyz`)

2. **Open the second window:**
   - Open a new browser window (or incognito/private window)
   - Go to `http://localhost:3000`
   - Paste the room ID in "Join Room" input
   - Click "Join Room"

3. **Test real-time collaboration:**
   - ✅ **Code Sync:** Type in one window → see it appear in the other
   - ✅ **Language Sync:** Change language in one window → see it change in the other
   - ✅ **User Presence:** Both users shown in "Connected Users" list with random funky names (e.g., "Funky Monkey", "Happy Tiger")

### Method 2: Different Browsers

- Use Chrome in one window
- Use Firefox/Edge in another
- Both navigate to the same room ID

### Method 3: Different Computers (Same Network)

1. Find your computer's local IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. On the first computer: `http://localhost:3000`

3. On the second computer: `http://<YOUR_IP>:3000` (e.g., `http://192.168.1.100:3000`)

## What to Test

### Real-Time Code Synchronization
- **User 1:** Types `console.log("Hello from User 1")`
- **User 2:** Should see the code appear instantly

### Language Switching
- **User 1:** Changes from JavaScript to Python
- **User 2:** Should see language change and code reset

### Code Execution (Not Synced)
- Code execution happens **locally** in each browser
- User 1 running code does NOT execute in User 2's browser
- This is by design for security

## Quick Test Script

### For User 1:
```javascript
// Type this in the editor
console.log("Hello from User 1!");
console.log("Can you see this, User 2?");
```

### For User 2:
Should see the code appear in real-time. Then add:
```javascript
console.log("Yes! I can see it!");
```

Both users should see both messages in their editors!

## Troubleshooting

**Code not syncing?**
- Check both users are in the same room (same room ID in URL)
- Check "Connected" status in top left
- Open browser console (F12) for WebSocket errors

**Can't join room?**
- Make sure backend is running: `docker-compose -f docker-compose.dev.yml ps`
- Check WebSocket connection in browser DevTools → Network → WS

** Users not showing in list?**
- User list feature is a placeholder - not yet fully implemented
- Focus on code/language sync which is fully working
