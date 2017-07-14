function ClozeCard(text, cloze) {
	if (text.includes(cloze)) {
		this.cloze = cloze;
		this.partial = text.replace(cloze, "...");
		this.fullText = text;
	} else {
		console.log("Cloze deletion does not appear in text.");
	};
};

module.exports = ClozeCard;