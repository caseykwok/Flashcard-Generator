function BasicCard(front, back) {
	if (this instanceof BasicCard) {
		this.front = front;
		this.back = back;
	} else {
		return new BasicCard(front, back);
	}
};

module.exports = BasicCard;

// var firstPresident = new BasicCard(
//     "Who was the first president of the United States?", "George Washington");
// console.log(firstPresident);
// console.log(firstPresident.front);
// console.log(firstPresident.back);