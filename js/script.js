{
  'use strict';

    const opt = {
      optArticleSelector: '.post',
      optTitleSelector: '.post-title',
      optTitleListSelector: '.titles',
      optArticleTagsSelector: '.post-tags .list',
      optArticleAuthorSelector: '.post-author',
      optTagsListSelector: '.tags.list',
      optCloudClassCount: 5,
      optCloudClassPrefix: 'tag-size-',
    };

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

  function generateTitleLinks(customSelector = '') {

    /* remove contents of titleList */
    const titleList = document.querySelector(opt.optTitleListSelector);

    titleList.innerHTML = '';
  
    /* for each article */
    const articles = document.querySelectorAll(opt.optArticleSelector + customSelector);

    let html = '';
    for(let article of articles){

      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(opt.optTitleSelector).innerHTML;

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

  function calculateTagsParams(tags) {
    const params = {max: 0, min: 999999};
    for(let tag in tags) {
      if(tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if(tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  }

  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opt.optCloudClassCount - 1) + 1);
    return opt.optCloudClassPrefix + classNumber;
  }

  function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(opt.optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles) {
      /* find tags wrapper */
      const tagList = article.querySelector(opt.optArticleTagsSelector)

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
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>' + '\n';
        /* add generated code to html variable */
        html += linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags.hasOwnProperty(tag)) {
          /* [NEW] add generated code to allTags array */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

      } /* END LOOP: fora each tag */

      /* insert HTML of all the links into the tags wrapper */
      tagList.innerHTML = html;

    } /* END LOOP: for every article: */

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');

    const tagsParams = calculateTagsParams(allTags);

    /* [NEW] add html from allTags to tagList */
    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags) {
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsHTML += '<li><a href="#tag-' + tag +'" class="' + calculateTagClass(allTags[tag], tagsParams ) + '">' +  tag + '</a></li> ';
    } /* [NEW] END LOOP: for each tag in allTags: */

    /* [NEW] add html from allTagsHTML to tagLIst */
    tagList.innerHTML = allTagsHTML;
  }

  generateTags();

  function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    console.log(href);
    
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
    const links = document.querySelectorAll('.post-tags a, .tags a');
    /* START LOOP: for each link */
    for(let link of links) {

      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    } /* END LOOP: for each link */
  }
  
  addClickListenersToTags();

  function generateAuthors() {
    /* create variable for storing all authors */
    let allAuthors = {};

    /* find all articles */
    const articles = document.querySelectorAll(opt.optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles) {
      /* find author wrapper 'post-author' */
      const author = article.querySelector(opt.optArticleAuthorSelector)

      /* make html variable with empy string */
      let html = "";
      author.innerHTML = html;

      /* get authors from data-authors attribute */
      const articleAuthor = article.getAttribute('data-author');

      /* add article author to allAuthors */
      if(!allAuthors.hasOwnProperty(articleAuthor)) {
        /* if property (author) does not exist */
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      /* generate HTML of the link */
      /* add generated code to html variable */
      html = 'by <a href="#author-' + articleAuthor.replace(' ', '-') + '">' + articleAuthor + '</a>';

      /* insert HTML of all the links into the author wrapper */
      author.innerHTML = html;
    } /* END LOOP: for every article: */
    
    let allAuthorsHTML = '';
    for(let auth in allAuthors) {
      allAuthorsHTML += '<li><a href="#author-' + auth.replace(' ', '-') + '" >' + auth + ' (' + allAuthors[auth] + ')</a>';
    }

    const authorsList = document.querySelector('.list.authors')
    authorsList.innerHTML = allAuthorsHTML;
  }

  generateAuthors();

  function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    console.log('href:', href);
    
    /* make a new constant "author" and extract tag from the "href" constant */
    const author = href.replace('#author-', '').replace('-', ' ');
    
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
    const links = document.querySelectorAll('.post-author a, .authors a');

    /* START LOOP: for each link */
    for(let link of links) {
      /* add authorClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
    } /* END LOOP: for each link */
  }
  
  addClickListenersToAuthors();

}

