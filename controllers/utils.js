const { validationResult } = require("express-validator");
const { appData } = require("../utils/appData");

const getAppData = (req, res) => {
    const { countryName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (countryName === 'Pakistan' || countryName === 'Canada') {
        return res.status(200).json({
            "responseCode": "200",
            "responseMessage": "Record Fetched Successfully",
            "execTime": 1,
            "errors": null,
            "results": appData
        });
    }
    res.status(404).json({
        "responseCode": "404",
        "responseMessage": "Country Not Allowed",
    })
}

module.exports = getAppData;