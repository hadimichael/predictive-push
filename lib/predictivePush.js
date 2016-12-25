'use strict';

const fs = require('fs');
const path = require('path');
const NaiveBayesClassifier = require('naivebayesclassifier');
const chalk = require('chalk');

const defaultOptions = {
	confidenceThreshold: 0.24,
	rootDir: path.join(__dirname, '../..'),
	staticRoute: '/static',
};

const predictivePush = (options = defaultOptions) => {
	const noopTokenizer = (text) => [text];
	const classifier = new NaiveBayesClassifier({ tokenizer: noopTokenizer });

	const learn = (rootUrl, asset) => {
		console.log(chalk.bold.blue('[Learn]'), `"${asset}"`);
		classifier.learn(rootUrl, asset);
	};

	const getAssets = (rootUrl) => {
		const classification = classifier.categorize(rootUrl);

		return Object.keys(classification.categories)
			.filter(key => {
				console.log(chalk.bold.yellow('[Classify]'), `"${key}" at "${classification.categories[key] * classifier.totalNumberOfDocuments / classifier.docFrequencyCount[key]}"`);
				return classification.categories[key] * classifier.totalNumberOfDocuments > classifier.docFrequencyCount[key];
			});
	};

	const isPushableAsset = (url) => {
		const staticLoc = url.indexOf(options.staticRoute);
		return staticLoc >= 0 && staticLoc <= 1;
	};

	let currentRootUrl;

	return (req, res, next) => {
		if (isPushableAsset(req.url)) {
			learn(currentRootUrl, req.url);
		} else {
			console.log(chalk.white.bgBlue('[REQUEST]'), `from "${req.url}"`);
			
			currentRootUrl = req.url;

			const assets = getAssets(currentRootUrl);
			
			for (const asset of assets) {
				console.log(chalk.green('[Push]'), `"${asset}"`);
				
				const file = path.join(options.rootDir, asset);
				const loadedAsset = fs.readFileSync(file);
				res.push(asset, {}, (err, stream) => {
					stream.end(loadedAsset);
				});
			}
		}

		next();
	}
};

module.exports = predictivePush;
