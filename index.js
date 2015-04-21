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
    }
}

Trie.prototype.pushString = function(string){
    var c = string.charAt(0)
    this.nextTries.push(letter);
    this.nextTries.sort();
    this.count += 1;
}

Trie.prototype.getTrie = function(l){
    return nextTries[l];
}

Trie.prototype.nextLetters = function(){
    return _.keys(nextTries).sort();
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
    } else{
        this.nextTries[key] = new Trie(tail);
    }
}

function populateTrie(){
    var retTrie = new Trie();
    for(var word in dict){
        retTrie.construct(dict[word].toLowerCase().split(""));
    }
    return retTrie;
}

rootTrie = populateTrie();

wordFinder = function(){

}();

letterController = function(){
    var letters = ['e','t','a','o','i','n','s','h','r','d','l','c','u','m','w','f','g','y','p','b','v','k','j','x','q','z'];
    var index = 0;
    function setIndex(i){
        index = i;
        var letter = letters[i];
        $("#letter").text(letter);
    }
    setIndex(0);
    return {
        reset : function(){
            setIndex(0);
            $("#message").empty();
        },
        acceptCurrent : function(){
            $("#message").append(letters[index]);
            setIndex(0);
        },
        resetFlag : false,
        increment : function(){
            if(index < letters.length){
                index += 1;
            } else{
                index = 0;
            }
            setIndex(index);
        }
    };
}()

$( document ).ready(function(){

    var TIMEOUT_DELAY_MS = 2000;
    letterController.reset();
    setInterval(function(){
        if(letterController.resetFlag === true){
            letterController.resetFlag = false;
            setTimeout(function(){},TIMEOUT_DELAY_MS);
        }
        letterController.increment();

    }, TIMEOUT_DELAY_MS);
});

$(document).keypress(function(e){
    letterController.acceptCurrent();
});
