const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';
let authToken = null;
let userId = null;

async function login() {
    console.log('🔐 Logging in...');
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'cutejosh24@gmail.com',
            password: '!Synqit2'
        })
    });
    
    const data = await response.json();
    if (data.success) {
        authToken = data.data.token;
        userId = data.data.user.id;
        console.log('✅ Logged in successfully');
        console.log('User ID:', userId);
        return true;
    } else {
        console.error('❌ Login failed:', data.message);
        return false;
    }
}

async function getConversations() {
    console.log('\n📬 Getting conversations...');
    const response = await fetch(`${API_BASE}/messages/conversations`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    
    if (data.success) {
        console.log('✅ Got conversations');
        console.log('Total conversations:', data.data.conversations.length);
        
        if (data.data.conversations.length > 0) {
            const firstConvo = data.data.conversations[0];
            console.log('\nFirst conversation:');
            console.log('- ID (Partnership ID):', firstConvo.id);
            console.log('- Title:', firstConvo.title);
            console.log('- Status:', firstConvo.status);
            console.log('- Partner:', firstConvo.partner);
            console.log('- Last Message:', firstConvo.lastMessage);
            return firstConvo.id; // Return partnership ID
        }
    } else {
        console.error('❌ Failed to get conversations:', data.message);
    }
    
    return null;
}

async function getPartnershipMessages(partnershipId) {
    console.log('\n💬 Getting messages for partnership:', partnershipId);
    
    const url = `${API_BASE}/messages/partnerships/${partnershipId}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 404) {
        console.error('❌ 404 Error - Partnership not found');
        console.log('Possible reasons:');
        console.log('1. Partnership ID is invalid');
        console.log('2. User is not part of this partnership');
        console.log('3. Partnership has been deleted');
    } else if (data.success) {
        console.log('✅ Got messages successfully');
        if (data.data.messages) {
            console.log('Total messages:', data.data.messages.length);
        }
    } else {
        console.error('❌ Failed to get messages:', data.message);
    }
    
    return data;
}

async function testWorkflow() {
    try {
        // Step 1: Login
        const loginSuccess = await login();
        if (!loginSuccess) {
            console.error('Cannot proceed without login');
            return;
        }
        
        // Step 2: Get conversations
        const partnershipId = await getConversations();
        
        if (partnershipId) {
            // Step 3: Get messages for the partnership
            await getPartnershipMessages(partnershipId);
        } else {
            console.log('\n⚠️ No conversations found. Creating test data might help.');
        }
        
    } catch (error) {
        console.error('Error in test workflow:', error);
    }
}

// Run the test
testWorkflow();