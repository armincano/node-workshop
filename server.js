const express = require("express");
const app = express().use(express.json());

app.use((req, res, next) => {
	console.log(req.method);
	console.log(req.url);
	let startMsSinceEpoch = Date.now();
	next();
	console.log("Total Time: ", Date.now() - startMsSinceEpoch);
});

function containsPropsQuoteObject(newQuote) {
	return newQuote.hasOwnProperty("quote") && newQuote.hasOwnProperty("author");
}

const quotes = require("./quotes.json");

function filterId(id) {
	return quotes.filter((quote) => quote.id == id);
}

app.get("/", function (request, response) {
	response.send("/quotes/17 should return one quote, by id");
});

app.get("/quotes", function (request, response) {
	response.json(quotes);
});

app.post("/quotes", (req, res) => {
	const newQuote = req.body;
	if (!containsPropsQuoteObject(newQuote)) {
		res
			.status(422)
			.send({ error: "the structure of the quote object lacks some property" });
	} else {
		const newQuoteId = quotes.length > 0 ? quotes[quotes.length - 1].id + 1 : 0;
		quotes.push({
			...newQuote,
			id: newQuoteId,
		});
		res.status(201).json(quotes);
	}
});

app.get("/quotes/:quote_id", (req, res) => {
	let quoteId = req.params.quote_id;
	let quoteFilteredWithId = filterId(quoteId);
	res.json(quoteFilteredWithId);
});

app.put("/quotes/:quote_id", (req, res) => {
	const quoteId = parseInt(req.params.quote_id);
	const newQuote = req.body;
	const quoteIdx = quotes.findIndex((quote) => quote.id == quoteId);
	if (quoteIdx == -1) {
		res.status(404).send({ error: "this id is not in the quote list" });
	} else if (!containsPropsQuoteObject(newQuote)) {
		res
			.status(422)
			.send({ error: "the structure of the quote object lacks some property" });
	} else {
		quotes[quoteIdx] = {
			...newQuote,
			id: quoteId,
		};
		res.status(200).json(quotes);
	}
});

app.delete("/quotes/:quote_id", (req, res) => {
	const quoteId = parseInt(req.params.quote_id);
	const quoteIdx = quotes.findIndex((quote) => quote.id == quoteId);
	if (quoteIdx == -1) {
		res.status(404).send({ error: "this id is not in the quote list" });
	} else {
		quotes.splice(quoteId, 1);
		res
			.status(200)
			.send({ message: `the quote with id ${quoteId} was erased` });
	}
});

app.listen(3000, () => console.log("Listening on port 3000"));
