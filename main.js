let news = [];

let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);
let searchButton = document.getElementById("search-button");
let url;
let page = 1;
let total_pages=0;

const getNewsApi = async () => {
  try{
    let header = new Headers({
      "x-api-key": "2sHWmEmiU2LlWcyHM0XKan71ZU3N1ZKO8qoDR1UNhC0",
    });
    url.searchParams.set('page',page);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if(data.total_hits==0){
      throw new Error("검색된 결과 값이 없습니다.");
    }
    if(response.status==200){
      news = data.articles; // saved data
      total_pages = data.total_pages;
      page = data.page;
      render();
      pagenation();

    }else{
      throw new Error(data.message)
    }

  }catch(error){
    console.log("Error is ", error.message);
    errorRender(error.message);
  }
  
};




const errorRender = (message)=>{
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`
  document.getElementById("news-board").innerHTML = errorHTML;
}

const pagenation = () =>{
  //total page 
  //which page
  //page group
  let pagenationHTML = "";
  
  let pageGroup = Math.ceil(page/5);
  let last = pageGroup*5;
  let first = last - 4;

  //last page, first page
  //first ~ last page print
  pagenationHTML = `<li class="page-item">
  <a class="page-link" href="#" onclick="moveToPage(${page-1})" aria-label="Previous">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`
  for(let i = first;i<=last;i++){
    pagenationHTML += `<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  pagenationHTML += `<li class="page-item">
  <a class="page-link" href="#" onclick="moveToPage(${page+1})" aria-label="Next">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`
  document.querySelector(".pagination").innerHTML = pagenationHTML;

}
const moveToPage = (pageNum) =>{
  //where to move?
  //moveToPage(${i})
  page = pageNum
  //get api for where i want to move.

  getNewsApi()

}


const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNewsApi();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNewsApi();
};

const getNewsByKeyword = async () => {
  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNewsApi();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${
              item.media ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
            }" alt="#">
      </div>
      <div class="col-lg-8">
        <h2>${item.title}</h2>
        <p>${
          item.summary == null || item.summary == ""
            ? "No Info"
            : item.summary.length > 200
            ? item.summary.substring(0, 200) + "..."
            : item.summary
        }</p>
        <div>${item.rights || "no source"} ${moment(
        item.published_date
      ).fromNow()}</div>
      </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
