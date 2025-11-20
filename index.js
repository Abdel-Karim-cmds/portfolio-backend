
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const { sendMail } = require('./Mailing');

// CORS configuration to allow requests from your frontend
const corsOptions = {
    origin: '*',
};

// Enable CORS
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Email server is running.');
});

app.post('/api/send-email', async (req, res) => {
    console.log('Received request body:', req.body);
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Create a transporter object using the default SMTP transport
    const result = await sendMail({ name, email, message });

    if (result.success) {
        res.json({ success: true, message: 'Email sent successfully' });
    } else {
        res.status(500).json({ success: false, error: result.error, message: 'Failed to send email' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
