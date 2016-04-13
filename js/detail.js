$(function() {
	var pageIndex = 0;
	var dropload = $('.comment_list').dropload({
	    loadDownFn : function(me){
	        loadData(me);
	    }
	});

    $(".video_area")[0].play();

    //发送评论
    $(document.body).bind("touchend", function(e) {
        sendComment(e);
    });

    //评论
    function sendComment(e) {
        var parentDom = e.target.parentNode;
        if(parentDom.id == "send" || e.target.id == "send") {
            var comment = $('#add_comment').val();
            if(comment == '') {
                alert('请输入你的评论');
            } else {
                addComment(comment);
                $('.comment_list').scrollTop(0);
                //发送评论给后端
                // $.ajax({
                //   type: 'post',
                //   url: 'http://send.comment',
                //   data: {
                //     user: 'hua', //用户名称，或者uId
                //     videoId: videoid, //此用户点赞的视频Id
                //     comment: '评论评论这是一条评论'
                //   }
                // })
            }
        }
    }

    //在列表的头部增加新的评论
    function addComment(comment) {
        var data = {
            "avatar" : "./images/avaster.jpg",
            "username" : "huahua",
            "commentTime" : "2016-4-2 10:30",
            "commentContent" : comment
        }
        var newHtml = createListDom(data);
        $('.list_con').prepend(newHtml);

    }

	//请求列表页数据
	function loadData(me) {
        $.ajax({
            type: 'GET',
            data: {page:pageIndex,videoid:1234},
            url: 'http://wzjg521.github.io/json/more2.json',
            dataType: 'json',
            success: function(data){
            	if(data) {
                    if(data.total + 1 == pageIndex) {
                        dropload.noData(true);
                    } else {
                        var result = '';
                        $.each(data.list,function(index,item) {
                            result += createListDom(item);
                        });
                        if(pageIndex == 0) {
                            $('.list_con').html(result);
                        } else {
                            $('.list_con').append(result);
                        }
                        pageIndex++; 
                    }
                    dropload.resetload();
            	} else {
            		alert('哎呀，网络出错了！');
            	}
            }
        });
	}

	//创建评论列表页面的DOM元素
	function createListDom(data) {      
		var listHtml = '<li>'
            		+'<div class="user_face"><img src="'+ data.avatar +'" alt="Lan Lan"></div>'
            		+'<div class="comment_content">'
            			+'<div class="user_name">'+ data.username +'</div>'
            			+'<div class="comment_time">'+ data.commentTime +'</div>'
                        +'<div class="user_comment">'+ data.commentContent +'</div>'
            		+'</div>'
                +'</li>';

        return listHtml;
	}

})



