/**
 * Created by wungcq on 15/5/25.
 */
(function getNews(){
    var url = "/records?limit=10";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == '4' && xhr.status == "200") {
            var res = JSON.parse(xhr.responseText);
            res = res.list;
            if(res.length > 0){
                for(var i in res) {
                    var record = res[i];
                    var date = new Date(record.createdAt);
                    var timeStr = date.getMonth()+1+'/'+date.getDate();
                    var newsBlock = document.getElementById("news-block");
                    var node = '';
                    var parent = document.getElementById(record.category+'-block');


                    node = [
                        '<div class="' + (i === '0' ? 'first' : '') + '">',
                            (function(){
                                var img = record.images[0];
                                var str = '';
                                if (parent.children.length === 1) {
                                    str = '<img src="' + (record.images[0] && record.images[0].url || '/statics/images/bg1.jpg') + '" class="img">';
                                } else {
                                    str = '';    
                                }
                                return str;
                            })(),
                            (function(){
                                if (parent.children.length === 1) {
                                    return ('<time class="time">' + timeStr + '</time>'+
                                    '<a href="/' + record.category + '/' + record._id + '" class="link">' + record.title + '</a>');
                                }
                                else{
                                    return(
                            '<a href="/' + record.category + '/' + record._id + '" class="a">' +'<time class="time">' + timeStr + '</time>'+ (record.title) + '</a>'
                                    )
                                }
                            })(),
                            '</div>'
                    ];

                    parent.innerHTML += node.join('' );

                
                }
            }
        }
    };
    xhr.open('get',url);
    xhr.send('{"limit":"10"}');
})();
(function () {
    var leftNav = document.querySelectorAll(".main .left-nav")[ 0 ];
    leftNav.addEventListener("click", function (e) {
        var _target = e.target;
        if (_target.classList.contains("item")) {
            var activeTabNav = document.querySelector(".main .left-nav .item.active");
            activeTabNav.classList.remove("active");
            _target.classList.add("active");
        }
    });
})();
(function () {
    var arg = {
        tips: [ "中法十年院庆", "图2", "图3", "注解4" ],
        picSrc: [ "/statics/images/logo10.jpg", "/statics/images/2.jpg", "/statics/images/3.jpg", "/statics/images/4.jpg" ],
        href: [ "#1", "#2", "#3", "#4" ],
        navColor: [ "#051247", "#FFF1FFF", "#B60017", "#B4B4B4" ]
    };
    var imgs = document.querySelectorAll(".pic-round .pic-wrapper .img");
    var navs = document.querySelectorAll(".pic-round .pic-wrapper .pic-nav");
    var pagenum = arg.tips.length;
    for (var i = 0; i < pagenum; i++) {
        imgs[ i ].style[ "background-image" ] = "url(\"" + arg.picSrc[ i ] + "\")";
        imgs[ i ].href = arg.href[ i ];
        imgs[ i ].getElementsByClassName("tip")[ 0 ].innerHTML = arg.tips[ i ];
//              navs[ i ].style[ "background-color" ] = arg.navColor[ i ];
        navs[ i ].style[ "background-image" ] = "url(\"" + arg.picSrc[ i ] + "\")";
//              navs[i].setAttribute("data-id",i);
    }
    var num = 0;

    var t = setInterval(function () {
        document.querySelector(".pic-round .pic-wrapper .pic-nav.active").classList.remove("active");
        document.querySelectorAll(".pic-round .pic-wrapper .pic-nav")[ num ].classList.add("active");
        num = (num + 1) % pagenum;
    }, 3000);

    var picRound = document.getElementsByClassName("pic-round")[ 0 ];
    console.log(picRound);
    picRound.addEventListener("click", function (e) {
        var _target = e.target;
        if (_target.classList.contains("pic-nav")) {
            var current = _target.getAttribute("data-id");
            document.querySelector(".pic-round .pic-wrapper .pic-nav.active").classList.remove("active");
            _target.classList.add("active");
            num = (current + 1) % pagenum;
        }
    });
})();