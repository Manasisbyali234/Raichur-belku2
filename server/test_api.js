const axios = require('axios');

async function testAPI() {
    try {
        const response = await axios.get('http://localhost:5000/api/user/newspapers');
        console.log('API Response:');
        console.log(JSON.stringify(response.data, null, 2));
        
        if (response.data.newspapers && response.data.newspapers.length > 0) {
            const first = response.data.newspapers[0];
            console.log('\n--- First Newspaper ---');
            console.log('Title:', first.title);
            console.log('Has coverImageUrl:', !!first.coverImageUrl);
            if (first.coverImageUrl) {
                console.log('Cover size:', Math.round(first.coverImageUrl.length / 1024), 'KB');
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();
