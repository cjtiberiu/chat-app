const multer = require('multer');
const fs = require('fs');
const path = require('path');

// returns the file extension
const getFileType = file => {
    const mimeType = file.mimetype.split('/');
    return mimeType[mimeType.length - 1]
}

// generate the file name
const generateFileName = (req, file, cb) => {
    const extension = getFileType(file)

    const filename = Date.now() + `-` + Math.round(Math.random() * 1E9) + `.` + extension;
    cb(null, file.fieldname + `-` + filename);
}

// check if the file has a valid extension
const fileFilter = (req, file, cb) => {
    const extension = getFileType(file);

    const allowedTypes = /jpeg|jpg|png/;

    const passed = allowedTypes.test(extension);

    if (passed) {
        return cb(null, true);
    }

    return cb(null, false)
}

exports.userFile = ((req, res, next) => {


    // creating the multer object
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {

            // creating a destination path based on user id
            const { id } = req.user;
            const dest = `uploads/user/${id}`;

            fs.access(dest, (err) => {
                // if folder doesn't exists
                if (err) {
                    // create the user folder based on id
                    return fs.mkdir(dest, (err) => {
                        cb(err, dest);
                    })
                } else {
                    fs.readdir(dest, (err, files) => {
                        if (err) throw err;

                        // deleting the other files in the users folder 
                        for (const file of files) {
                            fs.unlink(path.join(dest, file), err => {
                                if (err) throw err;
                            })
                        }
                    })

                    return cb(null, dest);
                }
            })
        },
        filename: generateFileName
    })
    
    return multer({ storage, fileFilter }).single('avatar')
})();

exports.chatFile = ((req, res, next) => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {

            // creating a destination path based on user id
            const { id } = req.body;
            const dest = `uploads/chat/${id}`;

            fs.access(dest, (err) => {
                // if folder doesn't exists
                if (err) {
                    // create the user folder based on id
                    return fs.mkdir(dest, (err) => {
                        cb(err, dest);
                    })
                } else {
                    

                    return cb(null, dest);
                }
            })
        },
        filename: generateFileName
    })

    return multer({ storage, fileFilter }).single('image')
})();