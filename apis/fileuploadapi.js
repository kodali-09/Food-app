const exp = require('express');
const bodyParser = require('body-parser');
const fileUploadApp = exp.Router();
const upload = require('../middleware/multerConfig')
fileUploadApp.use(exp.json());
fileUploadApp.use(bodyParser.urlencoded({
  extended: false
}))
fileUploadApp.use(bodyParser.json())

fileUploadApp.use('/upload-images', upload.array('image'), async (req, res) => {

  if (req.method === 'POST') {
    const urls = []
    const files = req.files;
    for (const file of files) {
      const cdnObj = { url: file.secure_url, id: file.public_id };
      urls.push(cdnObj)
    }

    res.status(200).json({
      message: 'images uploaded successfully',
      data: urls
    })

  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }
})

module.exports = fileUploadApp;
