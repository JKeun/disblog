var Promise = require('bluebird'),
    commands = require('../../schema').commands,
    table = 'clients',
    columns = ['redirection_uri', 'logo', 'status', 'type', 'description'];

module.exports = function addManyColumnsToClients(options, logger) {
    var transaction = options.transacting;

    return transaction.schema.hasTable(table)
        .then(function (exists) {
            if (!exists) {
                return Promise.reject(new Error('Table does not exist!'));
            }

            return Promise.mapSeries(columns, function (column) {
                var message = 'Adding column: ' + table + '.' + column;

                return transaction.schema.hasColumn(table, column)
                    .then(function (exists) {
                        if (!exists) {
                            logger.info(message);
                            return commands.addColumn(table, column, transaction);
                        } else {
                            logger.warn(message);
                        }
                    });
            });
        });
};
