const fetchNews = async () => {
    try {
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=c7eabae9b1d84d648800112d5fba1185`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('API request failed');
        }
        let data = await response.json();
        console.log("ye data hai", data);

        const container = document.querySelector(".container ul");
        console.log("container is defined : ", container);

        data.articles.forEach(data => {
            let li = document.createElement('li');

            let news = document.createElement('div');
            news.className = "news";
            console.log(".news ka hai", document.querySelector(".news"));
            

            let newsContent = document.createElement('div');
            newsContent.className = "news-content"; // Corrected the class name assignment

            let dataSource = document.createElement('div');
            dataSource.className = "source";
            dataSource.innerText = `${data.author}`;

            let title = document.createElement('div');
            title.className = "news-title";
            title.innerText = `${data.title}`;

            let content = document.createElement('div');
            content.className = "content";
            let cleanedText = `${data.content}`.replace(/\[+\d+ chars\]/g, '');
            content.innerText = cleanedText;

            // Append the elements to the newsContent div
            newsContent.appendChild(dataSource);
            newsContent.appendChild(title);
            newsContent.appendChild(content);

            news.appendChild(newsContent);
            // Append the newsContent div to the li element

            //creating image and addingo into news
            let newsImage = document.createElement('img');
            newsImage.className = "news-image";
            newsImage.src = data.urlToImage;
            newsImage.onerror = function () {
                // Set default image URL if the provided image URL is missing or invalid
                this.src = "/example.jpg"; // Replace 'path/to/default-image.jpg' with the URL of your default image
            };

            news.appendChild(newsImage);
            li.appendChild(news);

            // Append the li element to the container
            container.appendChild(li);

            news.addEventListener("click", () => {
                const url = data.url;
                window.open(url, "_blank");
            });
        });
        // data.articles.forEach(data =>{
            
        // })
        console.log("data", data); // Example: Logging the articles to the console
    } catch (error) {
        // Handle any errors here
        console.error(error); // Example: Logging the error to the console
    }
};

// Call the function to fetch news articles
fetchNews();


