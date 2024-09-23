const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

module.exports.isConnected = () => {
    const connectedState = [mongoose.STATES.connected];
    return connectedState.indexOf(mongoose.connection.readyState) !== -1;
};

module.exports.connect = async () => {
    if (!this.isConnected()) {
        mongoose
            .connect(MONGO_URI)
            .then(() => console.log('Successfully connected to database!'))
            .catch((error) => {
                console.log('Database Connection failed. exiting now ...');
                console.log(error);
                process.exit(1);
            });
    }
};
