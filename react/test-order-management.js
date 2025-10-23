// Test script for Order Management API endpoints
// Run this script to test the order management functionality

const API_BASE_URL = 'http://62.171.154.6:9090';

// Test data - Swagger-ə uyğun
const testOrder = {
  customerId: 1,
  courierId: 3, // Mövcud courier ID
  carboyCount: 5 // Swagger-də tələb olunan field
};

// Test functions
async function testCreateOrder() {
  console.log('🧪 Testing POST /orders/add...');
  try {
    const response = await fetch(`${API_BASE_URL}/orders/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Create Order Success:', result);
      // Yeni yaradılan order-in ID-sini tapmaq üçün orders list-ə baxaq
      const ordersResponse = await fetch(`${API_BASE_URL}/orders/all`);
      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();
        const latestOrder = orders.response[orders.response.length - 1];
        return latestOrder.id;
      }
      return null;
    } else {
      const error = await response.text();
      console.log('❌ Create Order Failed:', response.status, error);
      return null;
    }
  } catch (error) {
    console.log('❌ Create Order Error:', error.message);
    return null;
  }
}

async function testGetOrder(orderId) {
  console.log(`🧪 Testing GET /orders/${orderId}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Get Order Success:', result);
      return result;
    } else {
      const error = await response.text();
      console.log('❌ Get Order Failed:', response.status, error);
      return null;
    }
  } catch (error) {
    console.log('❌ Get Order Error:', error.message);
    return null;
  }
}

async function testUpdateOrder(orderId) {
  console.log(`🧪 Testing PATCH /orders/update/${orderId}...`);
  const updateData = {
    carboyCount: 10 // Swagger-ə uyğun field
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders/update/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Update Order Success:', result);
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Update Order Failed:', response.status, error);
      return false;
    }
  } catch (error) {
    console.log('❌ Update Order Error:', error.message);
    return false;
  }
}

async function testDeleteOrder(orderId) {
  console.log(`🧪 Testing DELETE /orders/delete/${orderId}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/delete/${orderId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log('✅ Delete Order Success');
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Delete Order Failed:', response.status, error);
      return false;
    }
  } catch (error) {
    console.log('❌ Delete Order Error:', error.message);
    return false;
  }
}

async function testGetAllOrders() {
  console.log('🧪 Testing GET /orders/all...');
  try {
    const response = await fetch(`${API_BASE_URL}/orders/all`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Get All Orders Success:', result.length, 'orders found');
      return result;
    } else {
      const error = await response.text();
      console.log('❌ Get All Orders Failed:', response.status, error);
      return null;
    }
  } catch (error) {
    console.log('❌ Get All Orders Error:', error.message);
    return null;
  }
}

async function testGetOrderCount() {
  console.log('🧪 Testing GET /orders/count...');
  try {
    const response = await fetch(`${API_BASE_URL}/orders/count`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Get Order Count Success:', result);
      return result;
    } else {
      const error = await response.text();
      console.log('❌ Get Order Count Failed:', response.status, error);
      return null;
    }
  } catch (error) {
    console.log('❌ Get Order Count Error:', error.message);
    return null;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Order Management API Tests...\n');
  
  // Test 1: Get all orders (baseline)
  await testGetAllOrders();
  console.log('');
  
  // Test 2: Get order count
  await testGetOrderCount();
  console.log('');
  
  // Test 3: Create new order
  const newOrderId = await testCreateOrder();
  console.log('');
  
  if (newOrderId) {
    // Test 3.1: Get the created order
    await testGetOrder(newOrderId);
    console.log('');
    
    // Test 4: Update the order
    const updateSuccess = await testUpdateOrder(newOrderId);
    console.log('');
    
    if (updateSuccess) {
      // Test 5: Get the updated order
      await testGetOrder(newOrderId);
      console.log('');
    }
    
    // Test 6: Delete the order
    await testDeleteOrder(newOrderId);
    console.log('');
  }
  
  console.log('🏁 Order Management API Tests Completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runAllTests().catch(console.error);
} else {
  // Browser environment
  console.log('🌐 Running in browser environment');
  console.log('💡 Open browser console and run: runAllTests()');
  
  // Make function available globally for browser testing
  window.runAllTests = runAllTests;
  window.testCreateOrder = testCreateOrder;
  window.testGetOrder = testGetOrder;
  window.testUpdateOrder = testUpdateOrder;
  window.testDeleteOrder = testDeleteOrder;
  window.testGetAllOrders = testGetAllOrders;
  window.testGetOrderCount = testGetOrderCount;
}

