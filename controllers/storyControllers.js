const createStoryController = (req, res) => {
    console.log(req.files, req.body);
    res.send('Create Story')
}
const deleteStoryController = (req, res) => {
    res.send('Delete Story')
}

module.exports = {
    createStoryController,
    deleteStoryController
}