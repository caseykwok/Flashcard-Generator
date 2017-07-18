function ClozeCard(text, cloze) {
	if (this instanceof ClozeCard) {
		if (text.includes(cloze)) {
			this.cloze = cloze;
			this.partial = text.replace(cloze, "...");
			this.fullText = text;
		} else {
			console.log("Cloze deletion does not appear in statement.");
		};
	} else {
		return new ClozeCard(text, cloze);
	}
};

module.exports = ClozeCard;

// var firstPresidentBasic = new BasicCard(
	// "Who is the first president of the United States?")
// console.log(firstPresidentCloze);
// console.log(firstPresidentCloze.cloze);
// console.log(firstPresidentCloze.partial);
// console.log(firstPresidentCloze.fullText);

// var brokenCloze = new ClozeCard("This doesn't work", "oops");
// console.log(brokenCloze);
// console.log(Object.keys(brokenCloze).length === 0);
