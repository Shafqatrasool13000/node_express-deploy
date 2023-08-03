const createPostController = (req, res) => {
    console.log(req.files, req.body);
    res.send('Create Post')
}

const editPostController = (req, res) => {
    res.send('Edit Post')

}
const deletePostController = (req, res) => {
    res.send('Delete Post')
}

const postDetailsController = (req, res) => {
    res.send('Post details')
}
const postListController = (req, res) => {
    res.send('Post List')
}


module.exports = {
    createPostController,
    editPostController,
    deletePostController,
    postDetailsController,
    postListController
}