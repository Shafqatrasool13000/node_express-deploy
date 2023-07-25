const getAllProducts = (req, res) => {
    throw new Error('Something went wrong')
    res.json({ msg: "All Products" })
}

const getProductsStatic = (req, res) => {
    res.json({ msg: "All Static Products" })
}

module.exports = {
    getAllProducts, getProductsStatic
}