{
  'use strict';
  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the corect article */
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author';

  function generateTitleLinks(customSelector = '') {

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);

    titleList.innerHTML = '';
  
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';
    for(let article of articles){

      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      /* insert link into html variable */
      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    
    for(let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  function generateTags() {
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles) {
      /* find tags wrapper */
      const tagList = article.querySelector(optArticleTagsSelector)

      /* make html variable with empy string */
      let html = "";
      tagList.innerHTML = html;

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      
      /* START LOOP: for each tag */
      for(let tag of articleTagsArray) {
        /* generate HTML of the link */
        /* add generated code to html variable */
        html += '<li><a href="#tag-' + tag + '">' + tag + '</a></li>' + '\n';
      } /* END LOOP: fora each tag */

      /* insert HTML of all the links into the tags wrapper */
      tagList.innerHTML = html;

    }
    /* END LOOP: for every article: */
  }

  generateTags();

  function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for(activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');
    } /* END LOOP: for each active tag link */

    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for(let tagLink of tagLinks) {
      /* add class active */
      tagLink.classList.add('active');

    } /* END LOOP: for each found tag link */
  
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
  
  function addClickListenersToTags(){
    /* find all links to tags */
    const links = document.querySelectorAll('.post-tags a');
    /* START LOOP: for each link */
    for(let link of links) {

      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    } /* END LOOP: for each link */
  }
  
  addClickListenersToTags();

  function generateAuthors() {
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles) {
      /* find author wrapper 'post-author' */
      const author = article.querySelector(optArticleAuthorSelector)

      /* make html variable with empy string */
      let html = "";
      author.innerHTML = html;

      /* get authors from data-authors attribute */
      const articleAuthor = article.getAttribute('data-author');

      /* generate HTML of the link */
      /* add generated code to html variable */
      html = 'by <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';

      /* insert HTML of all the links into the author wrapper */
      author.innerHTML = html;
    } /* END LOOP: for every article: */
  }

  generateAuthors();

  function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    
    /* make a new constant "author" and extract tag from the "href" constant */
    const author = href.replace('#author-', '');
    
    /* find all tag links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    /* START LOOP: for each active author link */
    for(let activeAuthorLink of activeAuthorLinks) {
      /* remove class active */
      activeAuthorLink.classList.remove('active');
    } /* END LOOP: for each active tag link */

    /* find all  links with "href" attribute equal to the "href" constant */
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found author link */
    for(let authorLink of authorLinks) {
      /* add class active */
      authorLink.classList.add('active');


    } /* END LOOP: for each found tag link */
  
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }
  
  function addClickListenersToAuthors(){
    /* find all links to authors */
    const links = document.querySelectorAll('.post-author a');

    /* START LOOP: for each link */
    for(let link of links) {
      /* add authorClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
    } /* END LOOP: for each link */
  }
  
  addClickListenersToAuthors();

}

