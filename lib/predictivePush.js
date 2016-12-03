const fs = require('fs');
const path = require('path');

function tokenizer(str) {
	if (str[0]) {
		str = str.substring(1);
	}
	return str.split('/');
}

let memory = {};
let lastRoot = undefined;

module.exports = (req, res, next) => {
	const token = tokenizer(req.url);
	let assets = [];

	if (memory[token[0]] && memory[token[0]].length > 1) {
		for (asset of memory[token[0]]) {
			const file = path.join(__dirname, '..', asset);
			const loadedAsset = fs.readFileSync(file);
			res.push(asset, {}, (err, stream) => {
				stream.end(loadedAsset);
			});
			console.log(`pushed: ${asset}`);
		}
	}
	
	if (token[0] === "static") {
		memory[lastRoot].push(req.url);
	} else {
		lastRoot = token[0];
		memory[lastRoot] = memory[lastRoot] || [];
	}

	console.log(memory)
	next();
}
