const STORAGE_KEY = "meu-blog-azul-posts";
const postForm = document.querySelector("#post-form");
const photoInput = document.querySelector("#photo");
const captionInput = document.querySelector("#caption");
const postsContainer = document.querySelector("#posts");

let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function savePosts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return true;
  } catch (error) {
    alert("Não foi possível salvar. Tente uma imagem menor.");
    return false;
  }
}

function createCommentForm(post) {
  const form = document.createElement("form");
  form.className = "comment-form";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Escreva um comentário";
  input.setAttribute("aria-label", "Escreva um comentário");
  input.required = true;

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Comentar";

  form.append(input, button);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const comment = input.value.trim();

    if (comment === "") {
      return;
    }

    post.comments.push(comment);
    if (savePosts()) {
      renderPosts();
    } else {
      post.comments.pop();
    }
  });

  return form;
}

function renderPosts() {
  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "Ainda não há publicações. Adicione a primeira!";
    postsContainer.appendChild(message);
    return;
  }

  posts.slice().reverse().forEach(function (post) {
    const article = document.createElement("article");
    article.className = "post";

    const image = document.createElement("img");
    image.className = "post-image";
    image.src = post.image;
    image.alt = post.caption;

    const caption = document.createElement("p");
    caption.className = "post-caption";
    caption.textContent = post.caption;

    const date = document.createElement("p");
    date.className = "post-date";
    date.textContent = post.date;

    const commentsSection = document.createElement("section");
    commentsSection.className = "comments";

    const commentsTitle = document.createElement("h3");
    commentsTitle.textContent = "Comentários";

    const commentList = document.createElement("ul");
    commentList.className = "comment-list";

    post.comments.forEach(function (comment) {
      const item = document.createElement("li");
      item.textContent = comment;
      commentList.appendChild(item);
    });

    commentsSection.append(commentsTitle, commentList, createCommentForm(post));
    article.append(image, caption, date, commentsSection);
    postsContainer.appendChild(article);
  });
}

postForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const file = photoInput.files[0];
  const caption = captionInput.value.trim();

  if (!file || caption === "") {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Escolha um arquivo de imagem.");
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", function () {
    const post = {
      image: reader.result,
      caption: caption,
      date: new Date().toLocaleString("pt-BR"),
      comments: []
    };

    posts.push(post);
    if (savePosts()) {
      postForm.reset();
      renderPosts();
    } else {
      posts.pop();
    }
  });
  reader.readAsDataURL(file);
});

renderPosts();
