//Employee class
//giving us the framework of the object without having to recreate it everytime..
class Terms{
    constructor(term, definition, context, term_plural, reference, comment){
    this.term = term;
    this.definition = definition;
    this.context = context;
    this.term_plural = term_plural;
    this.reference = reference;
    this.comment = comment;
  }
}

module.exports = Terms;