const router = require('express').Router()
const User = require('../models/user.model')

router.route('/signup').post(async (req, res) => {
    const { name, email, referredBy } = req.body;
    // Existing User edge case
    const oldUser = await User.findOne({email : email}).exec()
    if(oldUser) {
        return res.status(400).send('User already Exists');
    }

    // Unique Referral Code logic
    const ref = email.substring(0, email.indexOf('@')) + Math.random().toString(36).substring(2, 10)
    console.log(ref)
    const exisRef = await User.findOne({referralCode : ref}).exec()
    console.log(exisRef)
    while (exisRef) {
        ref = email.substring(0, email.indexOf('@')) + Math.random().toString(36).substring(2, 10)
        exisRef = await User.findOne({referralCode : ref}).exec()
    }


    let referrer = ''
    
    const user = new User({
        name: name,
        email: email,
        // referralCode: Math.random().toString(36).substring(2, 10), // Generate new referral code
        referralCode: ref,
        referredBy: referredBy,
    });

    await user.save()
        .then(user => res.status(200).send(user))
        .catch(err => res.status(400).json('Error: ' + err))

    if(referredBy) {
        referrer = await User.findOne({ referralCode: referredBy }).exec();
        if (!referrer) {
            return res.status(400).send('Invalid referral code');
        }
        console.log(referrer)
        referrer.referredUsers.push(user.email);
        await referrer.save();
    }
})

router.route('/:email').get(async (req, res) => {
    const user = await User.findOne({ email: req.params.email }).exec();
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.status(200).send(user);
})




module.exports = router