
const getAllUsers = async (req, res) => {
    res.send('all Users');
}

const getUserDetails = async (req, res) => {
    res.send('User Details');
}

const searchUser = async (req, res) => {
    res.send('User search');
}

const updateUserStatus = async (req, res) => {
    res.send('User update status');
}

const updateUser = async (req, res) => {
    res.send('User update');
}

module.exports = {
    getAllUsers,
    getUserDetails,
    searchUser,
    updateUserStatus,
    updateUser
}