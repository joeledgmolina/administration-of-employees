const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const {Salary} = require('../models/salary');

/**Restriction: from_date must be smaller than to_date */
function compareDates(date1, date2){
    var from_date = new Date(date1);
    var to_date = new Date(date2);
    if (from_date <= to_date) return true
    else return false;
}

const FromDateMustBeSmallerThanToDate ={
    validate: async function(typeName, originalObject, materializedObject) {
        const DatesAreValids =
        await compareDates(materializedObject.from_date, materializedObject.to_date);
        /**If from_date is greather than to_date then return an error */
        if (!DatesAreValids) {
            throw new FromDateCantBeGreaterThanToDateError(typeName);
        }
    }
};

class FromDateCantBeGreaterThanToDateError extends GNXError {
    constructor(typeName) {
        super(typeName,'from_date cant be greater than to_date', 'FromDateCantBeGreaterThanToDateError');
    }
};

module.exports ={
    FromDateMustBeSmallerThanToDate,
};