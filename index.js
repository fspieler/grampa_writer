letterController = function(){
    letters = ['e','t','a','o','i','n','s','h','r','d','l','c','u','m','w','f','g','y','p','b','v','k','j','x','q','z'];
    index = 0;
    function setLetter(l){
        letter = l;
        $("#letter").text(l);
    }
    setLetter(letters[0]);
    return {
        reset : function(){
            setLetter(letters[0]);
            $("#message").empty();
        },
        acceptCurrent : function(){
            $("#message").append(letters[index]);
            setLetter(letters[0]);
        },
        resetFlag : false,
        increment : function(){
            if(index < letters.length){
                index += 1;
            } else{
                index = 0;
            }
            setLetter(letters[index]);
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
