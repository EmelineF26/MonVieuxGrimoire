exports.signup = (req, res, next) => {
    res.status(200).json({ message: 'Je suis bien signup !'});
}

exports.login = (req, res, next) => {
    res.status(200).json({ message: 'Je suis bien login !'});
}