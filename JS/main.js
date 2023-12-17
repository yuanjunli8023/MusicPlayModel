// 保存音乐信息列表
    let musicList=[]
    // 声明变量，保存当前播放的是哪一首歌曲
    let currentIndex = 0//默认第一首
    // 加载音乐列表信息
    $.ajax({
        type:"GET",
        url:"../JS/music.json",//这里使用的是本地路径，可以改成自己的接口
        dataType:"json",
        success:function (data){
        musicList = data
        //通过得到的数据对页面和列表进行渲染
        render(musicList[currentIndex])
        renderMusicList(musicList)
        },
    // error:function (){
    // console.log('出错啦！！')
    // },
    })
    //给上一首按钮绑定点击事件
    $(".Previous").on("click",function (){
        if (currentIndex>0){
            currentIndex--
        }
        else {
            currentIndex = musicList.length - 1
        }

        //重新渲染歌曲信息
        render(musicList[currentIndex])
        // 让音乐播放
        $(".Switch i").trigger("click")
    })
    //给下一首按钮绑定点击事件
    $(".Next").on("click",function (){
        if (currentIndex < musicList.length-1){
            currentIndex++
        }
        else {
            currentIndex = 0
        }

        //重新渲染歌曲信息
        render(musicList[currentIndex])
        // 让音乐播放
        $(".Switch i").trigger("click")
    })
    // 给播放按钮绑定事件
    $(".Switch i").on("click",function () {
        if ($("audio").get(0).paused){
         //暂停状态，点击播放
         //修改按钮图标
         $(this).removeClass("icon-kaishi").addClass("icon-zanting")
         //让音乐播放
         $("audio").get(0).play()
            console.log($("audio").src)
            //让封面旋转起来
         $(".song").css({
             "animation-play-state":'running'
         })
        }
        else{
            //播放状态，点击暂停
            $(this).removeClass("icon-zanting").addClass("icon-kaishi")
            //让音乐暂停
            $("audio").get(0).pause()

            //让封面旋转停止
            $(".song").css({
                "animation-play-state":'paused'
            })
        }
        //重新渲染列表数据
        renderMusicList(musicList)
    })
    //监听audio标签的time update事件
    $("audio").on("timeupdate",function (){
        //获取音乐当前的时间 单位 秒
        let currentTime = $("audio").get(0).currentTime
        //获取音乐总时长
        let duration = $("audio").get(0).duration
        //设置当前播放时间
        $(".current-time").text(formatTime(currentTime))
        //设置音乐总时长
        $(".time").text(formatTime(duration))
        //设置进度条
        let value = (currentTime / duration) * 100
        $(".music-progress-line").css({
            width:value+"%",
        })

    })
    //格式化时间
    function formatTime(time){
        let min = parseInt(time / 60)//取整
        let sec = parseInt(time % 60)
        min = min < 10 ? "0" + min : min
        sec = sec < 10 ? "0" + sec : sec
        return `${min}:${sec}`

    }
    //监听音乐播放完毕事件
    $("audio").on("ended",function (){
        $(".Switch i").removeClass("icon-zanting").addClass("icon-kaishi")
        $(".song").css({
            "animation-play-state":"paused"
        })
    })
    //通过事件委托给音乐列表的播放按钮绑定点击事件
    $(".box-wrapper").on("click",".iconfont",function (){
        if ($(this).hasClass("icon-kaishi")){
            //  重新渲染切换歌曲
            let index = $(this).attr("data-index")
            currentIndex = index
            render(musicList[currentIndex])
            $(".Switch i").trigger("click")
        }
       else {
           $(".Switch i").trigger("click")
        }
    })
    //给音量按钮绑定点击事件
    $(".Volume").on("click",function (){
        console.log("Volume")
    })
    //给歌单按钮绑定点击事件
    $(".List").on("click",function (){
        $(".music-list").css({
                display:"block"
            })

    })
    //关闭歌单列表点击事件绑定
    $(".close").on("click",function () {
        $(".music-list").css({
            display:"none"
        })
    })
    //根据音乐列表数据 创建列表 更改接口后记得更改属性名 ——> ${item.name}
    function renderMusicList(list){
        $(".box-wrapper").empty()
        $.each(list,function (index,item) {//遍历list 回调函数
            let $li = $(`
                 <ul>
                       <li class="${index == currentIndex ? "playing" : ""}">
                           <i>0${index+1}.${item.name}</i>
                           <i data-index="${index}" class="iconfont ${index == currentIndex && !$("audio").get(0).paused ? "icon-zanting":"icon-kaishi"} "></i>
                       </li>
                   </ul>
            `)
            $(".box-wrapper").append($li)
        })
    }
    // 根据信息，设置页面中对应标签中的内容 更改接口后记得更改属性名
    function render(data){
    $(".name").text(data.name)
    $(".album-singer").text(data.album)
    $(".time").text(data.time)
    $(".song img").attr("src",data.cover)
    $("audio").attr("src",data.audio_url)

}
