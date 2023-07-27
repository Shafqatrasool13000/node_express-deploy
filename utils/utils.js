const { appData } = require("./appData");

// validation finder
const validationFinder = (key) => {
    const existedValidation = appData.validations.find((validation) => validation.key === key);
    return existedValidation || { patternMsg: '', notBlankMsg: '' }
}

module.exports = {
    validationFinder
}