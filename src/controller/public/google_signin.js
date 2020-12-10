const { OAuth2Client } = require("google-auth-library");
const Joi = require('joi');
const User = require('../../model/user');


const authClient = new OAuth2Client("238080994627-h3gm4bjd7b617peas272a3t72eaomsbi.apps.googleusercontent.com");


const loginRequestSchema = Joi.object({
    tokenId: Joi.string().required()
});
exports.login = async (req, resp) => {
    let user;


    try {
        const requestBody = await loginRequestSchema.validateAsync(req.body);
        const tokenId = requestBody.tokenId;
        var googleResponse = await authClient.verifyIdToken({
            idToken: tokenId,
            audience: "238080994627-h3gm4bjd7b617peas272a3t72eaomsbi.apps.googleusercontent.com"
        });
    } catch (ex) {
        console.log(ex);
        return resp.status(400).send("Bad Request");
    }


    let payload = googleResponse.getPayload();


    if (payload.email_verified && (payload.email.includes('@litmus7.com'))) {

        let email = payload.email;
        user = await User.findOne({ email: email });
        if (user) {
            let accessToken = user.generateAuthToken('accessToken');
            let refreshToken = user.generateAuthToken('refreshToken');
            resp.send({ accessToken, refreshToken });
        } else {
            user = new User({
                email: email,
                name: payload.name,
                enabled: true,
                role: 'user'
            });
            user = await user.save();
            let accessToken = user.generateAuthToken('accessToken');
            let refreshToken = user.generateAuthToken('refreshToken');
            resp.send({ accessToken, refreshToken });
        }
    } else {

        if (!payload.email.includes('@litmus7.com')) {
            return resp.status(400).send("Login with Litmus7 email")
        }

        return resp.status(403).send("Forbidden");
    }

}