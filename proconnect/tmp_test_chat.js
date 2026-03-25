const axios = require('axios');
const baseURL = 'https://proconnectapi-2.onrender.com';

async function testPost() {
  try {
    const res = await axios.post(`${baseURL}/chat`, { clienteId: 1, profissionalId: 2 });
    console.log("POST /chat:", res.data);
  } catch(e) {
    if (e.response) {
      console.error("API Error POST:", e.response.status, e.response.data);
    } else {
      console.error("Network Error:", e.message);
    }
  }
}
testPost();
