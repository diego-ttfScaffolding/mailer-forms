const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const bodyParser = require('body-parser');

// Parse JSON request bodies
app.use(bodyParser.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route
app.post('/newDestinatary', async (req, res) => {
  const { email, formTitle } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'diego@ttfscaffolding.com',
        pass: 'knenctceisehqgrg'
      }
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve('./views'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./views'),
      extName: ".handlebars",
    };
    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
      from: 'TTF SCAFFOLDING',
      to: email,
      subject: formTitle, 
      template: 'email',
      context: {
        formTitle
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.send("Email sent");
  } catch (error) {
    console.log(error);
    res.status(500).send('Error sending email');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

