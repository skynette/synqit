/**
 * Messaging System Test Suite
 * 
 * This comprehensive test suite validates all messaging functionality:
 * - Partnership-based messaging
 * - Direct messaging between users
 * - Message retrieval and pagination
 * - Conversation management
 * - Message status tracking (read/unread)
 * - Message search functionality
 * 
 * Usage: node test-messaging.js
 */

const fetch = require('node-fetch');
const readline = require('readline');

const API_BASE = 'http://localhost:5000/api';
let authToken = null;

// Console colors for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Helper function to make authenticated API requests
async function apiRequest(endpoint, method = 'GET', body = null, token = authToken) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    return {
      status: response.status,
      success: response.ok,
      data: data
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      data: { message: error.message }
    };
  }
}

// Test authentication
async function testAuth() {
  log('\n🔐 Testing Authentication...', 'cyan');
  
  // Try to login with existing user
  const loginData = {
    email: 'test@example.com',
    password: 'password123'
  };

  const response = await apiRequest('/auth/login', 'POST', loginData);
  
  if (response.success && response.data.token) {
    authToken = response.data.token;
    logSuccess('Authentication successful');
    logInfo(`Token: ${authToken.substring(0, 20)}...`);
    return true;
  } else {
    logWarning('Login failed, trying registration...');
    
    // Try to register
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    };

    const regResponse = await apiRequest('/auth/register', 'POST', registerData);
    
    if (regResponse.success && regResponse.data.token) {
      authToken = regResponse.data.token;
      logSuccess('Registration and authentication successful');
      return true;
    } else {
      logError('Authentication failed completely');
      console.log(regResponse.data);
      return false;
    }
  }
}

// Test partnership-based messaging
async function testPartnershipMessaging() {
  log('\n💬 Testing Partnership Messaging...', 'cyan');
  
  // First, check if we have any partnerships
  const partnershipsResponse = await apiRequest('/matches/partnerships');
  
  if (!partnershipsResponse.success) {
    logWarning('Could not fetch partnerships');
    return false;
  }

  const partnerships = partnershipsResponse.data.data || [];
  
  if (partnerships.length === 0) {
    logWarning('No partnerships found - skipping partnership messaging tests');
    return true;
  }

  const partnership = partnerships[0];
  logInfo(`Testing with partnership: ${partnership.id} - ${partnership.title}`);

  // Test sending a message
  const messageData = {
    partnershipId: partnership.id,
    content: 'Hello! This is a test message from the messaging system.',
    messageType: 'TEXT'
  };

  const sendResponse = await apiRequest('/messages/send', 'POST', messageData);
  
  if (sendResponse.success) {
    logSuccess('Partnership message sent successfully');
    
    // Test retrieving messages for this partnership
    const getResponse = await apiRequest(`/messages/partnerships/${partnership.id}?limit=10`);
    
    if (getResponse.success) {
      const messages = getResponse.data.data.messages || [];
      logSuccess(`Retrieved ${messages.length} messages for partnership`);
      
      if (messages.length > 0) {
        logInfo(`Latest message: "${messages[messages.length - 1].content}"`);
      }
      
      // Test marking messages as read
      const markReadData = {
        partnershipId: partnership.id
      };
      
      const markReadResponse = await apiRequest('/messages/mark-read', 'POST', markReadData);
      
      if (markReadResponse.success) {
        logSuccess('Messages marked as read successfully');
      } else {
        logError('Failed to mark messages as read');
      }
      
    } else {
      logError('Failed to retrieve partnership messages');
    }
    
  } else {
    logError('Failed to send partnership message');
    console.log(sendResponse.data);
  }

  return true;
}

// Test direct messaging
async function testDirectMessaging() {
  log('\n📧 Testing Direct Messaging...', 'cyan');
  
  // For testing, we'll need another user ID
  // This is a simplified test - in a real scenario, you'd have multiple users
  logInfo('Creating a second user for direct messaging test...');
  
  // Register second user
  const user2Data = {
    firstName: 'Test2',
    lastName: 'User2',
    email: 'test2@example.com',
    password: 'password123'
  };

  const reg2Response = await apiRequest('/auth/register', 'POST', user2Data);
  
  if (reg2Response.success && reg2Response.data.token) {
    const user2Token = reg2Response.data.token;
    const user2Id = reg2Response.data.user.id;
    
    logSuccess('Second user created successfully');
    logInfo(`User2 ID: ${user2Id}`);

    // Test sending direct message from user1 to user2
    const directMessageData = {
      receiverId: user2Id,
      content: 'Hello! This is a direct message test.',
      messageType: 'TEXT'
    };

    const sendDirectResponse = await apiRequest('/messages/direct', 'POST', directMessageData);
    
    if (sendDirectResponse.success) {
      logSuccess('Direct message sent successfully');
      
      // Test retrieving direct messages (as user2)
      const currentUserId = reg2Response.data.user.id; // This would be user1's ID in real scenario
      const getDirectResponse = await apiRequest(`/messages/direct/${user2Id}?limit=10`);
      
      if (getDirectResponse.success) {
        const messages = getDirectResponse.data.data.messages || [];
        logSuccess(`Retrieved ${messages.length} direct messages`);
        
        if (messages.length > 0) {
          logInfo(`Direct message content: "${messages[messages.length - 1].content}"`);
        }
      } else {
        logError('Failed to retrieve direct messages');
        console.log(getDirectResponse.data);
      }
      
    } else {
      logError('Failed to send direct message');
      console.log(sendDirectResponse.data);
    }
    
  } else {
    logWarning('Could not create second user for direct messaging test');
    logInfo('Skipping direct messaging test');
  }

  return true;
}

