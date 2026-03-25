const axios = require('axios');
const baseURL = 'https://proconnectapi-2.onrender.com';

async function test() {
  try {
    console.log("Testing GET /chat/usuario/1...");
    const conversas = await axios.get(`${baseURL}/chat/usuario/1`);
    console.log("Conversas: ", JSON.stringify(conversas.data, null, 2));
  } catch(e) {
    if (e.response) {
      console.error("API Error:", e.response.status, e.response.data);
    } else {
      console.error("Network Error:", e.message);
    }
  }

  try {
    console.log("Testing GET /chat/usuario/2...");
    const conversas2 = await axios.get(`${baseURL}/chat/usuario/2`);
    console.log("Conversas user 2: ", JSON.stringify(conversas2.data, null, 2));
  } catch(e) {
    if (e.response) {
      console.error("API Error user 2:", e.response.status, e.response.data);
    } else {
      console.error("Network Error user 2:", e.message);
    }
  }
}

test();
