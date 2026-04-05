
// --- DATA CONFIGURATION ---
const highlights = [
    { 
        name: "Breakup", 
        cover: "insta/H/h (2).png", 
        song: "insta/H/break.mp3", // <--- Add the path to your song here
        items: [{ type: "video", src: "insta/H/Break.mp4" }] 
    },
    { 
        name: "Ca", 
        cover: "insta/H/h (3).png", 
        song: "insta/H/ca.mp3", 
        items: [{ type: "video", src: "insta/H/Ca-Edit.mp4" }] 
    },
    { 
        name: "Memories", 
        cover: "insta/H/h (4).png", 
        song: "insta/H/i.mp3", 
        items: [{ type: "video", src: "insta/H/Images.mp4" }] 
    },
    { 
        name: "Lost", 
        cover: "insta/H/h (5).png", 
        song: "insta/H/l.mp3", 
        items: [{ type: "video", src: "insta/H/Lost.mp4" }] 
    },
    { 
        name: "Rides", 
        cover: "insta/H/h (1).png", 
        song: "insta/H/r.mp3", 
        items: [{ type: "video", src: "insta/H/wild.mp4" }] 
    }
];
// POSTS DATA
// ✅ POSTS (AUTO MUSIC FROM FOLDER)
const posts = [
  { type: "image", src: "insta/Posts/Post 1/i.png" },

  
  {
    type: "multi",
    folder: "insta/Posts/Post 2/",
    images: ["i1.png","i2.png"]
  },
   { type: "image", src: "insta/Posts/Post 3/i1.png" },

  { type: "video", src: "insta/Posts/Post 4/video.mp4" },
   { type: "video", src: "insta/Posts/Post 5/Post5.mp4" },
    { type: "video", src: "insta/Posts/Post 6/Post6.mp4" },
     { type: "video", src: "insta/Posts/Post 7/post7.mp4" },
      { type: "video", src: "insta/Posts/Post 8/video.mp4" },
      {
    type: "multi",
    folder: "insta/Posts/Post 9/",
    images: ["i1.png","i2.png","i3.png"]
  },
        { type: "video", src: "insta/Posts/Post 10/video.mp4" },
         {
    type: "multi",
    folder: "insta/Posts/Post 11/",
    images: ["i (1).png","i (2).png","i (3).png",
        "i (4).png","i (5).png","i (6).png",
        "i (7).png","i (8).png","i (9).png",
        "i (10).png","i (11).png"
    ]
  },
    { type: "video", src: "insta/Posts/Post 12/video.mp4" },
  {
    type: "multi",
    folder: "insta/Posts/Post 13/",
    images: ["i1.png","i2.png","i3.png","i4.png"]
  },
   {
    type: "multi",
    folder: "insta/Posts/Post 14/",
    images: ["i1.png","i2.png"]
  },
    {
    type: "multi",
    folder: "insta/Posts/Post 15/",
    images: ["i1.png","i2.png","i3.png"]
  },
  {
    type: "multi",
    folder: "insta/Posts/Post 16/",
    images: ["i1.png","i2.png","i3.png","i4.png"]
  },
 {
    type: "multi",
    folder: "insta/Posts/Post 17/",
    images: ["i1.png","i2.png"]
  },
  
    { type: "video", src: "insta/Posts/Post 18/Masked.mp4" },
    {
    type: "multi",
    folder: "insta/Posts/Post 19/",
    images: ["i1.png","i2.png","i3.png","i4.png","i5.png","i6.png","i7.png"]
  },
{
  type: "multiVideo",
  folder: "insta/Posts/Post 20/",
  cover: "i1.png", 
  videos: ["v1.mp4", "v2.mp4"]
},
      { type: "video", src: "insta/Posts/Post 21/Video21.mp4" },
      { type: "video", src: "insta/Posts/Post 22/Video22.mp4" },
      { type: "video", src: "insta/Posts/Post 23/Video.mp4" },
      { type: "video", src: "insta/Posts/Post 24/video.mp4" },
      { type: "video", src: "insta/Posts/Post 25/Video.mp4" },
      { type: "video", src: "insta/Posts/Post 26/video.mp4" },
      { type: "video", src: "insta/Posts/Post 27/Video.mp4" },
      { type: "video", src: "insta/Posts/Post 28/Transition.mp4" },
      { type: "video", src: "insta/Posts/Post 29/Particles.mp4" },
      { type: "video", src: "insta/Posts/post 30/Diwali.mp4" },
      { type: "image", src: "insta/F/30/kurta.jpeg" },
       { type: "image", src: "insta/F/31/Brahmin.jpeg" },
       { type: "image", src: "insta/F/32/MN.jpeg" },
       { type: "image", src: "insta/F/33/Raja.jpeg" },
        {
    type: "multi",
    folder: "insta/F/34/",
    images: ["1.jpeg","2.jpeg","3.jpeg"]
  },
       { type: "image", src: "insta/F/5C/35/russia.jpg" },
        { type: "image", src: "insta/F/5C/36/dubai.jpg" },
         { type: "image", src: "insta/F/5C/37/bali.jpg" },
          { type: "image", src: "insta/F/5C/38/vietnam.jpg" },
           { type: "image", src: "insta/F/5C/39/thai.jpg" },
            { type: "image", src: "insta/F/E/40/ride.jpg" },
             { type: "image", src: "insta/F/E/41/bunjee.jpg" },
              { type: "image", src: "insta/F/E/42/scuba.jpg" },
               { type: "image", src: "insta/F/E/43/para.jpg" },
 { type: "image", src: "insta/F/E/44/wing.jpg" },
  { type: "image", src: "insta/F/E/45/yatch.jpg" },
];

