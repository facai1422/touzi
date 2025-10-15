'use client'

import Link from 'next/link'

export default function DiscoverPage() {
  return (
    <div className="discover-page">
      {/* 头部 */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <span>发现</span>
          </div>
        </div>
      </div>

      {/* 网页容器 */}
      <div className="web-container">
        <iframe 
          className="web-iframe"
          sandbox="allow-popups allow-top-navigation-by-user-activation allow-scripts allow-modals allow-popups allow-downloads allow-pointer-lock allow-presentation"
          allow="fullscreen; camera; microphone; geolocation"
          referrerPolicy="no-referrer"
          srcDoc={`
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=9">
            <title>北京世桥生物制药有限公司</title>
            <meta name="keywords" content="北京世桥生物制药有限公司">
            <meta name="description" content="北京世桥生物制药有限公司">
            <style>
              body,p,dl,ul,li,pre,button,input{margin:0;padding:0;word-wrap:break-word}
              body,html,input{font:12px/1.5 tahoma,arial,宋体,sans-serif}
              pre{white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word}
              img{vertical-align:middle}
              a:hover{text-decoration:underline}
            </style>
            <style>
              *{padding:0px;margin:0px}
              body{font-size:12px;font-family:microsoft yahei;background:url(data:,)repeat-x #fff!important}
              img{border:none}
              a{text-decoration:none;color:#333}
              a:hover{text-decoration:none;color:#000}
              ul,li{list-style:none}
              input,button{font-size:12px;vertical-align:middle}
              .banner{height:auto;width:100%;position:relative;z-index:999;text-align:center}
              .slides:after{content:".";display:block;clear:both;visibility:hidden;line-height:0;height:0}
              html[xmlns] .slides{display:block}
              .flexslider{position:relative;zoom:1;z-index:0}
              .flexslider .slides{zoom:1}
              .index{overflow:Hidden;width:1200px;margin:0px auto 20px}
              .left{width:600px;float:right;padding-top:20px;min-height:250px}
              .right{width:580px;float:left;padding-right:20px;min-height:250px;padding-top:20px}
              .tit{height:46px;line-height:46px;margin-bottom:15px;color:#aaa;font-size:16px}
              .tit strong{padding:10px 0px;font-size:22px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAECAIAAAABPYjBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkQ3MTQ0MUUzREYwMTFFNzgxNjZEQzMyMkIyRjY1NTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkQ3MTQ0MUYzREYwMTFFNzgxNjZEQzMyMkIyRjY1NTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2RDcxNDQxQzNERjAxMUU3ODE2NkRDMzIyQjJGNjU1MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2RDcxNDQxRDNERjAxMUU3ODE2NkRDMzIyQjJGNjU1MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjzS7sQAAAAYSURBVHjaYnTpOsVALmBioAAMnGaAAAMAhf0BoAmEG2YAAAAASUVORK5CYII=)no-repeat left bottom;color:#448aca;margin:0 5px}
              .tit span{float:right;margin-right:5px;margin-top:15px}
              .left .leftbody{padding:5px;overflow:hidden;font-family:microsoft yahei;font-size:14px;line-height:26px;background:#01a0f0;height:205px}
              .left .leftbody img{margin-right:10px}
              .left .leftbody p{font-size:14px;line-height:22px;color:#fff}
              .left .gd{color:#047ab3;padding:0 5px;display:block;width:40px;font-size:14px;text-align:center;line-height:20px}
              .video{float:left;margin-right:10px}
              .video video{background:#000}
              .right .gd{color:#047ab3;padding:0 5px;display:block;width:40px;font-size:14px;text-align:center;line-height:20px}
              .right .pp{overflow:hidden}
              .right .pp li{padding:0 5px;overflow:hidden;font-size:14px}
              .right .pp li p{color:#666;padding:0 5px;line-height:24px;font-size:12px}
              .lanmu{overflow:hidden;width:1200px;margin:0 auto}
              .lanmu ul{width:1400px}
              .lanmu li{margin:20px 40px 20px 0;width:350px;float:left;border:1px #ededed solid;background:#f7f7f7;padding:10px}
              .lanmu li img{float:left;margin-right:10px}
              .lanmu li strong{font-size:16px;margin-bottom:10px;display:inline-block}
              .lanmu li pre{font-family:microsoft yahei;line-height:22px;font-size:14px}
              .hezuo{width:100%;height:46px;line-height:46px;text-align:center;background:#616161;color:#fff;font-size:14px}
              .hezuo a{margin:0 15px;color:#fff}
              @media (max-width:800px){
                .mmhead{padding:5%0 3%0;background:#f0efeb;overflow:hidden;border-bottom:3px #aaa solid}
                .mmlogo{float:left;width:20%}
                .mmlogo img{width:100%;height:auto}
                .mmcaidan{float:right;width:10%;padding-top:1.3%}
                #mmdl{position:absolute;width:30%;overflow:hidden;background:#888;right:0;text-align:center;line-height:2.5em;font-size:14px;top:13%;border-radius:5%;z-index:99999}
                .left{width:100%}
                .right{width:100%}
                .index{width:100%}
                .lanmu{width:100%;height:auto}
                .video{float:none;width:100%;text-align:center}
                .video video{margin:10px auto}
                .left .leftbody{height:auto;padding:10px;background:none;color:#666;border-bottom:1px #ccc solid}
                .left .leftbody p{color:#666}
                .left .leftbody p img{float:none!important;margin:0 auto;width:98%}
                .lanmu ul{width:100%}
                .lanmu li{margin:5px auto;width:90%;float:none;overflow:hidden}
                .hezuo{height:auto;overflow:hidden;line-height:22px;padding:10px 0}
              }
              @media (max-width:800px){}
              @media (min-width:801px){.mmhead{display:none}}
            </style>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
            </head>
            <body>
              <div class="head" style="display:none"></div>
              <div class="mmhead">
                <div class="mmlogo">
                  <a href="https://shiqiao.gzbxwt.com/h5/static/shiqiao/index.html">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAYAAAB/xl1SAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RERFRENEQjQzREQ4MTFFNzgzQzZDRUUzRjJCRUJFNEIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RERFRENEQjUzREQ4MTFFNzgzQzZDRUUzRjJCRUJFNEIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEREVEQ0RCMjNERDgxMUU3ODNDNkNFRTNGMkJFQkU0QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEREVEQ0RCMzNERDgxMUU3ODNDNkNFRTNGMkJFQkU0QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pgf887cAACieSURBVHja7F0HfFRV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">
                  </a>
                </div>
                <div class="mmcaidan">
                  <ul>
                    <li>
                      <a href="javascript:void(0)">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAaCAYAAABGiCfwAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUFFQ0JFQzY3OTdDMTFFNkE2NTBCNzBEQkNEMTVBNjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUFFQ0JFQzc3OTdDMTFFNkE2NTBCNzBEQkNEMTVBNjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQUVDQkVDNDc5N0MxMUU2QTY1MEI3MERCQ0QxNUE2MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQUVDQkVDNTc5N0MxMUU2QTY1MEI3MERCQ0QxNUE2MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pmz6YFMAAABcSURBVHjaYrSwsPBkYGCYC8SSDLQDz4E4mYkOFjFAzZ/LxEA/wAiyLAWIX9DYoqegYGT8//8/3bxGz2ActWzUMvyAxdLScrS4Gi2uRvPZqGWjxdVocUWD4gogwABOPRsMhAUwrgAAAABJRU5ErkJggg==">
                      </a>
                      <dl id="mmdl" style="display:none"></dl>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="banner">
                <div class="flexslider">
                  <div class="slides">
                    <div class="slide">
                      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" alt="轮播图">
                    </div>
                  </div>
                </div>
              </div>
              <div class="index">
                <div class="left">
                  <div class="leftbody">
                    <h3>公司简介</h3>
                    <p>北京世桥生物制药有限公司是一家专业从事生物制药研发、生产和销售的高新技术企业。</p>
                  </div>
                </div>
                <div class="right">
                  <div class="tit">
                    <strong>最新动态</strong>
                    <span>更多</span>
                  </div>
                  <div class="pp">
                    <ul>
                      <li>
                        <p>公司获得国家高新技术企业认证</p>
                      </li>
                      <li>
                        <p>新产品研发取得重大突破</p>
                      </li>
                      <li>
                        <p>与知名医院建立战略合作关系</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="lanmu">
                <ul>
                  <li>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" alt="产品">
                    <strong>产品展示</strong>
                    <pre>我们提供多种生物制药产品，包括疫苗、抗体药物等。</pre>
                  </li>
                  <li>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" alt="研发">
                    <strong>研发实力</strong>
                    <pre>拥有强大的研发团队和先进的实验设备。</pre>
                  </li>
                  <li>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" alt="合作">
                    <strong>合作共赢</strong>
                    <pre>与多家知名企业和科研院所建立合作关系。</pre>
                  </li>
                </ul>
              </div>
              <div class="hezuo">
                <a href="#">联系我们</a>
                <a href="#">人才招聘</a>
                <a href="#">投资者关系</a>
              </div>
            </body>
            </html>
          `}
        />
      </div>

      {/* 底部导航 */}
      <nav style={{position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTop: '1px solid #e5e7eb'}}>
        <div style={{display: 'flex'}}>
          <Link href="/" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3.172l8 6.4V20a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5H10v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-10l8-6.4zM12 1l-10 8v1.5a1 1 0 002 0V10l8-6.4L20 10v.5a1 1 0 002 0V9L12 1z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>首页</span>
          </Link>
          <Link href="/products" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>研发产品</span>
          </Link>
          <Link href="/orders" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>我的项目</span>
          </Link>
          <Link href="/discover" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#ef4444'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>发现</span>
          </Link>
          <Link href="/profile" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>账户</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}