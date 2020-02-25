const otps = require('otplib');
const opts = require('./opts');
const nodemailer = require('nodemailer');

const totp = otps.totp;


async function sendEmailOTP(toMail, username, name) {
    //cau hinh otp
    totp.options = {
        digits: 6,   //mã là số và 6 chữ số
        step: opts.OTP_PROPERTIES.LIFETIME,   //mã tồn tại trong 5 phút
    }

    //secret là OTP_TOKEN cộng với email gửi tới để định danh đc sercet key
    const secret = opts.OTP_PROPERTIES.SECRET_KEY + username;
    const token = totp.generate(secret);

    //cau hinh tai khoan email
    var transporter = nodemailer.createTransport({
        host: opts.MAIL.HOST,
        port: opts.MAIL.PORT,
        secure: true,
        auth: {
            user: opts.MAIL.USER,
            pass: opts.MAIL.PWD
        }
    });

    var mailOptions = {
        from: opts.MAIL.USER,
        to: toMail,
        subject: 'Mã xác thực OTP',
        html: `<h2>Xin chào ${name}</h2></br>
            <p><strong>${token}<strong> là mã OTP ngân hàng HKL Bank của bạn</p><br>
            <p>Mã này sẽ tồn tại trong 5 phút kể từ lúc nhận mail này<p>`
    };
    
    var info = await transporter.sendMail(mailOptions);
    return info;
}

function checkOTP(username, token){
    //secret là OTP_TOKEN cộng với email gửi tới để định danh đc sercet key
    //console.log(username);
    //console.log(token);
    const secret = opts.OTP_PROPERTIES.SECRET_KEY + username;
    try {
        const isValid = totp.check(token, secret);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    sendEmailOTP,
    checkOTP
}