// --- RENDER HIGHLIGHTS ---
const hContainer = document.getElementById("highlightsContainer");
highlights.forEach((h, idx) => {
    const div = document.createElement("div");
    div.className = "flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer";
    div.innerHTML = `
        <div class="w-20 h-20 rounded-full border border-gray-300 p-1 bg-white">
            <img src="${h.cover}" class="w-full h-full rounded-full object-cover">
        </div>
        <span class="text-xs font-semibold">${h.name}</span>
    `;
    div.onclick = () => openStories(idx);
    hContainer.appendChild(div);
});

// --- RENDER POSTS ---
const postsContainer = document.getElementById("posts");
posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "aspect-square cursor-pointer relative group overflow-hidden bg-gray-100";

    let thumb = "";
    if (post.type === "image" || post.type === "video") {
        thumb = post.src;
    } else if (post.type === "multi") {
        thumb = post.folder + post.images[0];
    } else if (post.type === "multiVideo") {
        thumb = post.cover ? post.folder + post.cover : post.folder + post.videos[0];
    }

    const isVideoThumb = post.type === "video" || (post.type === "multiVideo" && !post.cover);

    div.innerHTML = `
        ${isVideoThumb 
        ? `<video src="${thumb}" class="w-full h-full object-cover" muted autoplay loop playsinline></video>` 
        : `<img src="${thumb}" class="w-full h-full object-cover">`}
        
        <div class="absolute top-2 right-2 text-white drop-shadow-md">
            ${post.type === 'multiVideo' ? '<i class="fa-solid fa-clone text-xs"></i>' : ''}
        </div>

        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white gap-4 transition-opacity font-bold">
            <span><i class="fa-solid fa-heart"></i> 14k</span>
            <span><i class="fa-solid fa-comment"></i> 203</span>
        </div>
    `;

    // ✅ DOUBLE TAP LIKE ❤️
    div.addEventListener("dblclick", () => {
        const heart = document.createElement("div");
        heart.innerHTML = "❤️";
        heart.className = "absolute text-5xl animate-ping";
        div.appendChild(heart);
        setTimeout(() => heart.remove(), 800);
    });

    div.onclick = () => openPost(post);
    postsContainer.appendChild(div);
});

// --- AUDIO CORE ---
let activeAudio = null;

async function playFolderMusic(folder) {
    try {
        if (activeAudio) {
            activeAudio.pause();
            activeAudio = null;
        }

        const audio = new Audio(folder + "song.mp3");
        audio.loop = true;
        audio.preload = "auto";

        await audio.play();
        activeAudio = audio;
        return true;

    } catch {
        return false;
    }
}

