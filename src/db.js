let db = require("mongoose");

export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	db.Promise = global.Promise;
	db.connect("mongodb://localhost:27017/node-spreadsheet-app2");
	callback(db);
}
