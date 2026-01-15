const mongoose = require('mongoose');
const Newspaper = require('./models/Newspaper');

mongoose.connect('mongodb://localhost:27017/rbnews');

async function checkCovers() {
    const newspapers = await Newspaper.find({});
    console.log(`Total newspapers: ${newspapers.length}\n`);
    
    newspapers.forEach(paper => {
        console.log(`Title: ${paper.title}`);
        console.log(`Published: ${paper.isPublished}`);
        console.log(`Has coverImageUrl: ${!!paper.coverImageUrl}`);
        if (paper.coverImageUrl) {
            console.log(`Cover size: ${Math.round(paper.coverImageUrl.length / 1024)} KB`);
            console.log(`Cover starts with: ${paper.coverImageUrl.substring(0, 50)}...`);
        }
        console.log('---\n');
    });
    
    process.exit(0);
}

checkCovers();
