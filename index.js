/* {  Trie defs */
function Trie(letters){
    this.nextTries = {};
    this.count = 1;
    if(_.isUndefined(letters) || letters.length === 0){
        this.isFinal = true;
    } else {
        var head = _.head(letters);
        var tail = _.tail(letters);
        this.isFinal = false;
        this.nextTries[head] = new Trie(tail);
        this['_'+head] = this.nextTries[head];
    }
}

Trie.prototype.getTrie = function(l){
    return this.nextTries[l];
}

Trie.prototype.nextLetters = function(){
    return _.keys(this.nextTries).sort();
};

Trie.prototype.construct = function(chars){
    if(chars.length === 0){
        var isFinal = true;
        return;
    }
    var key = _.head(chars);
    var tail = _.tail(chars);
    this.count += 1;
    if(key in this.nextTries){
        this.nextTries[key].construct(tail);
        this['_'+key] = this.nextTries[key];
    } else{
        this.nextTries[key] = new Trie(tail);
        this['_'+key] = this.nextTries[key];
    }
}

Trie.prototype.suffixes = function(){
    function recursiveHelper(trie,str,solns){
        if(trie.isFinal){
            solns.push(str);
        }
        for(var nl in trie.nextTries){
            recursiveHelper(trie.nextTries[nl],str + nl,solns);
        }
    }
    var s = "";
    var retArr = [];
    recursiveHelper(this,s, retArr);
    return retArr;
}

function populateTrie(){
    var retTrie = new Trie();
    retTrie.isFinal = false;
    for(var word in dict){
        retTrie.construct(dict[word].toLowerCase().split(""));
    }
    return retTrie;
}

/* }  end Trie defs */

rootTrie = populateTrie();

/* {  NaiveLetterProvider defs */

function NaiveLetterProvider() {}

NaiveLetterProvider.prototype.incrementLetter = function(){}
NaiveLetterProvider.prototype.acceptCurrentLetter = function(){}


/* }  end NaiveLetterProvider defs */

/* {  SmartWordLetterProvider defs */

function SmartWordLetterProvider(rootTrie) {
    this.root = rootTrie;
    this.resetWord();
    this.resetFlag = false;
    this.lettersIndex = 0;
    this.newTrie(this.root);
}

/* INTERFACE METHODS { */
SmartWordLetterProvider.prototype.incrementLetter = function(){
    if(this.lettersIndex < this.letters.length){
        this.lettersIndex += 1;
    } else{
        this.lettersIndex = 0;
    }
    this.displayCurrentLetter();
}
SmartWordLetterProvider.prototype.acceptCurrentLetter = function(){
    this.acceptLetter(this.letters[this.lettersIndex]);
}
/* END INTERFACE METHODS } */

/* IMPLEMENTATION METHODS { */

SmartWordLetterProvider.prototype.CANCEL_MESSAGE = "cancel word";
SmartWordLetterProvider.prototype.ACCEPT_MESSAGE = "accept word";
SmartWordLetterProvider.prototype.displayCurrentLetter = function(){
    $("#letter").text(this.letters[this.lettersIndex]);
}
SmartWordLetterProvider.prototype.resetWord = function(){
    this.word = "";
    $("#word").empty();
    this.resetFlag = true;
    this.newTrie(this.root);
}
SmartWordLetterProvider.prototype.newTrie = function(trie){
    this.currentTrie = trie;
    this.letters = this.currentTrie.nextLetters();
    this.lettersIndex = 0;
    if(this.letters.length === 0){
        this.acceptWord();
        return;
    }
    console.log(this.letters);
    if(this.letters.length === 1){
        for(var letter in this.letters){
            this.acceptLetter(this.letters[letter]);
            return;
        }
    }
    if(this.letters.length === 0){
        this.acceptWord();
        return;
    }
    if(this.word.length > 0){
        this.letters = _.flatten([this.CANCEL_MESSAGE, this.letters]);
    }
    this.isPossibleFinal = this.currentTrie.isFinal;
    if(this.isPossibleFinal){
        this.letters = _.flatten([this.ACCEPT_MESSAGE, this.letters]);
    }
    this.displayCurrentLetter();
}
SmartWordLetterProvider.prototype.acceptLetter = function(letter){
    if(letter === this.CANCEL_MESSAGE){
        this.resetWord();
    } else if(letter === this.ACCEPT_MESSAGE){
        this.acceptWord();
    } else{
        $("#word").append(letter);
        this.newTrie(this.currentTrie.nextTries[letter]);
    }
}
SmartWordLetterProvider.prototype.acceptWord = function(){
    $("#message").append( " " + $("#word").text());
    this.resetWord();
}
/* END IMPLEMENTATION METHODS } */


/* }  end SmartWordLetterProvider defs */


$( document ).ready(function(){

    var TIMEOUT_DELAY_MS = 2000;

    swLetterProvider = new SmartWordLetterProvider(rootTrie);
    setInterval(function(){
        if(swLetterProvider.resetFlag === true){
            swLetterProvider.resetFlag = false;
            setTimeout(function(){},TIMEOUT_DELAY_MS);
        }
        swLetterProvider.incrementLetter();

    }, TIMEOUT_DELAY_MS);
});

$(document).keypress(function(e){
    swLetterProvider.acceptCurrentLetter();
});
