import _ from 'lodash'; 



export default function findDifferences(obj1, obj2) {
    function changes(object, base) {
        return _.transform(object, (result, value, key) => {
            if (!_.isEqual(value, base[key])) {
                result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
            }
        });
    }

    const added = _.transform(obj2, (result, value, key) => {
        if (!_.has(obj1, key)) {
            result[key] = value;
        }
    });

    const removed = _.transform(obj1, (result, value, key) => {
        if (!_.has(obj2, key)) {
            result[key] = value;
        }
    });

    const modified = changes(obj2, obj1);

    return {
        added,
        removed,
        modified,
    };
}