// Test conversation management
async function testConversations() {
  log('\n📋 Testing Conversations...', 'cyan');
  
  const conversationsResponse = await apiRequest('/messages/conversations?limit=10');
  
  if (conversationsResponse.success) {
    const conversations = conversationsResponse.data.data.conversations || [];
    logSuccess(`Retrieved ${conversations.length} conversations`);
    
    conversations.forEach((conv, index) => {
      logInfo(`Conversation ${index + 1}: ${conv.title} (Status: ${conv.status})`);
      if (conv.lastMessage) {
        logInfo(`  Last message: "${conv.lastMessage.content}"`);
      }
      if (conv.unreadCount > 0) {
        logInfo(`  Unread messages: ${conv.unreadCount}`);
      }
    });
    
  } else {
    logError('Failed to retrieve conversations');
    console.log(conversationsResponse.data);
  }

  return true;
}

// Test unread message count
async function testUnreadCount() {
  log('\n🔢 Testing Unread Message Count...', 'cyan');
  
  const unreadResponse = await apiRequest('/messages/unread-count');
  
  if (unreadResponse.success) {
    const unreadCount = unreadResponse.data.data.unreadCount;
    logSuccess(`Unread message count: ${unreadCount}`);
  } else {
    logError('Failed to get unread message count');
  }

  return true;
}

// Test message search
async function testMessageSearch() {
  log('\n🔍 Testing Message Search...', 'cyan');
  
  const searchResponse = await apiRequest('/messages/search?q=test&limit=5');
  
  if (searchResponse.success) {
    const messages = searchResponse.data.data.messages || [];
    logSuccess(`Found ${messages.length} messages containing "test"`);
    
    messages.forEach((msg, index) => {
      logInfo(`Result ${index + 1}: "${msg.content}" (from ${msg.sender.firstName})`);
    });
    
  } else {
    logError('Failed to search messages');
    console.log(searchResponse.data);
  }

  return true;
}

// Test message statistics
async function testMessageStats() {
  log('\n📊 Testing Message Statistics...', 'cyan');
  
  const statsResponse = await apiRequest('/messages/stats');
  
  if (statsResponse.success) {
    const stats = statsResponse.data.data;
    logSuccess('Message statistics retrieved successfully');
    logInfo(`Messages sent: ${stats.messagesSent}`);
    logInfo(`Messages received: ${stats.messagesReceived}`);
    logInfo(`Unread messages: ${stats.unreadMessages}`);
    logInfo(`Active conversations: ${stats.activeConversations}`);
    logInfo(`Total messages: ${stats.totalMessages}`);
  } else {
    logError('Failed to get message statistics');
  }

  return true;
}

// Test recent messages
async function testRecentMessages() {
  log('\n⏰ Testing Recent Messages...', 'cyan');
  
  const recentResponse = await apiRequest('/messages/recent?limit=5');
  
  if (recentResponse.success) {
    const messages = recentResponse.data.data.messages || [];
    logSuccess(`Retrieved ${messages.length} recent messages`);
    
    messages.forEach((msg, index) => {
      logInfo(`Recent ${index + 1}: "${msg.content}"`);
    });
    
  } else {
    logError('Failed to get recent messages');
  }

  return true;
}

// Main test runner
async function runTests() {
  log('🚀 Starting Messaging System Tests', 'magenta');
  log('=' .repeat(50), 'magenta');

  try {
    // Test authentication first
    const authSuccess = await testAuth();
    if (!authSuccess) {
      logError('Authentication failed - aborting tests');
      return;
    }

    // Run all tests
    await testPartnershipMessaging();
    await testDirectMessaging();
    await testConversations();
    await testUnreadCount();
    await testMessageSearch();
    await testMessageStats();
    await testRecentMessages();

    log('\n🎉 All tests completed!', 'green');
    log('=' .repeat(50), 'magenta');

  } catch (error) {
    logError(`Test suite failed with error: ${error.message}`);
    console.error(error);
  }
}

// Check if server is running
async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      logSuccess('Server is running and healthy');
      return true;
    } else {
      logError('Server health check failed');
      return false;
    }
  } catch (error) {
    logError(`Cannot connect to server at ${API_BASE}`);
    logInfo('Make sure the backend server is running on port 5000');
    return false;
  }
}

// Start the tests
async function main() {
  const serverHealthy = await checkServerHealth();
  
  if (serverHealthy) {
    await runTests();
  } else {
    logError('Cannot proceed with tests - server is not accessible');
    process.exit(1);
  }
}

// Run the test suite
if (require.main === module) {
  main();
}

module.exports = {
  runTests,
  checkServerHealth,
  apiRequest
};