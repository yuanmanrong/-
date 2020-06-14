let renderLoading=(function () {
    let $loadingBox=$('.loadingBox'),
        $current=$loadingBox.find('.current');

    let imgData=["img/9.jpeg","img/big.jpg",
        "img/Sketchpad.png","img/tim1g.jpg",
        "img/timg.jpg","img/timg1.jpg","img/timg11.png",
        "img/timgABZSG9RM.jpg","img/timgG2G7YI0P.jpg","img/timgS000VMC2.jpg","img/timgWOM9D5PD.jpg"];
    let n=0,//已经加载多少
        len=imgData.length;//共需要加载多少

    let preLoad=function preLoad(callback) {
        imgData.forEach(item=>{
            let img=new Image();
            img.onload=()=>{
                $current.css('width',++n/len*100+'%')
                $current.html(parseInt(n/len*100)+'%')
                //加载完成，执行回调函数
                if(n==len){
                    clearTimeout(delayTimer)
                    callback && callback()
                }
            }
            img.src=item;
        })
    }

    //设置最长等待时间,到时间看加载了多少，若达到90per以上则正常访问，否则提示用户网络不佳
    let delayTimer=null;
    let maxDelay=function maxDelay(callback) {
        delayTimer=setTimeout(()=>{
            if (n/len>=0.9){
                callback&&callback()
                return;
            } else {
                alert('当前网络不佳，请稍后再试！')
                window.location.href='http://www.baidu.com';
            }
        },15000)
    }

        let done=function done() {
           let timer=setTimeout(()=>{
               $loadingBox.remove();
               renderPhone.init();
           },1000)
        }

    return {
        init:function () {
            preLoad(done);
            maxDelay(done);
        }
    }
})()

let renderPhone=(function () {
    let $phoneBox=$('.phoneBox'),
        $timeSpan=$phoneBox.find('h2>span'),
        $answer=$('.answer'),
        $answerMark=$answer.find('.markLink'),
        $hang=$phoneBox.find('.hang'),
        $hangMark=$hang.find('.markLink');
    let bell=document.getElementById('bell'),
        say=document.getElementById('say');

    let bellRun=function bellRun() {
        window.document.addEventListener('click',function () {
            bell.play();
        })
    }

    let answerRing=function answerRing() {
        bell.pause();
        $answer.remove();
        $(bell).remove();
        //展示hang
       $hang.css('transform','translateY(0rem)');
       $timeSpan.css('display','block');
       say.play();
       computedTime();
    }

    let autoTimer=null;
    let computedTime=function computedTime(){
        autoTimer=setInterval(()=>{
            let duration=say.duration,
                cur=say.currentTime;
            if(cur>=duration){
                clearInterval(autoTimer)
                hangRing()
                return;
            }
            let mins=Math.floor(cur/60),
                secs=Math.floor(cur-mins*60);
            mins=mins<10?'0'+mins:mins;
            secs=secs<10?'0'+secs:secs;
            $timeSpan.html(`${mins}:${secs}`);
        },1000)
    }
    let hangRing=function hangRing() {
            say.pause();
            $phoneBox.remove(say);
            $phoneBox.remove();
            renderMessage.init();
    }
    return{
        init:function () {
            bell.play();
            $answerMark.tap(answerRing);
            $hangMark.tap(hangRing)
        }
    }
})()

let renderMessage=(function () {
    let $messageBox=$('.messageBox'),
        $wrapper=$messageBox.find('.wrapper'),
        $li=$wrapper.find('li'),
        $keyboard=$messageBox.find('.keyboard'),
        $textInp=$keyboard.find('span'),
        $submit=$keyboard.find('.submit'),
        $music=$('#music')[0];

    let step=-1,//记录当前展示信息的索引
         total=$li.length +1,
         autotimer=null,
         interval=2000;

    //展示信息
    let up=0;
    let messageShow=function messageShow() {
        ++step;
        if(step===2){
           clearInterval(autotimer);
           handleSend();
            return;
        }
        $li.eq(step).addClass('active');
        if(step>=4){
            let height=$li.eq(step)[0].offsetHeight;
                up=up-height;
            $wrapper.css('transform',`translateY(${up}px)`)
        }
        if(step>=total-1){
            clearInterval(autotimer);
            closeMessage()
        }
    }

    //手动发送
    let handleSend=function handleSend() {
        $keyboard.css({
                transform:'translateY(0rem)'
            }).one('transitionend',()=>{
            let str='我想一下今天怎么这么热',
                strTimer=null,
                n=-1;
            strTimer=setInterval(function () {
                let orgHtml=$textInp.html();
                $textInp.html(orgHtml+str[++n])
                if(n==str.length-1){
                    clearInterval(strTimer);
                    $submit.css('display','block')
                }
            },100);
        });
    }

    //点击submit提交
    let handleSubmit=function handleSubmit() {
        $(`<li class="self">
            <i class="arrow"></i>
            <img src="img/osh.jpg" alt="" class="pic">
            ${$textInp.html()}
        </li>`).insertAfter($li.eq(1)).addClass('active');
        $li=$wrapper.find('li')

        $textInp.html('');
        $submit.css('display','none')
        $keyboard.css('transform', 'translateY(3.7rem)')

        //继续向下展示剩余的信息
        autotimer=setInterval(messageShow,interval)
    }

    let closeMessage=function closeMessage() {
        let closeTimer=setTimeout(()=>{
            $music.pause();
            $music.remove();
            clearTimeout(closeTimer);
        },interval)

    }

    return {
        init:function () {
           messageShow();
           //间隔inteval在展示信息
           autotimer=setInterval(messageShow,interval);
           $submit.tap(handleSubmit);


        }
    }
})()

renderLoading.init();
/*let url=window.location.href;
let hashCode=url.split('#')[1];
switch(hashCode){
    case 'loading':
       renderLoading.init();
       break;
    case 'phone':
       renderPhone.init();
       break;
    case 'message':
        renderMessage.init();
        break;
}*/
