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

  const titles = [
    'Credit Application', 
    'Credit Request', 
    'Credit Card Authorization'
  ]

  const docsUrl = [
    'https://ttfscaffolding.com/wp-content/uploads/2023/07/TTF-Credit-Application-2023-1.pdf',
    'https://ttfscaffolding.com/wp-content/uploads/2023/07/TTF-Credit-Request-2023-1-1.pdf',
    'https://ttfscaffolding.com/wp-content/uploads/2023/07/TTF-Credit-Card-Authorization.pdf'
  ]
  const onlineURL = [
    'https://ttfconstruction.com/creditForms/#/form-applicationsForCredit',
    'https://ttfconstruction.com/creditForms/#/form-creditRequest',
    'https://ttfconstruction.com/creditForms/#/form-creditCardAuthorization'
  ]

  let formFileURL, formOnlineURL, emailTitle;

  switch (formTitle) {
    case 'creditApplication':
      formFileURL = docsUrl[0]
      formOnlineURL = onlineURL[0]
      emailTitle = titles[0]
      break;
    case 'creditRequest':
      formFileURL = docsUrl[1]
      formOnlineURL = onlineURL[1]
      emailTitle = titles[1]
      break;
    case 'creditCardAuthorization':
      formFileURL = docsUrl[2]
      formOnlineURL = onlineURL[2]
      emailTitle = titles[2]
      break;
  
    default:
      formFileURL = ''
      formOnlineURL = ''
      break;
  }

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
      subject: emailTitle, 
      template: 'email',
      context: {
        emailTitle,
        formFileURL, 
        formOnlineURL
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

