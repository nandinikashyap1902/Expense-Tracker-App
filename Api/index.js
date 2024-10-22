const express = require('express')
const app = express();
app.get('/api/test', (req, res) => {
    res.json('test ok')
})
app.listen(5000, () => {
    console.log('i am running')
})