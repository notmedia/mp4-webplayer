# mp4-webplayer
Streaming .mp4 (h264, aac) videos 

The problem is that the original .mp4 can't be played until we not get all file. 

# Explainig

Structure of original .mp4 file: 
```
___________
|moov|mdat|
-----------
```

moov - metadata (timestamp, video duration, codecs etc..)  
mdat - video  

The browser can get chunks of file, but can't play them because they need 'moov' for every chunk. Also, there is a problem with live streaming mp4 video, because in moov file we have info about the all video duration. 

So.. 

We need to do fragmented mp4 streaming (MPEG-DASH). 

Structure of fragmented .mp4 file: 
```

  initial     fragment1    fragment2    fragment3 
___________  ___________  ___________  ___________
|   moov  |  |moof|mdat|  |moof|mdat|  |moof|mdat|
-----------  -----------  -----------  -----------
```

moov - general data (codecs, vide chunks size etc..)   
moof - metada of current video fragment  
mdat - video fragment  

For this way, fragment original mp4 videos using [MP4Box](https://gpac.wp.imt.fr/2012/02/01/dash-support/) 

```
sudo apt-get install gpac

MP4Box -dash 1000 file.mp4
```

1000 - means that one video fragment duration is 1 second. 
Output would be file_dashinit.mp4 and file_dash.mpd 

file_dashinit.mp4 - fragmented mp4 video.  
file_dash.mpd - xml document containing indormation about video segments  

# Requirements
Browser should support [Media Source Extensions API](https://www.w3.org/TR/media-source/) 

Now, we can stream static mp4 videos and go live. 


# Instalation

```
cd mp4-webplayer
npm install
bower install
gulp build 
node dist/app.js
```

App runs on port 8080 
