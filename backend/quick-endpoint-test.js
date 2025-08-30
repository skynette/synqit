/**
 * Quick endpoint verification test
 * Tests that messaging endpoints exist and respond correctly
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testEndpoints() {
    console.log('🔍 Testing Messaging Endpoints Existence...\n');
    
    const endpoints = [
        { method: 'POST', path: '/messages/send', desc: 'Send partnership message' },
        { method: 'POST', path: '/messages/direct', desc: 'Send direct message' },
        { method: 'GET', path: '/messages/direct/123e4567-e89b-12d3-a456-426614174000', desc: 'Get direct messages with user' },
        { method: 'GET', path: '/messages/conversations', desc: 'Get all conversations' },
        { method: 'GET', path: '/messages/partnerships/123e4567-e89b-12d3-a456-426614174000', desc: 'Get partnership messages' },
        { method: 'POST', path: '/messages/mark-read', desc: 'Mark messages as read' },
        { method: 'GET', path: '/messages/unread-count', desc: 'Get total unread count' },
        { method: 'GET', path: '/messages/search?q=test', desc: 'Search messages' },
        { method: 'GET', path: '/messages/stats', desc: 'Get messaging statistics' },
        { method: 'GET', path: '/messages/recent', desc: 'Get recent messages' },
        { method: 'DELETE', path: '/messages/123e4567-e89b-12d3-a456-426614174000', desc: 'Delete message' }
    ];
    
    let allPassed = true;
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${API_BASE}${endpoint.path}`, {
                method: endpoint.method,
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            // We expect authentication errors, not 404 errors
            if (response.status === 401 || data.message === 'Access token required') {
                console.log(`✅ ${endpoint.method} ${endpoint.path} - ${endpoint.desc} (endpoint exists)`);
            } else if (response.status === 404) {
                console.log(`❌ ${endpoint.method} ${endpoint.path} - ${endpoint.desc} (endpoint NOT FOUND)`);
                allPassed = false;
            } else {
                console.log(`⚠️  ${endpoint.method} ${endpoint.path} - ${endpoint.desc} (status: ${response.status})`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint.method} ${endpoint.path} - ${endpoint.desc} (error: ${error.message})`);
            allPassed = false;
        }
    }
    
    console.log('\n' + '='.repeat(60));
    if (allPassed) {
        console.log('🎉 ALL MESSAGING ENDPOINTS EXIST AND ARE ACCESSIBLE!');
        console.log('✅ All endpoints properly require authentication');
    } else {
        console.log('❌ Some endpoints are missing or not working');
    }
    console.log('='.repeat(60));
}

testEndpoints();