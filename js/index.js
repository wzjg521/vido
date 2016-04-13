$(function() {
	var pageIndex = 0;
	var dropload = $('.video_wrap').dropload({
	    loadUpFn : function(){
	    	pageIndex = 0;
	        loadData();
	    },
	    loadDownFn : function(){
	        loadData();
	    }
	});

	//点赞事件
	$(document.body).bind("touchend", function(e) {
        clickComment(e);
		shareAt(e);
		clickLike(e);
        if($('#share').css('display') == 'block') {
            cancelLike(e);
        }
	});

    //评论功能跳转
    function clickComment(e) {
        var parentDom = e.target.parentNode;
        if(parentDom.className == "handle_list commit_num") {
            window.location.href = './detail.html';
        }
    }

	//分享功能
	function shareAt(e) {
    	var parentDom = e.target.parentNode;
    	if(parentDom.className == "handle_list share_num") {
	    	var shareDialog = $('#share');
	    	shareDialog.show();
            setTimeout(function() {
                shareDialog.addClass('show_dialog');
            }, 50);
	    	
	    }
	}
    //取消分享
    function cancelLike(e) {
        var shareDialog = $('#share');
        if(e.target.className == "share_btn") {
            shareDialog.removeClass('show_dialog');
            setTimeout(function() {
                shareDialog.hide();
            }, 200);
            
        } else if($(e.target).parents('#share').length == 0 && 
            e.target.parentNode.className != "handle_list share_num" ) {
            shareDialog.removeClass('show_dialog');
            setTimeout(function() {
                shareDialog.hide();
            }, 200);
        }
    }

    //点赞功能函数
    function clickLike(e) {
    	var parentDom = e.target.parentNode;
    	if(parentDom.className == "handle_list good_num") {
	    	var goodCount = $(parentDom).find('.video_count');
	    	var videoid = $(parentDom).parent('.handle_info').attr('videoId');
	    	//发送点赞的视频id给后端
	    	// $.ajax({
		    //   type: 'post',
		    //   url: 'http://send.good.num',
		    //   data: {
		    //     user: 'hua', //用户名称，或者uId
		    //     videoId: videoid //此用户点赞的视频Id
		    //   }
		    // })

		    $(parentDom).addClass('active');
		    goodCount.html(parseInt(goodCount.html()) + 1);
	    }
    }

	//请求列表页数据
	function loadData() {
        $.ajax({
            type: 'GET',
            data: {page:pageIndex},
            url: 'http://wzjg521.github.io/json/more3.json',
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
                            $('.video_box').html(result);
                        } else {
                            $('.video_box').append(result);
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

	//创建列表页面的DOM元素
	function createListDom(data) {
		var listHtml = '<div class="video_list">'
        	+'<div class="user_info">'
        		+'<div class="user_face"><img src="'+ data.avatar +'" alt=""></div>'
        		+'<div class="user_dec">'
        			+'<div class="user_name">'+ data.username +'</div>'
        			+'<div class="user_address">'+ data.address +'</div>'
        		+'</div>'
        	+'</div>'
        	+'<div class="video_live" videoId="'+ data.videoId +'">'
        		+'<video class="video_area" controls preload="none" width="100%" height="214" '
        	+'poster="'+ data.videoImg +'">'
        			+' <source src="'+ data.videoSource +'">'
        		+'</video>'
        	+' </div>'
        	+'<div class="video_info">'
        		+'<div class="video_title">'+ data.videoTitle +'</div>'
        		+'<div class="video_content">'+ data.videoDec +'</div>'
        	+' </div>'
        	+' <div class="handle_info" videoId="'+ data.videoId +'">'
        		+'<div class="handle_list share_num">'
        			+'<i class="vido_icon share"></i>'
        			+'<span class="video_count">'+ data.shareCount +'</span>'        
            	+'</div>'
        		+'<div class="handle_list commit_num">'
        			+'<i class="vido_icon commit"></i>'
        			+'<span class="video_count">'+ data.commentCount +'</span>'
        		+'</div>'
        		+'<div class="handle_list good_num">'
        			+'<i class="vido_icon good"></i>'
        			+'<i class="vido_icon plus_icon"></i>'
        			+'<span class="video_count">'+ data.lickCount +'</span>'
        		+'</div>'
        	+'</div>'
        	+'<div class="line"></div>'
        +'</div>';

        return listHtml;
	}

})



