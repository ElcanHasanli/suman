// Orders API Test Script
// Bu script orders API endpoint-lərini test edir və 500 xətasının səbəbini tapır

const API_BASE_URL = 'http://62.171.154.6:9090';

console.log('🔍 Orders API Test Script Başladılır...\n');

// Test 1: API server-i işləyir?
async function testAPIServer() {
  console.log('🧪 Test 1: API Server Status...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ API Server işləyir');
      return true;
    } else {
      console.log('⚠️ API Server cavab verir amma /health endpoint yoxdur');
      return true; // Server işləyir
    }
  } catch (error) {
    console.log('❌ API Server cavab vermir:', error.message);
    return false;
  }
}

// Test 2: Orders endpoint-i mövcuddur?
async function testOrdersEndpoint() {
  console.log('\n🧪 Test 2: Orders Endpoint Status...');
  try {
    const response = await fetch(`${API_BASE_URL}/orders/all`);
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Orders API işləyir, data:', data);
      return true;
    } else if (response.status === 500) {
      console.log('❌ 500 Internal Server Error - Backend-də problem var');
      const errorText = await response.text();
      console.log('📄 Error Details:', errorText);
      return false;
    } else if (response.status === 404) {
      console.log('❌ 404 Not Found - Orders endpoint mövcud deyil');
      return false;
    } else {
      console.log(`❌ Unexpected Status: ${response.status}`);
      const errorText = await response.text();
      console.log('📄 Response:', errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return false;
  }
}

// Test 3: Swagger documentation yoxlamaq
async function testSwaggerDocs() {
  console.log('\n🧪 Test 3: Swagger Documentation...');
  try {
    const response = await fetch(`${API_BASE_URL}/swagger-ui.html`);
    if (response.ok) {
      console.log('✅ Swagger UI mövcuddur');
      console.log('🌐 Swagger URL:', `${API_BASE_URL}/swagger-ui.html`);
    } else {
      console.log('❌ Swagger UI mövcud deyil');
    }
  } catch (error) {
    console.log('❌ Swagger test xətası:', error.message);
  }
}

// Test 4: Available endpoints yoxlamaq
async function testAvailableEndpoints() {
  console.log('\n🧪 Test 4: Available Endpoints...');
  const endpoints = [
    '/customers/all',
    '/orders/all',
    '/couriers',
    '/users/login',
    '/health',
    '/swagger-ui.html'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const status = response.status;
      const statusText = response.statusText;
      
      if (status === 200) {
        console.log(`✅ ${endpoint} - ${status} ${statusText}`);
      } else if (status === 404) {
        console.log(`❌ ${endpoint} - ${status} ${statusText} (Not Found)`);
      } else if (status === 500) {
        console.log(`💥 ${endpoint} - ${status} ${statusText} (Server Error)`);
      } else {
        console.log(`⚠️ ${endpoint} - ${status} ${statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Network Error: ${error.message}`);
    }
  }
}

// Test 5: Orders table structure yoxlamaq
async function testOrdersTableStructure() {
  console.log('\n🧪 Test 5: Orders Table Structure...');
  try {
    // Əvvəlcə customers endpoint-i yoxlayaq
    const customersResponse = await fetch(`${API_BASE_URL}/customers/all`);
    if (customersResponse.ok) {
      const customers = await customersResponse.json();
      console.log('✅ Customers table mövcuddur, count:', customers.length);
      
      if (customers.length > 0) {
        console.log('📋 Sample customer structure:', customers[0]);
      }
    } else {
      console.log('❌ Customers endpoint xəta verir:', customersResponse.status);
    }
    
    // İndi orders endpoint-i yoxlayaq
    const ordersResponse = await fetch(`${API_BASE_URL}/orders/all`);
    if (ordersResponse.ok) {
      const orders = await ordersResponse.json();
      console.log('✅ Orders table mövcuddur, count:', orders.length);
      
      if (orders.length > 0) {
        console.log('📋 Sample order structure:', orders[0]);
      }
    } else if (ordersResponse.status === 500) {
      console.log('💥 Orders table mövcud deyil və ya database connection problemi var');
      console.log('🔧 Backend-də orders table yaratmaq lazımdır');
    }
  } catch (error) {
    console.log('❌ Table structure test xətası:', error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Orders API Test Suite Başladılır...\n');
  
  const serverOk = await testAPIServer();
  if (!serverOk) {
    console.log('\n💥 API Server işləmir, digər testlər dayandırılır');
    return;
  }
  
  await testOrdersEndpoint();
  await testSwaggerDocs();
  await testAvailableEndpoints();
  await testOrdersTableStructure();
  
  console.log('\n🏁 Test Suite Tamamlandı!');
  console.log('\n📋 Nəticə:');
  console.log('1. Əgər 500 xətası alırsınızsa, backend-də orders table yoxdur');
  console.log('2. Database connection problemi ola bilər');
  console.log('3. API endpoint düzgün konfiqurasiya edilməyib');
  console.log('\n🔧 Həll:');
  console.log('1. Backend-də orders table yaradın');
  console.log('2. Database connection yoxlayın');
  console.log('3. API endpoint-ləri konfiqurasiya edin');
}

// Browser və Node.js üçün
if (typeof window === 'undefined') {
  // Node.js environment
  runAllTests().catch(console.error);
} else {
  // Browser environment
  console.log('🌐 Browser environment-də işləyir');
  console.log('💡 Console-da runAllTests() yazın');
  window.runAllTests = runAllTests;
}

