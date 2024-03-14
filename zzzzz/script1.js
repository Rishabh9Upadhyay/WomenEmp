document.addEventListener('DOMContentLoaded', function () {
    const addPostBtn = document.getElementById('addPostBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const submitPostBtn = document.getElementById('submitPostBtn');
  
    addPostBtn.addEventListener('click', openAddPostModal);
    closeModalBtn.addEventListener('click', closeAddPostModal);
    submitPostBtn.addEventListener('click', handlePostSubmission);
  
    // Event delegation for dynamically created "Read More" buttons
    document.body.addEventListener('click', function (event) {
      if (event.target.classList.contains('read-more-btn')) {
        const postIndex = event.target.dataset.postIndex;
        openReadMoreModal(postIndex);
      }
    });
  });
  
  function openAddPostModal() {
    const addPostModal = document.getElementById('addPostModal');
    addPostModal.style.display = 'flex';
  }
  
  function closeAddPostModal() {
    const addPostModal = document.getElementById('addPostModal');
    addPostModal.style.display = 'none';
  }
  
  function handlePostSubmission() {
    const userName = document.getElementById('userName').value;
    const postContent = document.getElementById('postContent').value;
  
    // Placeholder for actual data storage logic (e.g., API request to save post)
    // Simulating an API request using a Promise
    savePostToDatabase(userName, postContent)
      .then(() => {
        // Close the modal after successful submission
        closeAddPostModal();
  
        // Update UI with the submitted post
        updateBlogPosts(userName, postContent);
      })
      .catch(error => {
        console.error('Error submitting post:', error);
        // Handle error (e.g., display an error message to the user)
      });
  }
  
  function savePostToDatabase(userName, postContent) {
    // Placeholder for an API request to save the post to the database
    return new Promise((resolve, reject) => {
      // Simulating a successful API response after 1 second
      setTimeout(() => {
        console.log(`Post saved to database:\nName: ${userName}\nContent: ${postContent}`);
        resolve();
      }, 1000);
    });
  }
  
  function updateBlogPosts(userName, postContent) {
    const communitySection = document.getElementById('communitySection');
    console.log("this is comunity : ",communitySection);
    // Placeholder for retrieving actual posts from the database
    const postsData = [
      { name: `${userName}`, postContent: `${postContent}`}
      // Add more posts as needed
    ];
  
    communitySection.innerHTML = '';
  
    postsData.forEach((post, index) => {
      const postElement = document.createElement('div');
      postElement.classList.add('post-card');
      postElement.innerHTML = `
        <h3>${post.name}</h3>
        <p>${post.postContent.length > 150 ? post.postContent.substring(0, 150) + '...' : post.postContent}</p>
        ${post.postContent.length > 150 ? `<button class="read-more-btn" data-post-index="${index}">Read More</button>` : ''}
      `;
  
      communitySection.appendChild(postElement);
    });
  }
  
  function openReadMoreModal(index) {
    const readMoreModal = document.createElement('div');
    readMoreModal.classList.add('modal');
    readMoreModal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="closeReadMoreModal(${index})">&times;</span>
        <h3>Post Title</h3>
        <p id="fullPostContent${index}">Full post content goes here...</p>
      </div>
    `;
  
    document.body.appendChild(readMoreModal);
  }
  
  function closeReadMoreModal(index) {
    const readMoreModal = document.querySelector('.modal');
    readMoreModal.parentNode.removeChild(readMoreModal);
  }