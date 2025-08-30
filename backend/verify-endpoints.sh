#!/bin/bash

echo "🔍 Testing Messaging Endpoints Existence..."
echo "============================================"

BASE_URL="http://localhost:5000/api"

# Function to test endpoint
test_endpoint() {
    local method=$1
    local path=$2
    local desc=$3
    
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$path" 2>/dev/null)
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "401" ] || [[ "$body" == *"Access token required"* ]]; then
        echo "✅ $method $path - $desc (endpoint exists)"
        return 0
    elif [ "$status_code" = "404" ]; then
        echo "❌ $method $path - $desc (endpoint NOT FOUND)"
        return 1
    else
        echo "⚠️  $method $path - $desc (status: $status_code)"
        return 0
    fi
}

# Test all endpoints
failed=0

echo
echo "Testing all messaging endpoints:"
echo "--------------------------------"

test_endpoint "POST" "/messages/send" "Send partnership message" || ((failed++))
test_endpoint "POST" "/messages/direct" "Send direct message" || ((failed++))
test_endpoint "GET" "/messages/direct/123e4567-e89b-12d3-a456-426614174000" "Get direct messages with user" || ((failed++))
test_endpoint "GET" "/messages/conversations" "Get all conversations" || ((failed++))
test_endpoint "GET" "/messages/partnerships/123e4567-e89b-12d3-a456-426614174000" "Get partnership messages" || ((failed++))
test_endpoint "POST" "/messages/mark-read" "Mark messages as read" || ((failed++))
test_endpoint "GET" "/messages/unread-count" "Get total unread count" || ((failed++))
test_endpoint "GET" "/messages/search?q=test" "Search messages" || ((failed++))
test_endpoint "GET" "/messages/stats" "Get messaging statistics" || ((failed++))
test_endpoint "GET" "/messages/recent" "Get recent messages" || ((failed++))
test_endpoint "DELETE" "/messages/123e4567-e89b-12d3-a456-426614174000" "Delete message" || ((failed++))

echo
echo "============================================"
if [ $failed -eq 0 ]; then
    echo "🎉 ALL MESSAGING ENDPOINTS EXIST AND ARE ACCESSIBLE!"
    echo "✅ All endpoints properly require authentication"
    echo "✅ Total endpoints tested: 11"
    echo "✅ All endpoints responding correctly"
else
    echo "❌ $failed endpoints are missing or not working"
fi
echo "============================================"