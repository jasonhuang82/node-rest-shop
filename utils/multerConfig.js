// multer -> body-parser 無法處理二進位以及 form-data 格式的 body，multer 是專門處理 form-data 的 middleware
const multer = require('multer');
const path = require('path');
const uuid = require('node-uuid');
const storage = multer.diskStorage({
    // 要上傳檔案的位置
    destination (req, file, cb) {
        cb(null, path.resolve(__dirname, "../","uploads"));
    },
    filename (req, file, cb) {
        cb(null, `${uuid.v1()}${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // true === save file
    // false === reject file
    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
    const isValidType = fileType.includes(file.mimetype);
    if (!isValidType) {
        // reject file && retrun 500 response
        cb(new Error('File Type is not valid'), false);
        return;
    }

    cb(null, true);
}

const _multer = () => multer({
    storage,
    limits: {
        fieldSize: 1024 * 1024 * 5,
    },
    fileFilter,
})
module.exports = _multer;