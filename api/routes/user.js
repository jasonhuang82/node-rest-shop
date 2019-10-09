const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const getDomain = require('../../utils/getDomain');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res, next) => {
    try {
        const existUser = await User.find({
            email: req.body.email,
        }).exec();
        // find() if no data will return empty array
        if (existUser.length > 0) {
            return res
                .status(409) // 409 means the request data has conflict with resource
                .json({
                    message: 'Email exists',
                });
        }

        // 加鹽，saltRounds === 去翻轉計算結果 10 次，過程中會而外加入一些字串，但同樣的字串加鹽完的結果會是一樣的
        // 為甚麼需要加鹽
        /*
            // https://www.sitepoint.com/why-you-should-use-bcrypt-to-hash-stored-passwords/
            通常像是密碼或是一些比較機密的資料 (EX: couple card password...)，需要存到 DB 又不希望讓人看到明碼，
            不要存明碼到資料庫，因為只要資料庫人員或是公司有心人事想看，就能直接取得會員帳戶，形成漏洞
            又或是今天如果資料庫被攻擊所有帳戶，因為是明碼所以駭客全部帳戶等於全部都被竊取

            原本是透過 MD5 去加密，但他可以很容易被駭客破解了，而現在取而代之是用 hash 他是不可逆的亂碼方式，但缺點是他編碼的過程會花比較久
            但會比較安全，而存到 DB 的時候都已經是亂碼了，那這樣就跟原本密碼不一樣了阿，這樣直接比對不會錯嗎，

            沒錯他已經變成亂碼，但實際上的流程做法會是，在註冊時將密碼 hash，存入 DB，在下次登入時拿著 password 去 hash，因為 hash 如果是一樣字串的話經過
            hash 化產生的亂碼會是一樣的，這時只要把之前 DB 存的亂碼拿來比如果一樣代表密碼是沒有錯誤的，所以允許登入給予 token。
        */
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            // password: req.body.password, Important can not save 
            password: hashPassword,
        });
        const createUser = await user.save();
        console.log('user', createUser)
        res
            .status(201)
            .json({
                message: 'User Created',
            });
    } catch (error) {
        res
            .status(500)
            .json({
                error,
            });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const _user = await (
            User
                .find({
                    email: req.body.email,
                })
                .exec()
        );

        const [matchUser] = _user;

        if (!matchUser) {
            return res
                .status(401) // 沒有授權
                .json({
                    message: 'Auth failed',
                })
        }

        const isVaildPassword= bcrypt.compareSync(req.body.password, matchUser.password);
        if (isVaildPassword) {
            const token = jwt.sign(
                {
                    email: matchUser.email,
                    userId: matchUser._id,
                },
                process.env.JWT_PRIVATE_KEY,
                {
                    expiresIn: "1h",
                }
            );
            return res
                .status(200)
                .json({
                    message: 'Auth Successful',
                    token,
                })
        } else {
            return res
                .status(401) // 沒有授權
                .json({
                    message: 'Auth failed',
                })
        }
    } catch (error) {
        res
            .status(500)
            .json({
                error,
            });
    }
});

router.delete('/:userId', async (req, res, next) => {
    try {
        const existUser = await User.find({
            _id: req.params.userId,
        }).exec();
        if (existUser.length === 0) {
            return res
                .status(404)
                .json({
                    message: 'No User can be deleted',
                });
        }

        const deleteUser = await (
            User
            .remove({
                _id: req.params.userId,
            })
            .exec()
        );
        
        res
            .status(200)
            .json({
                message: 'Delete User',
            });
    } catch (error) {
        res
            .status(500)
            .json({
                error,
            });
    }
});

module.exports = router;
