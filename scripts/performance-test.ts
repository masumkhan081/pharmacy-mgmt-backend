import axios from "axios";
import { performance } from "perf_hooks";

const API_URL = "http://localhost:3000/api";
const LOGIN_DATA = { email: "admin@pharmacy.com", password: "admin123" };

async function runBenchmark() {
  console.log("Starting Performance Benchmark...");

  try {
    // 1. Login to get token
    const loginRes = await axios.post(`${API_URL}/auth/login`, LOGIN_DATA);
    const token = loginRes.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    // 2. Measure Drug Search speed
    const searchStart = performance.now();
    await axios.get(`${API_URL}/drugs?search=Paracetamol`, { headers });
    const searchEnd = performance.now();
    console.log(`- Drug Search Latency: ${(searchEnd - searchStart).toFixed(2)}ms`);

    // 3. Measure Dashboard Stats speed
    const dashStart = performance.now();
    await axios.get(`${API_URL}/dashboard/stats`, { headers });
    const dashEnd = performance.now();
    console.log(`- Dashboard Stats Latency: ${(dashEnd - dashStart).toFixed(2)}ms`);

    // 4. Measure Inventory Batches speed
    const invStart = performance.now();
    await axios.get(`${API_URL}/inventory-batches`, { headers });
    const invEnd = performance.now();
    console.log(`- Inventory Batches Latency: ${(invEnd - invStart).toFixed(2)}ms`);

    // 5. Concurrent Requests test
    console.log("- Running 10 concurrent dashboard requests...");
    const concurrentStart = performance.now();
    await Promise.all(Array(10).fill(0).map(() => axios.get(`${API_URL}/dashboard/stats`, { headers })));
    const concurrentEnd = performance.now();
    console.log(`- 10 Concurrent Requests Total Time: ${(concurrentEnd - concurrentStart).toFixed(2)}ms`);

  } catch (error: any) {
    console.error("Benchmark failed:", error.message);
  }
}

runBenchmark();
