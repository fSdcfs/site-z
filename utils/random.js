const random =
(len)=>Array.from({length:len},()=>'ABCDEFG'.charAt(Math.floor(Math.random()*7))).join()

module.exports=random;