// --- STORIES ---
let storyIdx = 0;
let storyItemIdx = 0;
let storyTimer = null;
let activeStoryAudio = null;

document.addEventListener('click', function() {
    if (activeStoryAudio) activeStoryAudio.play().catch(() => {});
}, { once: false });

function openStories(hIndex) {
    storyIdx = hIndex;
    storyItemIdx = 0;

    if (activeStoryAudio) {
        activeStoryAudio.pause();
        activeStoryAudio = null;
    }

    const highlight = highlights[hIndex];
    if (highlight.song) {
        activeStoryAudio = new Audio(highlight.song);
        activeStoryAudio.loop = true;
        activeStoryAudio.play().catch(() => {});
    }

    document.getElementById("storyModal").classList.remove("hidden");
    showStoryItem();
}

function showStoryItem() {
    clearTimeout(storyTimer);

    const item = highlights[storyIdx].items[storyItemIdx];
    const img = document.getElementById("storyImage");
    const vid = document.getElementById("storyVideo");
    const progBox = document.getElementById("storyProgressContainer");

    img.classList.add("hidden");
    vid.classList.add("hidden");
    progBox.innerHTML = "";

    highlights[storyIdx].items.forEach((_, i) => {
        const bar = document.createElement("div");
        bar.className = "progress-bar";
        bar.innerHTML = `<div class="progress-fill" id="fill-${i}"></div>`;
        progBox.appendChild(bar);
    });

    const fill = document.getElementById(`fill-${storyItemIdx}`);

    if(item.type === "video") {
        vid.src = item.src;
        vid.classList.remove("hidden");

        // ✅ FIXED STORY VIDEO PLAY
        vid.muted = true;
        vid.playsInline = true;
        vid.currentTime = 0;
        vid.play().catch(() => {});

        vid.onloadedmetadata = () => {
            const duration = vid.duration * 1000;
            fill.style.transitionDuration = duration + "ms";
            setTimeout(() => fill.style.width = "100%", 50);
            storyTimer = setTimeout(nextStory, duration);
        };
    } else {
        img.src = item.src;
        img.classList.remove("hidden");

        fill.style.transitionDuration = "5000ms";
        setTimeout(() => fill.style.width = "100%", 50);
        storyTimer = setTimeout(nextStory, 5000);
    }
}

function nextStory() {
    if(storyItemIdx < highlights[storyIdx].items.length - 1) {
        storyItemIdx++;
        showStoryItem();
    } else closeStories();
}

function closeStories() {
    const vid = document.getElementById("storyVideo");
    vid.pause();
    vid.src = "";

    if (activeStoryAudio) {
        activeStoryAudio.pause();
        activeStoryAudio = null;
    }

    document.getElementById("storyModal").classList.add("hidden");
    clearTimeout(storyTimer);
}

// --- POST MODAL ---
let carouselIdx = 0;

async function openPost(post) {
    const modal = document.getElementById("postModal");
    const img = document.getElementById("postImage");
    const vid = document.getElementById("postVideo");

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    img.classList.add("hidden");
    vid.classList.add("hidden");

    const folder = post.folder || "";
    const musicPlaying = await playFolderMusic(folder);

    if (post.type === "video") {
        vid.src = post.src;
        vid.classList.remove("hidden");

        // ✅ BIG VIDEO FIX
        vid.muted = true;
        vid.autoplay = true;
        vid.loop = true;
        vid.playsInline = true;

        vid.play().catch(() => {});
    } 
    else if (post.type === "image") {
        img.src = post.src;
        img.classList.remove("hidden");
    }
}

// ✅ FIX SCROLL FREEZE
function closePostManual() {
    const modal = document.getElementById("postModal");

    modal.classList.add("hidden");
    document.body.style.overflow = "auto";

    const vid = document.getElementById("postVideo");
    vid.pause();
    vid.src = "";

    if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
    }
}

// --- SECURITY FIX ---
const MASTER_PIN = "2026";

// ❌ REMOVED document.write

if (localStorage.getItem('vault_unlocked_permanently') === 'true') {
    document.getElementById("lockScreen").style.display = "none";
}
