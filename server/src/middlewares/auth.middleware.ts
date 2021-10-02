export const authenticate = (req, res, next) => {

    const { query, body: { encryption, password, port, server, serverType, username, draw } } = req && req;
    if (!password || !username) {
        return res.status(403).send({ message: 'Invalid credentials' });
    }

    if (!encryption || !port || !server || !serverType) {
        return res.status(403).send({ message: 'Required fields missing' });
    }

    const dataToSecure = {
        encryption,
        password,
        port,
        server,
        serverType,
        username,
    };

    let date = new Date();
    const expires = new Date(date.setDate(date.getDate() + 7));

    res.cookie("secureCookie", JSON.stringify(dataToSecure), {
        secure: true,
        httpOnly: true,
        expires,
    });
    return next();
};